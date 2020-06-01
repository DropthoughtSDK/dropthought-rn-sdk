import React from 'react'

import {StartScreenLayout} from '@dropthought/kiosk-rn'

/**
 * @type {React.FunctionComponent<ScreenProps>}
 * @param {ScreenProps} props
 */
const SurveyScreen = (props) => {
    const {navigation} = props

    const onStartHandler = React.useCallback(() => {
        navigation.push('Survey', {
            pageIndex: 0,
        })
    }, [navigation])

    const onLanguageSelectHandler = React.useCallback((language) => {
        console.log('change language', language)
    }, [])

    return (
        <StartScreenLayout
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
