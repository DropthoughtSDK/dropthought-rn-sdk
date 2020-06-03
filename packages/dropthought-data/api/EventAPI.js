/**
 * @description
 * https://docs.dropthought.com/docs/2_0/api.html#event
 * submit feedback
 */
import {axiosRequestWrapper as apiRequest} from './APIClient'

const EVENT_PATH = '/api/event'

/**
 * get single language version of a program by id
 * @param {{
 *   programId: string,
 *   feedbacks: Feedback[],
 * }} param0
 * @returns {Promise<Survey>}
 */
export async function apiPostEvent({programId, feedbacks = []}) {
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
                source: 'qr',
            },
        },
        timeout: 10000,
    }

    return apiRequest(EVENT_PATH, params).then((response) => {
        return response.data
    })
}

/**
 * @typedef {import('./APIClient').RequestConfig} AxiosRequestConfig
 * @typedef {import('../data').Feedback} Feedback
 * @typedef {import('../data').SurveyFeedback} SurveyFeedback
 */
