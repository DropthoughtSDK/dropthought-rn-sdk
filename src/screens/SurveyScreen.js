import React from 'react'
import {Text, ScrollView, StyleSheet} from 'react-native'

import {Colors, SurveyScreenLayout} from '@dropthought/kiosk-rn'

import {useSurvey} from '../contexts/survey'
import {useSurveyHeader} from './useSurveyHeader'

/**
 * @type {React.FunctionComponent<ScreenProps>}
 * @param {ScreenProps} props
 */
const SurveyScreen = (props) => {
    const {navigation, route} = props
    const pageIndex = route.params.pageIndex || 0
    const survey = useSurvey()
    useSurveyHeader(navigation)

    const onNextPageHandler = React.useCallback(
        (nextPageIndex) => {
            navigation.push('Survey', {
                pageIndex: nextPageIndex,
            })
        },
        [navigation],
    )

    const onSubmitHandler = React.useCallback(() => {
        console.log('submit')
        navigation.push('End')
    }, [navigation])

    return (
        <SurveyScreenLayout
            survey={survey}
            pageIndex={pageIndex}
            onNextPage={onNextPageHandler}
            onPrevPage={navigation.pop}
            onSubmit={onSubmitHandler}
        />
    )
}

export default SurveyScreen

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '8%',
        backgroundColor: Colors.white,
    },
})

/**@typedef {import('../navigation/SurveyStack').SurveyStackNavigationProps<"Survey">} ScreenNavigationProp */
/**@typedef {import('../navigation/SurveyStack').SurveyStackRouteProp<"Survey">} ScreenRouteProp */
/**
 * @typedef {Object} ScreenProps
 * @property {ScreenNavigationProp} navigation
 * @property {ScreenRouteProp} route
 */
