import {NativeModules} from 'react-native'

const {Dropthought} = NativeModules

/** @typedef {import('@dropthought/dropthought-data').SurveyFeedback} SurveyFeedback */

/**
 * @typedef {object} SurveyBridgeInterface
 * @property {()=>void} dismiss
 * @property {(surveyFeedback: SurveyFeedback, errorCode?: number)=>void} onFeedbackResult
 * @property {(message: string, duration?: number)=>void=} toast
 */
/** @type {SurveyBridgeInterface} */
const SurveyBridge = Dropthought

export default SurveyBridge || {
    dismiss: () => {
        console.log('dev dismiss')
    },

    // error is a return code number
    // 0 means success
    onFeedbackResult: (surveyFeedback, errorCode) => {
        console.log('dev onFeedback Result', errorCode)
    },
}
