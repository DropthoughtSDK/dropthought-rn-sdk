import * as React from 'react'
import {StyleSheet, TouchableOpacity, Image, NativeModules} from 'react-native'

import {
    i18n,
    useDimensionWidthType,
    DimensionWidthType,
} from '@dropthought/kiosk-rn'

import {useSurvey} from '../contexts/survey'

/**@typedef {import('../navigation/SurveyStack').SurveyStackNavigationProps<"Survey">} ScreenNavigationProp */

const closeIconSource = require('../assets/ic-close.png')
const hitSlop = {
    top: 10,
    bottom: 10,
    right: 10,
    left: 10,
}
const CloseButton = ({...props}) => {
    return (
        <TouchableOpacity
            style={styles.icon}
            {...props}
            hitSlop={hitSlop}
            onPress={() => {
                console.log('close')
                var Survey = NativeModules.Survey
                Survey.dismiss()
            }}>
            <Image source={closeIconSource} style={[styles.iconImage]} />
        </TouchableOpacity>
    )
}

/**
 * @param {ScreenNavigationProp} navigation
 */
export const useSurveyHeader = (navigation) => {
    const survey = useSurvey()
    const rtl = i18n.dir() === 'rtl'
    const isPhone = useDimensionWidthType() === DimensionWidthType.phone

    React.useEffect(() => {
        navigation.setOptions({
            title: survey.surveyName,
            headerTitleAlign: isPhone ? 'left' : 'center',
            headerTitleContainerStyle: styles[i18n.dir()],
            headerLeft: !rtl && (() => <CloseButton />),
            headerRight: rtl && (() => <CloseButton />),
        })
    }, [navigation, rtl, survey.surveyName, isPhone])
}

const styles = StyleSheet.create({
    rtl: {
        flexDirection: 'row-reverse',
    },
    ltr: {},
    icon: {
        width: 52,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconImage: {
        resizeMode: 'contain',
    },
})
