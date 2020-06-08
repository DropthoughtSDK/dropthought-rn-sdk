import {apiPostEvent} from '@dropthought/dropthought-data'
import {saveData, loadData} from './Storage'
const SURVEY_FEEDBACKS_STORAGE_KEY = `survey-feedbacks`

/**
 * the format is to fit in the react-async deferFn
 * @param {[SurveyFeedback]} surveyFeedback
 */
export const submitFeedback = async ([surveyFeedback]) => {
    return apiPostEvent({
        programId: surveyFeedback.surveyId,
        feedbacks: surveyFeedback.feedbacks,
    }).catch((error) => {
        // save result when there's error
        // TODO: maybe there're some errors no need to be handled?
        saveFeedback(surveyFeedback)
        throw error
    })
}

/**
 *
 * @param {SurveyFeedback} surveyFeedback
 */
export const saveFeedback = async (surveyFeedback) => {
    const surveyFeedbacks = await loadData(SURVEY_FEEDBACKS_STORAGE_KEY, [])
    surveyFeedbacks.push(surveyFeedback)
    await saveData(SURVEY_FEEDBACKS_STORAGE_KEY, surveyFeedbacks)
}

/**@typedef {import('@dropthought/dropthought-data').Feedback} Feedback */
/**@typedef {import('@dropthought/dropthought-data').SurveyFeedback} SurveyFeedback */
