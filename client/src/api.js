import url from 'url';
import R from 'ramda';

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

class TokenStorage {
    accessToken = null;
    refreshToken = null;

    setAccessToken(token) {
        this.accessToken = token;
    }

    getAccessToken() {
        return this.accessToken;
    }

    setRefreshToken(token) {
        this.refreshToken = token;
    }

    getRefreshToken() {
        return this.refreshToken;
    }
}

export default class Api {
    constructor(apiUrl, {
        fetch = window.fetch.bind(window),
        tokenStorage = new TokenStorage(),
    } = {}) {
        this.apiUrl = normalizeUrl(apiUrl);
        this._fetch = fetch;
        this.tokenStorage = tokenStorage;
    }

    async init() {
        if (this.tokenStorage.getAccessToken()) {
            return Promise.resolve();
        }

        return this.getAnonymousToken();
    }

    async fetch(input, _init) {
        const init = R.set(
            R.lensPath(['headers', 'Content-Type']),
            'application/json',
            _init,
        );

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

        this.tokenStorage.setAccessToken(result.access_token);
        this.tokenStorage.setRefreshToken(null);

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

        this.tokenStorage.setAccessToken(result.access_token);
        this.tokenStorage.setRefreshToken(result.refresh_token);

        return result;
    }

    register({ username, password }) {
        return this.fetch(this.getResourceUrl('users'), {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    getPolls({ limit, offset } = {}) {
        const url = this.getResourceUrl('polls', { limit, offset });
        const accessToken = this.tokenStorage.getAccessToken();

        return this.fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    getPoll(id) {
        const url = this.getResourceUrl(`polls/${id}`);
        const accessToken = this.tokenStorage.getAccessToken();

        return this.fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    createPoll(values) {
        const url = this.getResourceUrl(`polls`);
        const accessToken = this.tokenStorage.getAccessToken();

        return this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }

    submitVote(pollId, choice) {
        const url = this.getResourceUrl(`polls/${pollId}/votes`);
        const accessToken = this.tokenStorage.getAccessToken();

        this.fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                option: choice,
            }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }
}
