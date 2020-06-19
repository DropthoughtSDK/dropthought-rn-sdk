/**
 * @description
 * https://docs.dropthought.com/docs/2_0/api.html#event
 * submit feedback
 */
import {apiRequest} from './APIClient'

const EVENT_PATH = '/api/event'

/**
 * post event (feedback)
 * @param {{
 *   programId: string,
 *   feedbacks: Feedback[],
 *   source?: EventAPISourceType,
 * }} param0
 * @param {AxiosRequestConfig} axiosConfig
 * @returns {Promise<Survey>}
 */
export async function apiPostEvent(
    {programId, feedbacks = [], source = 'api'},
    axiosConfig = {},
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

    return apiRequest(EVENT_PATH, params).then((response) => {
        return response.data
    })
}

/**
 * @typedef {import('./APIClient').RequestConfig} AxiosRequestConfig
 * @typedef {import('../data').Feedback} Feedback
 * @typedef {import('../data').SurveyFeedback} SurveyFeedback
 * @typedef {import('../data').EventAPISourceType} EventAPISourceType
 */
