import jwtDecode from 'jwt-decode'
import {assocPath, isNil, pick} from 'ramda'

const DEV_URL = 'https://stage.dropthought.com'
const PROD_URL = 'https://app.dropthought.com'
const HOST = __DEV__ ? DEV_URL : PROD_URL
export const BASE_URL = `${HOST}/dtapp`
const RENEW_ENDPOINT = '/api/token/renew'

export const DEFAULT_TIMEOUT = 30000 // default timeout: 30 seconds

const defaultRequestConfig = {
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
}

/** @type {() => Promise<string>} */
let g_authToken = () => Promise.resolve(undefined)

/** @type {() => Promise<string>} */
let g_refreshToken = () => Promise.resolve(undefined)

/** @type {(authTokens: AuthToken) => Promise<undefined>} */
let g_storeTokens = () => Promise.resolve(undefined)

/**
 * @template T
 * @type {(url: string) => Promise<T>}
 */
let g_loadCache = (url) => Promise.resolve(undefined)

/** @type {(url: string, response: {data: any, status: number, statusText: string}) => Promise<undefined>} */
let g_saveCache = (url, response) => Promise.resolve(undefined)

/**
 * @typedef {object}  APIInitializeParams
 * @property {string=} baseURL optional, if want to overwrite the baseURL
 * @property {number=} timeout optional, if want to overwrite the default timeout
 * @property {()=>Promise<string>=} authToken - optional, a function that returns the auth token or api-key
 * @property {()=>Promise<string>=} refreshToken - optional, a function that returns the refresh token
 * @property {(authTokens: AuthToken)=>Promise<any>=} storeTokens - optional, a function that tells the engine how to store tokens
 * @property {(url: string)=>Promise<any>=} loadCache - optional, a function that tells the engine how to load cache from this url
 * @property {(url: string, response: {data: any, status: number, statusText: string, headers: object})=>Promise<any>=} saveCache - optional, a function that tells the engine how to save cache
 * @property {string=} apiKey - or simply given the apiKey, optional
 */

/**
 * @param {APIInitializeParams} param
 */
export function apiInitialize(param = {}) {
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
        defaultRequestConfig.baseURL = baseURL
    }
    if (!isNil(timeout)) {
        defaultRequestConfig.timeout = timeout
    }

    if (authToken) {
        g_authToken = authToken
    } else if (apiKey) {
        g_authToken = () => apiKey
    }

    if (refreshToken) {
        g_refreshToken = refreshToken
    }

    if (storeTokens) {
        g_storeTokens = storeTokens
    }

    if (loadCache) {
        g_loadCache = loadCache
    }

    if (saveCache) {
        g_saveCache = saveCache
    }
}

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

/**
 * @template T
 * @param {string} url
 * @param {RequestConfig} requestConfig
 * @returns {import('axios').AxiosPromise<T>}
 */
async function fetchWithTimeout(url, requestConfig) {
    // setting fetch abort (it is supported after RN 0.60)
    // eslint-disable-next-line no-undef
    const abortController = new AbortController()
    const cancelTimeout =
        requestConfig.timeout || defaultRequestConfig.timeout || DEFAULT_TIMEOUT
    const timeoutId = setTimeout(() => {
        abortController.abort()
    }, cancelTimeout)

    // compose fetch params
    const params = Object.keys(requestConfig.params || {})
        .filter((key) => !isNil(requestConfig.params[key]))
        .map((key) => `${key}=${requestConfig.params[key]}`)
        .join('&')
    // compose fetch full URL
    const fetchURL =
        (requestConfig.baseURL || defaultRequestConfig.baseURL) +
        url +
        `?${params}`

    return await fetch(fetchURL, {
        method: requestConfig.method || 'GET',
        headers: {
            ...defaultRequestConfig.headers,
            ...requestConfig.headers,
        },
        body: JSON.stringify(requestConfig.data),
        signal: abortController.signal,
    })
        .then(async (r) => {
            const isJSONContent =
                r.headers.get('content-type').indexOf('application/json') !== -1

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
 * @param {RequestConfig} requestConfig
 * @returns {RequestConfig}
 */
async function authorizeConfig(requestConfig) {
    const token = await g_authToken()
    if (!token) return requestConfig

    return assocPath(
        ['headers', 'Authorization'],
        `Bearer ${token}`,
        requestConfig,
    )
}

/** @returns {Promise<any>} */
const tokenRenew = async (timeout = DEFAULT_TIMEOUT) => {
    const refreshToken = await g_refreshToken()
    if (!refreshToken) return

    return fetchWithTimeout(RENEW_ENDPOINT, {
        method: 'POST',
        data: {
            refreshToken,
        },
        timeout,
        headers: {
            Authorization: refreshToken,
        },
    }).then((response) => {
        return g_storeTokens(response.data)
    })
}

/**
 * it checks if the authToken(accessToken) is valid (check the expiration date)
 * if it is invalid, renew token
 * @param {number=} timeout
 */
const renewTokenIfNeeded = async (timeout) => {
    const refreshToken = await g_refreshToken()
    if (!refreshToken) return

    const accessToken = await g_authToken()
    if (!accessToken) return

    if (!isTokenValid(accessToken)) {
        try {
            await tokenRenew(timeout)
        } catch (e) {
            console.log('token renew failed', e.message)
            throw e
        }
    }
}

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
 * @template T
 * @param {string} url
 * @param {RequestConfig} requestConfig
 * @returns {import('axios').AxiosPromise<T>}
 */
export async function apiRequest(url, requestConfig) {
    let authRequired = false

    if (requestConfig.headers?.Authorization || requestConfig.authRequired) {
        authRequired = true

        // refresh token before sending out actual request
        await renewTokenIfNeeded(requestConfig.timeout)
        requestConfig = await authorizeConfig(requestConfig)
    }

    // read cached response
    if (requestConfig.cache) {
        const result = await g_loadCache(url)
        if (result) return result
    }

    // if auth is required, but there's no authorization, fail early before making a request
    if (authRequired && !requestConfig.headers?.Authorization) {
        return throwRequestError({
            status: 401,
            statusText: '401',
            data: {},
            headers: {},
        })
    }

    let response = await fetchWithTimeout(url, requestConfig)

    // if this request is authRequired and the response status is 401, try to renew token again
    if (authRequired && response.status === 401) {
        await tokenRenew(requestConfig.timeout)

        // query again with renewed token
        requestConfig = await authorizeConfig(requestConfig)
        response = await fetchWithTimeout(url, requestConfig)
    }

    // store response if cache is true
    if (requestConfig.cache) {
        await g_saveCache(
            url,
            pick(['data', 'status', 'statusText', 'headers'], response),
        )
    }

    return response
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
