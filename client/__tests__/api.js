// import fetch from 'whatwg-fetch';
import nock from 'nock';
import fetch from 'node-fetch';
import Api from '../src/api';

const API_URI = 'http://localhost:8080';

const [accessToken, refreshToken] = [
    'this_access_token',
    'this_refresh_token',
];

const tokenStorage = {
    setAccessToken: jest.fn(),
    getAccessToken: () => accessToken,
    setRefreshToken: jest.fn(),
    getRefreshToken: jest.fn(() => refreshToken),
};

const api = new Api(API_URI, {
    fetch,
    tokenStorage,
});

describe('API gateway', () => {
    beforeAll(() => {
        // nock.recorder.rec();
        // nock.enableNetConnect();
    });

    afterEach(() => {
        Array.of(
            'setAccessToken',
            'setRefreshToken',
        ).forEach(method => {
            tokenStorage[method].mockReset();
        })
    });

    describe('getAnonymousToken', () => {
        const request = {
            grant_type: 'client_credentials',
        };
        const response = {
            access_token: 'access token',
        };
        let result;

        beforeEach(async () => {
            nock(API_URI).post('/token', request).reply(200, response);

            result = await api.getAnonymousToken();
        });

        it('must return the response', () => {
            expect(result).toEqual(response);
        });

        it('must set the access token in the storage', () => {
            expect(tokenStorage.setAccessToken).toHaveBeenCalledTimes(1);
            expect(tokenStorage.setAccessToken).toHaveBeenCalledWith(response.access_token);
        });

        it('must reset the refresh token in the storage', () => {
            expect(tokenStorage.setRefreshToken).toHaveBeenCalledTimes(1);
            expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith(null);
        })
    });

    describe('login', () => {
        const request = {
            grant_type: 'password',
            username: 'foo',
            password: 'bar',
        };
        const response = {
            access_token: 'access token',
            refresh_token: 'refresh token',
        };
        let result;

        beforeEach(async () => {
            nock(API_URI).post('/token', request).reply(200, response);

            result = await api.login('foo', 'bar');
        });

        it('must return the response', () => {
            expect(result).toEqual(response);
        });

        it('must set the access token in the storage', () => {
            expect(tokenStorage.setAccessToken).toHaveBeenCalledTimes(1);
            expect(tokenStorage.setAccessToken).toHaveBeenCalledWith(response.access_token);
        });

        it('must set the refresh token in the storage', () => {
            expect(tokenStorage.setRefreshToken).toHaveBeenCalledTimes(1);
            expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith(response.refresh_token);
        });
    });

    describe('getPolls', () => {
        const response = {
            items: [{
                title: 'foo',
                options: [
                    'bar',
                    'baz',
                ],
            }],
            total: 4,
        };

        it.only('must return the response', async () => {
            nock(API_URI).get(`/polls`)
                .matchHeader('Authorization', `Bearer ${tokenStorage.getAccessToken()}`)
                .reply(200, response);

            const result = await api.getPolls();

            expect(result).toEqual(response);
        });

        it('must must pass offset and limit as query parameters', async () => {
            nock(API_URI).get(`/polls?limit=4&offset=3`).reply(200, response);

            const result = await api.getPolls({ offset: 3, limit: 4 });

            expect(result).toEqual(response);
        });
    });

    describe('getPoll', () => {
        const response = {
            title: 'foo',
            options: [
                'bar',
                'baz',
            ],
        };

        it('must return the response', async () => {
            nock(API_URI).get('/polls/13')
                .matchHeader('Authorization', `Bearer ${tokenStorage.getAccessToken()}`)
                .reply(200, response);

            const result = await api.getPoll(13);

            expect(result).toEqual(response);
        });
    });

    describe('createPoll', () => {
        const request = {
            title: 'foo',
            options: [
                'bar',
                'baz',
            ],
        };
        const response = {
            id: 21,
        };

        it('must send poll details', async () => {
            nock(API_URI).post('/polls', request).reply(201, response);

            const result = await api.createPoll(request);

            expect(result).toEqual(response);
        });
    });
});