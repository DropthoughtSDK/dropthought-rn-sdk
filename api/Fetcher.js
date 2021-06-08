import jwtDecode from 'jwt-decode'
import {isNil, pick} from 'ramda'

const RENEW_ENDPOINT = '/api/token/renew'
const DT_API_KEY_HEADER = 'X-DT-API-KEY'

const DEFAULT_TIMEOUT = 30000 // default timeout: 30 seconds

/**
 * @param {import('axios').AxiosResponse<any>} mockAxiosResponse
 */
export const throwRequestError = (mockAxiosResponse) => {
    throw {
        response: mockAxiosResponse,
        name: 'RequestError',
        message:
            mockAxiosResponse.data.error ||
            `Request failed with status code ${mockAxiosResponse.status}`,
    }
}

/**
 * @param {Error} error
 */
export const isRequestTimeoutError = (error) => error.name === 'RequestTimeout'

/**
 * @param {Error} error
 */
export const isNoInternetError = (error) =>
    error.message === 'Network request failed'

const isTokenValid = (jwtToken) => {
    let jwtPayload

    // decode token
    try {
        jwtPayload = jwtDecode(jwtToken)

        // check expiration date
        if (Date.now() >= jwtPayload.exp * 1000) {
            return false
        } else {
            return jwtPayload
        }
    } catch (e) {
        console.log('decode jwt failed', e)
        return false
    }
}

/**
 * @param {RequestConfig} requestConfig
 * @param {object} header
 * @returns {RequestConfig}
 */
const setRequestHeader = (requestConfig, header = {}) => {
    const {headers = {}, ...restRequestConfig} = requestConfig
    return {
        headers: {
            ...headers,
            ...header,
        },
        ...restRequestConfig,
    }
}

/**
 * @typedef {object}  InitializeParams
 * @property {string=} baseURL optional, if want to overwrite the baseURL
 * @property {number=} timeout optional, if want to overwrite the default timeout
 * @property {()=>Promise<string>=} authToken - optional, a function that returns the auth token or api-key
 * @property {()=>Promise<string>=} refreshToken - optional, a function that returns the refresh token
 * @property {(authTokens: AuthToken)=>Promise<any>=} storeTokens - optional, a function that tells the engine how to store tokens
 * @property {(url: string)=>Promise<any>=} loadCache - optional, a function that tells the engine how to load cache from this url
 * @property {(url: string, response: {data: any, status: number, statusText: string, headers: object})=>Promise<any>=} saveCache - optional, a function that tells the engine how to save cache
 * @property {string=} apiKey - or simply given the apiKey, optional
 */
export class Fetcher {
    defaultRequestConfig = {
        baseURL: '',
        timeout: DEFAULT_TIMEOUT,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }

    /** @type {() => Promise<string>} */
    authToken = () => Promise.resolve(undefined)

    /** @type {string | undefined} this is for api key version2 */
    apiKey = undefined

    /** @type {() => Promise<string>} */
    refreshToken = () => Promise.resolve(undefined)

    /** @type {(authTokens: AuthToken) => Promise<undefined>} */
    storeTokens = () => Promise.resolve(undefined)

    /**
     * @template T
     * @type {(url: string) => Promise<T>}
     */
    loadCache = (url) => Promise.resolve(undefined)

    /** @type {(url: string, response: {data: any, status: number, statusText: string}) => Promise<undefined>} */
    saveCache = (url, response) => Promise.resolve(undefined)

    /**
     * @param {InitializeParams} param
     */
    constructor(param = {}) {
        this.init(param)
    }

    /**
     * @param {InitializeParams} param
     */
    init(param = {}) {
        const {
            baseURL,
            timeout,
            authToken,
            apiKey,
            refreshToken,
            storeTokens,
            loadCache,
            saveCache,
        } = param

        if (baseURL) {
            this.defaultRequestConfig.baseURL = baseURL
        }
        if (!isNil(timeout)) {
            this.defaultRequestConfig.timeout = timeout
        }

        if (authToken) {
            this.authToken = authToken
        } else if (apiKey) {
            this.apiKey = apiKey
            this.authToken = () => Promise.resolve(undefined)
        }

        if (refreshToken) {
            this.refreshToken = refreshToken
        }

        if (storeTokens) {
            this.storeTokens = storeTokens
        }

        if (loadCache) {
            this.loadCache = loadCache
        }

        if (saveCache) {
            this.saveCache = saveCache
        }
    }

    /**
     * @template T
     * @param {string} url
     * @param {RequestConfig} requestConfig
     * @returns {import('axios').AxiosPromise<T>}
     */
    async fetchWithTimeout(url, requestConfig) {
        // setting fetch abort (it is supported after RN 0.60)
        // eslint-disable-next-line no-undef
        const abortController = new AbortController()
        const cancelTimeout =
            requestConfig.timeout ||
            this.defaultRequestConfig.timeout ||
            DEFAULT_TIMEOUT
        const timeoutId = setTimeout(() => {
            abortController.abort()
        }, cancelTimeout)

        // compose fetch params
        const params = Object.keys(requestConfig.params || {})
            .filter((key) => !isNil(requestConfig.params[key]))
            .map(
                (key) =>
                    `${key}=${encodeURIComponent(requestConfig.params[key])}`,
            )
            .join('&')
        // compose fetch full URL
        const fetchURL =
            (requestConfig.baseURL || this.defaultRequestConfig.baseURL) +
            url +
            `?${params}`

        return await fetch(fetchURL, {
            method: requestConfig.method || 'GET',
            headers: {
                ...this.defaultRequestConfig.headers,
                ...requestConfig.headers,
            },
            body: requestConfig.body || JSON.stringify(requestConfig.data),
            signal: abortController.signal,
        })
            .then(async (r) => {
                const isJSONContent =
                    r.headers
                        .get('content-type')
                        .indexOf('application/json') !== -1

                const headers = {}
                if (r.headers) {
                    for (const [key, value] of r.headers.entries()) {
                        headers[key] = value
                    }
                }

                /** @type {import('axios').AxiosResponse<any>} */
                let mockAxiosResponse = {}
                mockAxiosResponse.status = r.status
                mockAxiosResponse.data = isJSONContent
                    ? await r.json()
                    : await r.text()
                mockAxiosResponse.headers = headers
                mockAxiosResponse.statusText = r.status.toString()

                if (r.status >= 200 && r.status < 300) {
                    return mockAxiosResponse
                }
                throwRequestError(mockAxiosResponse)
            })
            .catch((err) => {
                if (err.name === 'AbortError' || err.message === 'Aborted') {
                    throw {
                        name: 'RequestTimeout',
                        message: `Request Timeout of ${cancelTimeout}ms.`,
                    }
                }
                throw err
            })
            .finally(() => {
                // clear timeout when request is final, success or failed
                clearTimeout(timeoutId)
            })
    }

    /**
     * set the auth token to config
     * @private
     * @param {RequestConfig} requestConfig
     * @returns {Promise<RequestConfig>}
     */
    async authorizeConfig(requestConfig) {
        if (this.apiKey) {
            return setRequestHeader(requestConfig, {
                [DT_API_KEY_HEADER]: this.apiKey,
            })
        }
        const token = await this.authToken()
        if (!token) return requestConfig

        return setRequestHeader(requestConfig, {
            Authorization: `Bearer ${token}`,
        })
    }

    /** @returns {Promise<any>} */
    async tokenRenew(timeout = DEFAULT_TIMEOUT) {
        const refreshToken = await this.refreshToken()
        if (!refreshToken) return

        return this.fetchWithTimeout(RENEW_ENDPOINT, {
            method: 'POST',
            data: {
                refreshToken,
            },
            timeout,
        }).then((response) => {
            return this.storeTokens(response.data)
        })
    }

    /**
     * it checks if the authToken(accessToken) is valid (check the expiration date)
     * if it is invalid, renew token
     * @private
     * @param {number=} timeout
     */
    async renewTokenIfNeeded(timeout) {
        const refreshToken = await this.refreshToken()
        if (!refreshToken) return

        const accessToken = await this.authToken()
        if (!accessToken) return

        if (!isTokenValid(accessToken)) {
            try {
                await this.tokenRenew(timeout)
            } catch (e) {
                console.log('token renew failed', e.message)
                throw e
            }
        }
    }

    /**
     * @public
     * @template T
     * @param {string} url
     * @param {RequestConfig} requestConfig
     * @returns {import('axios').AxiosPromise<T>}
     */
    async request(url, requestConfig) {
        let authRequired = false

        if (
            requestConfig.headers?.Authorization ||
            requestConfig.authRequired
        ) {
            authRequired = true

            // refresh token before sending out actual request
            await this.renewTokenIfNeeded(requestConfig.timeout)
            requestConfig = await this.authorizeConfig(requestConfig)
        }

        // read cached response
        if (requestConfig.cache) {
            const result = await this.loadCache(url)
            if (result) return result
        }

        // if auth is required, but there's no authorization, fail early before making a request
        if (
            authRequired &&
            !requestConfig.headers?.Authorization &&
            !this.apiKey
        ) {
            return throwRequestError({
                status: 401,
                statusText: '401',
                data: {},
                headers: {},
            })
        }

        let response = await this.fetchWithTimeout(url, requestConfig)

        // if this request is authRequired and the response status is 401, try to renew token again
        if (authRequired && response.status === 401 && !this.apiKey) {
            await this.tokenRenew(requestConfig.timeout)

            // query again with renewed token
            requestConfig = await this.authorizeConfig(requestConfig)
            response = await this.fetchWithTimeout(url, requestConfig)
        }

        // store response if cache is true
        if (requestConfig.cache) {
            await this.saveCache(
                url,
                pick(['data', 'status', 'statusText', 'headers'], response),
            )
        }

        return response
    }
}

/**
 * @typedef {Object} AuthToken
 * @property {string} accessToken
 * @property {string} refreshToken
 */

/**
 * @typedef {Object} CustomRequestConfig
 * @property {boolean} authRequired
 * @property {boolean} cache
 */

/**
 * @typedef {import('axios').AxiosRequestConfig & CustomRequestConfig} RequestConfig
 */
