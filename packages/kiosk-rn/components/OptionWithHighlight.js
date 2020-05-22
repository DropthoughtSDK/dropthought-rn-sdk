import * as React from 'react'
import {StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {CheckBox} from 'react-native-elements'

import {
    useDimensionWidthType,
    DimensionWidthType,
} from '../hooks/useWindowDimensions'
import {Colors, QuestionContentTextSize} from '../styles'
import i18n from '../translation'

const noop = () => undefined

/**
 * define OptionWithHighlightProps
 *
 * @typedef {Object} OptionWithHighlightProps
 * @property {"radio" | "checkbox" } type - the type of option: "radio" or "checkbox"
 * @property {any} containerStyle
 * @property {any} id - the value/id of this option
 * @property {string|React.ReactElement} title - the option title
 * @property {boolean} checked - if this option is checked
 * @property {string} checkedColor - use hex color string
 * @property {(id: any) => any} onPress - callback function when option is pressed
 */

const icons = {
    radio: {
        checked: 'ios-radio-button-on',
        unchecked: 'ios-radio-button-off',
    },
    checkbox: {
        checked: 'md-checkbox',
        unchecked: 'md-square-outline',
    },
}
/** @typedef {import('react').FunctionComponent} FunctionComponent */
/**
 * @param {OptionWithHighlightProps} props
 * @returns {FunctionComponent<OptionWithHighlightProps>}
 */
function OptionWithHighlight(props) {
    // const dimension = useWindowDimensions()
    const dimensionWidthType = useDimensionWidthType()
    // console.log('option dimension', dimension)

    const {
        checked,
        checkedColor,
        title,
        onPress,
        id: value,
        type,
        containerStyle: containerStyleFromProps,
    } = props
    const onPressHandler = () => {
        onPress && onPress(value)
    }

    const containerStyle = [
        styles.container,
        {
            // if checked, background color add opacity
            // https://css-tricks.com/8-digit-hex-codes/
            backgroundColor: checked ? `${checkedColor}26` : Colors.white,
        },
        containerStyleFromProps,
    ]

    const rtl = i18n.dir() === 'rtl'

    return (
        <CheckBox
            onPress={onPressHandler}
            iconType="ionicon"
            title={title}
            checkedIcon={icons[type].checked}
            uncheckedIcon={icons[type].unchecked}
            checked={checked}
            iconRight={rtl}
            right={rtl}
            containerStyle={containerStyle}
            textStyle={[
                styles.text,
                QuestionContentTextSize[dimensionWidthType],
            ]}
            checkedColor={checkedColor}
            uncheckedColor={Colors.questionGrey}
        />
    )
}

export const OptionWithHighlightPropTypes = {
    type: PropTypes.oneOf(['radio', 'checkbox']),
    id: PropTypes.any.isRequired,
    containerStyle: PropTypes.any,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    checked: PropTypes.bool.isRequired,
    checkedColor: PropTypes.string,
    onPress: PropTypes.func,
}

OptionWithHighlight.propTypes = OptionWithHighlightPropTypes
OptionWithHighlight.defaultProps = {
    type: 'radio',
    checkedColor: Colors.purple,
    onPress: noop,
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 3,
        borderWidth: 0,
        marginBottom: 2,
        marginTop: 2,
        paddingBottom: 12,
        paddingTop: 12,
    },
    text: {
        color: Colors.surveyContent,
        fontWeight: 'normal',
    },
})

export default React.memo(OptionWithHighlight)
