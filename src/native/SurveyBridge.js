import {NativeModules} from 'react-native'

const {Survey} = NativeModules

/** @typedef {import('@dropthought/dropthought-data').SurveyFeedback} SurveyFeedback */

/**
 * @typedef {object} SurveyBridgeInterface
 * @property {()=>void} dismiss
 * @property {(surveyFeedback: SurveyFeedback, errorCode?: number)=>void} onFeedbackResult
 */
/** @type {SurveyBridgeInterface} */
const SurveyBridge = Survey

export default SurveyBridge || {
    dismiss: () => {
        console.log('dev dismiss')
    },

    // error is a return code number
    // 0 means success
    // TODO: define the error code
    onFeedbackResult: (surveyFeedback, errorCode) => {
        console.log('dev onFeedback Result', errorCode)
    },
}
