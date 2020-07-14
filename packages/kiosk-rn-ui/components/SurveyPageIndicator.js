import * as React from 'react'
import {StyleSheet, View, Text} from 'react-native'

import {
    DimensionWidthType,
    useDimensionWidthType,
} from '../hooks/useWindowDimensions'
import {opacity10, Colors} from '../styles'

/** @typedef {import('@dropthought/dropthought-data').Survey} Survey*/
/**
 * @typedef {object} SurveyPageIndicatorProps
 * @property {number} pageIndex
 * @property {Survey} survey
 * @property {boolean} rtl
 */

/**
 * @type {React.FunctionComponent<SurveyPageIndicatorProps>}
 * @param {SurveyPageIndicatorProps} props
 */
const SurveyPageIndicator = (props) => {
    const {survey, pageIndex = 0, rtl} = props

    const themeColor = survey.surveyProperty.hexCode

    const dimensionWidthType = useDimensionWidthType()
    const dimensionStyles =
        dimensionWidthType === DimensionWidthType.phone
            ? phoneStyles
            : tabletStyles

    const currentPage = survey.pages[pageIndex]

    const containerStyle = [
        styles.container,
        dimensionStyles.container,
        {
            backgroundColor: opacity10(themeColor),
        },
        rtl && {
            alignItems: 'flex-end',
        },
    ]

    const titleStyle = [styles.title, dimensionStyles.title]

    return (
        <View style={containerStyle}>
            <Text style={titleStyle}>{currentPage.pageTitle}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        height: 40,
        width: '100%',
    },
    title: {
        fontWeight: '600',
    },
})

const phoneStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 14,
        letterSpacing: 0.42,
        color: Colors.progressBarText,
    },
})

const tabletStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 16,
        letterSpacing: 0.48,
    },
})

export default React.memo(SurveyPageIndicator)
