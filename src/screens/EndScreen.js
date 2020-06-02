import React from 'react'

import {EndScreenLayout} from '@dropthought/kiosk-rn'

import {useSurvey} from '../contexts/survey'

/**
 * @type {React.FunctionComponent<ScreenProps>}
 * @param {ScreenProps} props
 */
const EndScreen = (props) => {
    const survey = useSurvey()
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
