import * as React from 'react'
import {StyleSheet} from 'react-native'

import {
    i18n,
    useDimensionWidthType,
    DimensionWidthType,
} from '@dropthought/kiosk-rn-ui'

import CloseButton from '../components/CloseButton'
import {useSurveyContext} from '../contexts/survey'

/**@typedef {import('../navigation/SurveyStack').SurveyStackNavigationProps<"Survey">} ScreenNavigationProp */

/**
 * @param {ScreenNavigationProp} navigation
 */
export const useSurveyHeader = (navigation) => {
    const {survey, onClose} = useSurveyContext()
    const rtl = i18n.dir() === 'rtl'
    const isPhone = useDimensionWidthType() === DimensionWidthType.phone

    React.useEffect(() => {
        navigation.setOptions({
            title: survey.surveyName,
            headerTitleAlign: isPhone ? 'left' : 'center',
            headerTitleContainerStyle: styles[i18n.dir()],
            headerLeft: !rtl && (() => <CloseButton onPress={onClose} />),
            headerRight: rtl && (() => <CloseButton onPress={onClose} />),
        })
    }, [navigation, rtl, survey.surveyName, onClose, isPhone])
}

const styles = StyleSheet.create({
    rtl: {
        flexDirection: 'row-reverse',
    },
    ltr: {},
})
