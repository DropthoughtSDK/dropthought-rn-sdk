import {apiPostEvent} from '@dropthought/dropthought-data'

/**
 * the format is to fit in the react-async deferFn
 * @param {[SurveyFeedback]} surveyFeedback
 */
export const submitFeedback = async ([surveyFeedback]) => {
    console.log('submit feedback is called')
    return apiPostEvent({
        programId: surveyFeedback.surveyId,
        feedbacks: surveyFeedback.feedbacks,
    })
}

/**@typedef {import('@dropthought/dropthought-data').Feedback} Feedback */
/**@typedef {import('@dropthought/dropthought-data').SurveyFeedback} SurveyFeedback */
