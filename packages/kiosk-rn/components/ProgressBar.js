import * as React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, View, Text} from 'react-native'

import {
    DimensionWidthType,
    useDimensionWidthType,
} from '../hooks/useWindowDimensions'
import {Colors, GlobalStyle, opacity30} from '../styles'
import i18n from '../translation'

/**
 * define props for ProgressBar
 *
 * @typedef {Object} ProgressBarProps
 * @property {number} value - the current value
 * @property {number} maxValue - the max
 * @property {string} themeColor - the bar color
 */

/**
 * The ProgressBar will use `value` and `maxValue` to
 * compute the percentage
 *
 * @type {React.FunctionComponent<ProgressBarProps>}
 * @param {ProgressBarProps} props
 */
const ProgressBar = (props) => {
    const {value, maxValue, themeColor} = props
    const dimensionWidthType = useDimensionWidthType()

    const rtl = i18n.dir() === 'rtl'

    // compute the percentage value: (value/maxValue)*100
    const percentage = Math.round((value * 100) / maxValue)

    const containerStyle = [
        styles.container,
        GlobalStyle.row,
        rtl && GlobalStyle.flexRowReverse,
    ]

    const trackStyle = [
        styles.track,
        {
            backgroundColor: opacity30(themeColor),
        },
    ]

    const progressBarStyle = [
        styles.progressBar,
        styles.track,
        {
            width: `${percentage}%`,
            backgroundColor: themeColor,
        },
    ]

    return (
        <View style={containerStyle}>
            {/* the progress bar */}
            <View style={GlobalStyle.flex1}>
                <View style={trackStyle} />
                <View style={progressBarStyle} />
            </View>
            <Text
                style={[
                    styles.title,
                    rtl && GlobalStyle.textAlignRight,
                    titleSize[dimensionWidthType],
                ]}>
                {/* {percentage}% of 100% completed */}
                {i18n.t('survey:progress-bar', {percentage})}
            </Text>
        </View>
    )
}

ProgressBar.propTypes = {
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    barColor: PropTypes.string,
}

ProgressBar.defaultProps = {
    barColor: Colors.purple,
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    title: {
        color: `${Colors.progressBarText}99`,
        fontWeight: '500',
    },
    track: {
        width: '100%',
        borderRadius: 3,
        height: 6,
    },
    progressBar: {
        position: 'absolute',
    },
})

const titleSize = StyleSheet.create({
    [DimensionWidthType.phone]: {
        marginLeft: 10,
        fontSize: 12,
    },
    [DimensionWidthType.tablet]: {
        marginLeft: 15,
        fontSize: 14,
    },
})

export default React.memo(ProgressBar)
