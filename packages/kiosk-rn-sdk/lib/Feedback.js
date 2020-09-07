import {apiPostEvent} from './API'
import {FeedbacksQueue} from './FeedbacksUploader'

/**
 * the format is to fit in the react-async deferFn
 * @param {[SurveyFeedback]} surveyFeedback
 * @param {any} metadata
 */
export const submitFeedback = async ([surveyFeedback, metadata]) => {
    return apiPostEvent(
        {
            programId: surveyFeedback.surveyId,
            feedbacks: surveyFeedback.feedbacks,
            metadata,
        },
        {
            // use shorter timeout here,
            timeout: 10000,
        },
    ).catch((error) => {
        // save result when there's error
        // TODO: maybe there're some errors no need to be saved?
        saveFeedback(surveyFeedback)
        throw error
    })
}

/**
 * @param {SurveyFeedback} surveyFeedback
 */
export const saveFeedback = async (surveyFeedback) => {
    return FeedbacksQueue.enqueue(surveyFeedback)
}

/**@typedef {import('@dropthought/dropthought-data').Feedback} Feedback */
/**@typedef {import('@dropthought/dropthought-data').SurveyFeedback} SurveyFeedback */
