import {AxiosPromise, AxiosResponse} from 'axios'
import type {InitializeParams, RequestConfig} from './Fetcher'
import {Survey, Feedback, EventAPISourceType} from '../data'

// from Fetcher
declare function throwRequestError<T>(
    mockAxiosResponse: AxiosResponse<T>,
): never
declare function isRequestTimeoutError(error: Error): boolean
declare function isNoInternetError(error: Error): boolean

declare class Fetcher {
    constructor(param: InitializeParams)

    init(param: InitializeParams): void

    request<T>(url: string, requestConfig: RequestConfig): AxiosPromise<T>
}
declare type InitializeParams = InitializeParams
declare type RequestConfig = RequestConfig

// from APIClient
declare const BASE_URL: string
declare function apiInitialize(param: InitializeParams): void
declare function apiRequest<T>(
    url: string,
    requestConfig: RequestConfig,
): AxiosPromise<T>

// from ProgramAPI
interface APIGetProgramByIdParam {
    programId: string
    language: string
    timezone: string
}
declare function apiGetProgramById(
    param: APIGetProgramByIdParam,
    requestConfig?: RequestConfig,
    fetcher?: Fetcher,
): Promise<Survey>

// from EventAPI
interface APIPostEventParam {
    programId: string
    feedbacks: Feedback[]
    source: EventAPISourceType
    metadata: any
}
declare function apiPostEvent(
    param: APIPostEventParam,
    requestConfig?: RequestConfig,
    fetcher?: Fetcher,
): Promise<Survey>
