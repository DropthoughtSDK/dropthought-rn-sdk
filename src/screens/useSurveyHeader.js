import {useEffect} from 'react'
import {StyleSheet} from 'react-native'

import {i18n} from '@dropthought/kiosk-rn'

import {useSurvey} from '../contexts/survey'

/**@typedef {import('../navigation/SurveyStack').SurveyStackNavigationProps<"Survey">} ScreenNavigationProp */

/**
 * @param {ScreenNavigationProp} navigation
 */
export const useSurveyHeader = (navigation) => {
    const survey = useSurvey()

    useEffect(() => {
        navigation.setOptions({
            title: survey.surveyName,
            headerTitleContainerStyle: styles[i18n.dir()],
        })
    }, [navigation, survey.surveyName])

    navigation.setOptions({
        title: survey.surveyName,
        headerTitleContainerStyle: styles[i18n.dir()],
    })
}

const styles = StyleSheet.create({
    rtl: {
        flexDirection: 'row-reverse',
    },
    ltr: {},
})
