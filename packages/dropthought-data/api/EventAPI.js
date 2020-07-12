/**
 * @description
 * https://docs.dropthought.com/docs/2_0/api.html#event
 * submit feedback
 */
import {fetcherInstance} from './APIClient'
import {throwRequestError} from './Fetcher'

const EVENT_PATH = '/api/event'

/**
 * post event (feedback)
 * @param {{
 *   programId: string,
 *   feedbacks: Feedback[],
 *   source?: EventAPISourceType,
 * }} param0
 * @param {AxiosRequestConfig} axiosConfig
 * @param {Fetcher=} fetcher
 * @returns {Promise<Survey>}
 */
export async function apiPostEvent(
    {programId, feedbacks = [], source = 'api'},
    axiosConfig = {},
    fetcher = fetcherInstance,
) {
    /** @type {AxiosRequestConfig} */
    const params = {
        method: 'POST',
        authRequired: true,
        data: {
            refId: programId,
            data: feedbacks.map((feedback) => ({
                dataId: feedback.questionId,
                dataValue: feedback.answers,
                dataType: feedback.type,
                otherFlag: feedback.otherFlag,
            })),
            metaData: {
                source,
            },
        },
        ...axiosConfig,
    }

    return fetcher.request(EVENT_PATH, params).then((response) => {
        if (response.data.success === false) {
            throwRequestError(response)
            return
        }
        return response.data
    })
}

/**
 * @typedef {import('./Fetcher').RequestConfig} RequestConfig
 * @typedef {import('./Fetcher').Fetcher} Fetcher
 * @typedef {import('../data').Feedback} Feedback
 * @typedef {import('../data').SurveyFeedback} SurveyFeedback
 * @typedef {import('../data').EventAPISourceType} EventAPISourceType
 */
