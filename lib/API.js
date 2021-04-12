import {
    Fetcher,
    apiGetProgramById as _apiGetProgramById,
    apiPostEvent as _apiPostEvent,
    BASE_URL,
} from '@dropthought/dropthought-data'

export const sdkFetcher = new Fetcher({
    baseURL: BASE_URL,
})

/**
 * @param {InitializeParams} param0
 */
export function initializeWithAPIKey({apiKey, baseURL}) {
    sdkFetcher.init({
        baseURL,
        apiKey,
    })
}

/**
 * @param {APIGetProgramByIdParam} param
 * @param {RequestConfig=} requestConfig
 */
export const apiGetProgramById = (param, requestConfig) =>
    _apiGetProgramById(param, requestConfig, sdkFetcher)

/**
 *
 * @param {APIPostEventParam} param
 * @param {RequestConfig=} requestConfig
 */
export const apiPostEvent = (param, requestConfig) =>
    _apiPostEvent(param, requestConfig, sdkFetcher)

/**
 * @typedef {import('@dropthought/dropthought-data').APIGetProgramByIdParam} APIGetProgramByIdParam
 * @typedef {import('@dropthought/dropthought-data').APIPostEventParam} APIPostEventParam
 * @typedef {import('@dropthought/dropthought-data').RequestConfig} RequestConfig
 * @typedef {import('@dropthought/dropthought-data').InitializeParams} InitializeParams
 */
