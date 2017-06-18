import fetchMock from 'fetch-mock';
import Api from './api';

const credentialsStore = {
    getCredentials: jest.fn(),
    setCredentials: jest.fn(),
};

const anonymousCredentialsStore = {
    getCredentials: jest.fn(),
    setCredentials: jest.fn(),
};

const api = new Api('/', {
    fetch: fetchMock.fetchMock,
    credentialsStore,
    anonymousCredentialsStore,
});

describe('API gateway', () => {
    describe('getAnonymousToken', () => {
        const request = {
            grant_type: 'client_credentials',
        };
        const response = {
            access_token: 'access token',
        };
        let result;

        beforeAll(async () => {
            fetchMock.restore().post((url, opts) => {
                expect(url).toBe('/token');
                expect(opts.method).toBe('POST');
                expect(JSON.parse(opts.body)).toEqual(request);

                return true;
            }, response);

            anonymousCredentialsStore.setCredentials.mockReset();

            result = await api.getAnonymousToken();
        });

        it('must return the response', () => {
            expect(result).toEqual(response);
        });

        it('must store new credentials', () => {
            expect(anonymousCredentialsStore.setCredentials).toHaveBeenCalledTimes(1);
            expect(anonymousCredentialsStore.setCredentials).toHaveBeenCalledWith({
                accessToken: response.access_token,
            });
        });
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

        beforeAll(async () => {
            fetchMock.restore().post((url, opts) => {
                expect(url).toBe('/token');
                expect(opts.method).toBe('POST');
                expect(JSON.parse(opts.body)).toEqual(request);

                return true;
            }, response);

            credentialsStore.setCredentials.mockReset();

            result = await api.login('foo', 'bar');
        });

        it('must return the response', () => {
            expect(result).toEqual(response);
        });

        it('must store new credentials', () => {
            expect(credentialsStore.setCredentials).toHaveBeenCalledTimes(1);
            expect(credentialsStore.setCredentials).toHaveBeenCalledWith({
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
            });
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

        it('must return the response', async () => {
            credentialsStore.getCredentials.mockReturnValueOnce({
                accessToken: 'my_token',
            });

            fetchMock.restore().get((url, opts) => {
                expect(url).toBe('/polls');
                expect(opts.method).toBe('GET');
                expect(opts.headers.Authorization).toEqual(`Bearer my_token`);

                return true;
            }, response);

            const result = await api.getPolls();

            expect(result).toEqual(response);
        });

        it('must must pass offset and limit as query parameters', async () => {
            credentialsStore.getCredentials.mockReturnValueOnce({
                accessToken: 'my_token',
            });

            fetchMock.restore().get((url, opts) => {
                expect(url).toBe('/polls?limit=4&offset=3');
                expect(opts.method).toBe('GET');
                expect(opts.headers.Authorization).toEqual(`Bearer my_token`);

                return true;
            }, response);

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
            credentialsStore.getCredentials.mockReturnValueOnce({
                accessToken: 'my_token',
            });

            fetchMock.restore().get((url, opts) => {
                expect(url).toBe('/polls/13');
                expect(opts.method).toBe('GET');
                expect(opts.headers.Authorization).toEqual(`Bearer my_token`);

                return true;
            }, response);

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
            credentialsStore.getCredentials.mockReturnValueOnce({
                accessToken: 'my_token',
            });

            fetchMock.restore().mock((url, opts) => {
                expect(url).toBe('/polls');
                expect(opts.method).toBe('POST');
                expect(opts.headers.Authorization).toEqual(`Bearer my_token`);

                return true;
            }, response);

            const result = await api.createPoll(request);

            expect(result).toEqual(response);
        });
    });

    describe('vote', () => {
        it('must send a request', async () => {
            credentialsStore.getCredentials.mockReturnValueOnce({
                accessToken: 'my_token',
            });

            fetchMock.restore().mock((url, opts) => {
                expect(url).toBe('/polls/21/votes');
                expect(opts.method).toBe('POST');
                expect(opts.headers.Authorization).toBe('Bearer my_token');
                expect(JSON.parse(opts.body)).toEqual({ option: 'foo' });

                return true;
            }, {});

            await api.vote(21, 'foo');
        })
    })
});
