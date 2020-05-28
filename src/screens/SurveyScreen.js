import React from 'react'
import {Text, ScrollView, StyleSheet} from 'react-native'

import {Colors, SurveyScreenLayout} from '@dropthought/kiosk-rn'

/**
 * @type {React.FunctionComponent<ScreenProps>}
 * @param {ScreenProps} props
 */
const SurveyScreen = (props) => {
    const {navigation, route} = props
    const pageIndex = route.params.pageIndex || 0

    const onNextPageHandler = React.useCallback(() => {
        navigation.push('Survey', {
            pageIndex: pageIndex + 1,
        })
    }, [navigation, pageIndex])

    return (
        <SurveyScreenLayout
            pageIndex={pageIndex}
            onNextPage={onNextPageHandler}
            onPrevPage={navigation.pop}
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
