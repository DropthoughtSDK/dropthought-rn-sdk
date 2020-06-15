import {assocPath} from 'ramda'

const DEV_URL = 'https://stage.dropthought.com'
const PROD_URL = 'https://app.dropthought.com'
const HOST = __DEV__ ? DEV_URL : PROD_URL
export const BASE_URL = `${HOST}/dtapp`
// const RENEW_ENDPOINT = '/dtapp/api/token/renew'

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

/**
 * @typedef {object}  APIInitializeParams
 * @property {string=} baseURL optional, if want to overwrite the baseURL
 * @property {()=>Promise<string>=} authToken - optional, a function that returns the auth token or api-key
 * @property {string=} apiKey - or simply given the apiKey, optional
 */

/**
 * @param {APIInitializeParams} param
 */
export function apiInitialize(param = {}) {
    const {baseURL, authToken, apiKey} = param

    if (baseURL) {
        defaultRequestConfig.baseURL = baseURL
    }

    if (authToken) {
        g_authToken = authToken
    } else if (apiKey) {
        g_authToken = () => apiKey
    }
}

/**
 * @param {import('axios').AxiosResponse<any>} mockAxiosResponse
 */
const throwRequestError = (mockAxiosResponse) => {
    throw {
        response: mockAxiosResponse,
        name: 'RequestError',
        message:
            mockAxiosResponse.data.error ||
            `Request failed with status code ${mockAxiosResponse.status}`,
    }
}

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
    const cancelTimeout = requestConfig.timeout || DEFAULT_TIMEOUT
    const timeoutId = setTimeout(() => {
        abortController.abort()
    }, cancelTimeout)

    // compose fetch params
    const params = Object.keys(requestConfig.params || {})
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
            /** @type {import('axios').AxiosResponse<any>} */
            let mockAxiosResponse = {}
            mockAxiosResponse.status = r.status
            mockAxiosResponse.data = await r.json()
            mockAxiosResponse.headers = r.headers
            mockAxiosResponse.statusText = r.statusText

            if (mockAxiosResponse.data.success === false) {
                return throwRequestError(mockAxiosResponse)
            }
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
 */
export async function authorizeConfig(requestConfig) {
    const token = await g_authToken()
    return assocPath(
        ['headers', 'Authorization'],
        `Bearer ${token}`,
        requestConfig,
    )
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
        requestConfig = await authorizeConfig(requestConfig)
    }
    let response = await fetchWithTimeout(url, requestConfig)

    // TODO: add the token renew part
    // if this request is authRequired and the response status is 401, try to renew token
    // if (authRequired && response.status === 401) {
    //     try {
    //         await tokenRenew()
    //     } catch (error) {
    //         if (error.response) {
    //             return error.response
    //         } else {
    //             // The request was made but no response was received
    //             // or Something happened in setting up the request that triggered an Error
    //             throw error
    //         }
    //     }

    //     // query again with renewed token
    //     axiosConfig = await authorizeAxiosConfig(axiosConfig)
    //     response = await axiosClientWithTimeout(url, axiosConfig)
    // }

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
 */

/**
 * @typedef {import('axios').AxiosRequestConfig & CustomRequestConfig} RequestConfig
 */
