import {apiPostEvent} from './API'
import {FeedbacksQueue} from './FeedbacksUploader'

/**
 * the format is to fit in the react-async deferFn
 * @param {[SurveyFeedback]} surveyFeedback
 */
export const submitFeedback = async ([surveyFeedback]) => {
    return apiPostEvent(
        {
            programId: surveyFeedback.surveyId,
            feedbacks: surveyFeedback.feedbacks,
            metadata: surveyFeedback.metadata,
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
/**@typedef {import('@dropthought/dropthought-data/data').SurveyFeedback} SurveyFeedback */
