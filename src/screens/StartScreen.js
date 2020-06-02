import React from 'react'

import {StartScreenLayout} from '@dropthought/kiosk-rn'

import {useSurveyContext} from '../contexts/survey'
import {useSurveyHeader} from './useSurveyHeader'

/**
 * @type {React.FunctionComponent<ScreenProps>}
 * @param {ScreenProps} props
 */
const SurveyScreen = (props) => {
    const {navigation} = props
    const {survey, changeLanguage} = useSurveyContext()
    useSurveyHeader(navigation)

    const onStartHandler = React.useCallback(() => {
        navigation.push('Survey', {
            pageIndex: 0,
        })
    }, [navigation])

    const onLanguageSelectHandler = React.useCallback(
        (language) => {
            changeLanguage(language)
        },
        [changeLanguage],
    )

    return (
        <StartScreenLayout
            survey={survey}
            onStart={onStartHandler}
            onLanguageSelect={onLanguageSelectHandler}
        />
    )
}

export default SurveyScreen

/**@typedef {import('../navigation/SurveyStack').SurveyStackNavigationProps<"Start">} ScreenNavigationProp */
/**@typedef {import('../navigation/SurveyStack').SurveyStackRouteProp<"Start">} ScreenRouteProp */
/**
 * @typedef {Object} ScreenProps
 * @property {ScreenNavigationProp} navigation
 * @property {ScreenRouteProp} route
 */
