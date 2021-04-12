/**
 * android needs to set the status bar background color
 */
import * as React from 'react'
import {StatusBar} from 'react-native'

import SurveyStackNavigator from './navigation/SurveyStack'
import {useSurvey} from './contexts/survey'

const SurveyStackContainer = (props) => {
    const survey = useSurvey()
    const themeColor = survey.surveyProperty.hexCode

    return (
        <>
            <StatusBar backgroundColor={themeColor} barStyle="light-content" />
            <SurveyStackNavigator {...props} />
        </>
    )
}

export default SurveyStackContainer
