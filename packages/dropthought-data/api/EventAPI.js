/**
 * @description
 * https://docs.dropthought.com/docs/2_0/api.html#event
 * submit feedback
 */
import {axiosRequestWrapper as apiRequest} from './APIClient'

const EVENT_PATH = '/api/event'

/**
 * post event (feedback)
 * @param {{
 *   programId: string,
 *   feedbacks: Feedback[],
 * }} param0
 * @param {AxiosRequestConfig} axiosConfig
 * @returns {Promise<Survey>}
 */
export async function apiPostEvent(
    {programId, feedbacks = []},
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
                source: 'qr',
            },
        },
        timeout: 10000,
        ...axiosConfig,
    }

    return apiRequest(EVENT_PATH, params).then((response) => {
        const {success, error} = response.data
        if (success === false) {
            throw {
                response,
                request: response.request,
                message: error || response.status,
            }
        }
        return response.data
    })
}

/**
 * @typedef {import('./APIClient').RequestConfig} AxiosRequestConfig
 * @typedef {import('../data').Feedback} Feedback
 * @typedef {import('../data').SurveyFeedback} SurveyFeedback
 */
