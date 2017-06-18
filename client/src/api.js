import url from 'url';
import R from 'ramda';
import jwtDecode from 'jwt-decode';

/**
 * Returns a function for which modifies url
 *
 * Provided modifier function must accept urlObj corresponding to the original url (see documentation for
 * {@link url|url module} and return an object to be merged with urlObj to be used in construction of modified url.
 *
 * @param {function} modifier
 * @returns {function} URL modifier
 */
const createUrlModifier = modifier => R.pipe(
    url.parse,
    urlObj => ({
        ...urlObj,
        ...modifier(urlObj),
    }),
    url.format,
);

/**
 * Ensures that url contains protocol and a pathname
 *
 * @param {string} url
 * @returns {string} Normalized url
 */
// TODO: Find more descriptive functions to default values according to schema
const normalizeUrl = createUrlModifier(
    ({ protocol, pathname }) => ({
        pathname: pathname || '/',
    })
);

/**
 * Appends query parameters to given url
 *
 * @param {object|string} query
 * @param {string} url
 * @returns {string} Modified url
 */
const appendQueryToUrl = R.pipe(
    R.defaultTo({}),
    // Remove nil and undefined values from query object
    R.reject(R.isNil),
    // Create a function that always return an object with query object under 'query' key
    query => () => ({ query }),
    // Use created function as url modifier
    createUrlModifier,
);

class LocalStorageStore {
    key = null;

    constructor(key) {
        this.key = key;
    }

    getCredentials() {
        return JSON.parse(localStorage.getItem(this.key));
    }

    setCredentials(value) {
        if (!value) {
            localStorage.removeItem(this.key);

            return;
        }

        localStorage.setItem(this.key, JSON.stringify(value));
    }
}

export default class Api {
    constructor(apiUrl, {
        fetch = window.fetch.bind(window),
        credentialsStore = new LocalStorageStore('credentials'),
        anonymousCredentialsStore = new LocalStorageStore('anonymous_credentials'),
    } = {}) {
        this.apiUrl = normalizeUrl(apiUrl);
        this._fetch = fetch;
        this.credentialsStore = credentialsStore;
        this.anonymousCredentialsStore = anonymousCredentialsStore;
    }

    getCredentials() {
        return this.credentialsStore.getCredentials() ||
            this.anonymousCredentialsStore.getCredentials() ||
            {};
    }

    setCredentials(value) {
        return this.credentialsStore.setCredentials(value);
    }

    setAnonymousCredentials(value) {
        return this.anonymousCredentialsStore.setCredentials(value);
    }

    async init() {
        const { accessToken } = this.getCredentials();

        if (accessToken) {
            return Promise.resolve();
        }

        await this.getAnonymousToken();
    }

    async fetch(input, init = {}) {
        init = R.mergeDeepRight({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }, init);

        const { accessToken } = this.getCredentials();

        if (accessToken) {
            init = R.set(
                R.lensPath(['headers', 'Authorization']),
                `Bearer ${accessToken}`
            )(init);
        }

        const response = await this._fetch(input, init);
        const body = await response.json();
        const code = response.status;

        if (!(code >= 200 && code < 300)) {
            const error = new Error(`Request failed with status ${code}`);

            error.code = code;
            error.response = body;

            return Promise.reject(error);
        }

        return body;
    }

    getResourceUrl(resource, query) {
        const resourceUrl = `${this.apiUrl}${resource}`;

        return appendQueryToUrl(query)(resourceUrl);
    }

    async getAnonymousToken() {
        const result = await this.fetch(this.getResourceUrl('token'), {
            method: 'POST',
            body: JSON.stringify({ grant_type: 'client_credentials' }),
        });

        const {
            access_token: accessToken,
        } = result;

        this.setAnonymousCredentials({
            accessToken,
        });

        return result;
    }

    async login(username, password) {
        const result = await this.fetch(this.getResourceUrl('token'), {
            method: 'POST',
            body: JSON.stringify({
                grant_type: 'password',
                username,
                password,
            }),
        });

        const {
            access_token: accessToken,
            refresh_token: refreshToken,
        } = result;

        this.setCredentials({
            accessToken,
            refreshToken,
        });

        return result;
    }

    async logout() {
        this.credentialsStore.setCredentials(null);

        await this.init();

        return this.getAnonymousToken();
    }

    getUserInfo() {
        const { accessToken } = this.getCredentials();

        return Promise.resolve(jwtDecode(accessToken));
    }

    async register({ username, password }) {
        const result = await this.fetch(this.getResourceUrl('users'), {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        const {
            access_token: accessToken,
            refresh_token: refreshToken,
        } = result;

        this.setCredentials({
            accessToken,
            refreshToken,
        });

        return result;
    }

    getPolls({ limit, offset } = {}) {
        const url = this.getResourceUrl('polls', { limit, offset });

        return this.fetch(url);
    }

    getPoll(id) {
        const url = this.getResourceUrl(`polls/${id}`);

        return this.fetch(url);
    }

    createPoll(values) {
        const url = this.getResourceUrl(`polls`);

        return this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(values),
        });
    }

    vote(pollId, choice) {
        const url = this.getResourceUrl(`polls/${pollId}/votes`);

        return this.fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                option: choice,
            }),
        });
    }

    createOption(pollId, option) {
        const url = this.getResourceUrl(`polls/${pollId}/options`)

        return this.fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                option,
            }),
        });
    }
}
