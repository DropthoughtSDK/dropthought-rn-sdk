import axios from 'axios'
import {assocPath} from 'ramda'

const DEV_URL = 'https://stage.dropthought.com'
const PROD_URL = 'https://app.dropthought.com'
const HOST = __DEV__ ? DEV_URL : PROD_URL
export const BASE_URL = `${HOST}/dtapp/`
// const RENEW_ENDPOINT = '/dtapp/api/token/renew'

export const DEFAULT_TIMEOUT = 30000 // default timeout: 30 seconds

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
})

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
        axiosInstance.defaults.baseURL = baseURL
    }

    if (authToken) {
        g_authToken = authToken
    } else if (apiKey) {
        g_authToken = () => apiKey
    }
}

/**
 * @template T
 * @param {string} url
 * @param {RequestConfig} axiosConfig
 * @returns {import('axios').AxiosPromise<T>}
 */
async function axiosClientWithTimeout(url, axiosConfig) {
    // https://github.com/axios/axios/issues/647#issuecomment-459517694
    // the axios timeout is the request timeout, not the full connection timeout
    // it could take longer than the config timeout
    // use the cancel from axios to force cancel
    const abort =
        axiosConfig.customCancelTokenSource || axios.CancelToken.source()
    const cancelTimeout = (axiosConfig.timeout || DEFAULT_TIMEOUT) + 250
    const timeoutId = setTimeout(() => {
        abort.cancel(
            `Request Timeout of ${axiosConfig.timeout || DEFAULT_TIMEOUT}ms.`,
        )
    }, cancelTimeout)

    const response = await axiosInstance(url, {
        cancelToken: abort.token,
        ...axiosConfig,
    }).finally(() => {
        // clear timeout when request is final, success or failed
        clearTimeout(timeoutId)
    })

    return response
}

/**
 * set the auth token to axios config
 * @param {AxiosRequestConfig} axiosConfig
 */
export async function authorizeAxiosConfig(axiosConfig) {
    const token = await g_authToken()
    return assocPath(['headers', 'Authorization'], token, axiosConfig)
}

/**
 * axios wrapper
 * @template T
 * @param {string} url
 * @param {RequestConfig} axiosConfig
 * @returns {import('axios').AxiosPromise<T>}
 */
export async function axiosRequestWrapper(url, axiosConfig) {
    let authRequired = false

    if (axiosConfig.headers?.Authorization || axiosConfig.authRequired) {
        authRequired = true
        axiosConfig = await authorizeAxiosConfig(axiosConfig)
    }
    let response = await axiosClientWithTimeout(url, axiosConfig)

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
 * @typedef {Object} CustomAxiosRequestConfig
 * @property {boolean} authRequired
 * @property {CancelTokenSource} customCancelTokenSource
 */

/**
 * @typedef {import('axios').AxiosRequestConfig & CustomAxiosRequestConfig} RequestConfig
 */

/**
 * @typedef {import('axios').CancelTokenSource} CancelTokenSource
 */
