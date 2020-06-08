import React from 'react'

import {EndScreenLayout} from '@dropthought/kiosk-rn'

import {useSurvey} from '../contexts/survey'
import {useSurveyHeader} from './useSurveyHeader'
import SurveyNativeBridge from '../native/SurveyBridge'

/**
 * @type {React.FunctionComponent<ScreenProps>}
 * @param {ScreenProps} props
 */
const EndScreen = (props) => {
    const survey = useSurvey()
    useSurveyHeader(props.navigation)

    const {error, surveyFeedback} = props.route.params

    React.useEffect(() => {
        // passing data to native, if error is undefined, null, 0, it means success
        console.log('TODO: native onFeedbackResult')
        if (surveyFeedback)
            SurveyNativeBridge.onFeedbackResult(surveyFeedback, error || 0)
    }, [error, surveyFeedback])

    return <EndScreenLayout survey={survey} />
}

export default EndScreen

/**@typedef {import('../navigation/SurveyStack').SurveyStackNavigationProps<"End">} ScreenNavigationProp */
/**@typedef {import('../navigation/SurveyStack').SurveyStackRouteProp<"End">} ScreenRouteProp */
/**
 * @typedef {Object} ScreenProps
 * @property {ScreenNavigationProp} navigation
 * @property {ScreenRouteProp} route
 */
