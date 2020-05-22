import * as React from 'react'
import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'

import {useDimensionWidthType} from '../hooks/useWindowDimensions'
import GlobalStyle, {Colors, QuestionContentTextSize} from '../styles'
import i18n from '../translation'

const noop = () => undefined

const iconSource = {
    radio: {
        true: require('../assets/radio-on.png'),
        false: require('../assets/radio-off.png'),
    },
    checkbox: {
        true: require('../assets/checkbox-on.png'),
        false: require('../assets/checkbox-off.png'),
    },
}

/**
 * @typedef {Object} CheckBoxIconProps
 * @property {"radio" | "checkbox" } type - the type of option: "radio" or "checkbox"
 * @property {string} checkedColor - use hex color string
 * @property {string} uncheckedColor - use hex color string
 */
/**
 * @param {CheckBoxIconProps} props
 * @returns {React.FunctionComponent<CheckBoxIconProps>}
 */
const CheckBoxIcon = ({type, checkedColor, checked}) => {
    const checkedStyle = {
        tintColor: checkedColor,
    }
    return (
        <Image
            style={[styles.checkboxIcon, checked && checkedStyle]}
            source={iconSource[type][checked]}
        />
    )
}

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

/**
 * @param {OptionWithHighlightProps} props
 * @returns {React.FunctionComponent<OptionWithHighlightProps>}
 */
function OptionWithHighlight(props) {
    const dimensionWidthType = useDimensionWidthType()

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

    const rtl = i18n.dir() === 'rtl'

    const containerStyle = [
        GlobalStyle.row,
        styles.container,
        {
            // if checked, background color add opacity
            // https://css-tricks.com/8-digit-hex-codes/
            backgroundColor: checked ? `${checkedColor}26` : Colors.white,
        },
        containerStyleFromProps,
        rtl && GlobalStyle.flexRowReverse,
    ]

    let content
    if (typeof title === 'string') {
        content = (
            <Text
                style={[
                    styles.text,
                    QuestionContentTextSize[dimensionWidthType],
                ]}>
                {title}
            </Text>
        )
    } else {
        content = title
    }

    return (
        <TouchableOpacity style={containerStyle} onPress={onPressHandler}>
            <View style={styles.checkboxIconContainer}>
                <CheckBoxIcon
                    type={type}
                    checkedColor={checkedColor}
                    checked={checked}
                />
            </View>
            {content}
        </TouchableOpacity>
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
        paddingBottom: 10,
        paddingTop: 10,
        paddingHorizontal: 15,
    },
    text: {
        color: Colors.surveyContent,
        fontWeight: 'normal',
        marginHorizontal: 12,
    },
    checkboxIconContainer: {
        marginVertical: 3,
    },
    checkboxIcon: {
        width: 20,
        aspectRatio: 1,
    },
})

export default React.memo(OptionWithHighlight)
