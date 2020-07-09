/**
 * @description Option with a TextInput, this is for other option in multi-choice/single-choice question
 */
import * as React from 'react'
import {StyleSheet, TextInput, View, Text, Platform} from 'react-native'
import PropTypes from 'prop-types'

import GlobalStyles, {Colors, QuestionContentTextSize} from '../styles'
import i18n from '../translation'
import OptionWithHighlight, {
    OptionWithHighlightPropTypes,
} from './OptionWithHighlight'
import {useDimensionWidthType} from '../hooks/useWindowDimensions'

/**
 * a custom hook for handling focus status using onFocus and onBlur
 * @param {() => void} onBlur -
 * @param {() => void} onFocus -
 * @returns {{isFocused: boolean, onFocus: () => void, onBlur: () => void}}
 */
const useFocus = (onBlur, onFocus) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const onFocusHandler = React.useCallback(() => {
        onFocus && onFocus()
        setIsFocused(true)
    }, [onFocus])
    const onBlurHandler = React.useCallback(() => {
        onBlur && onBlur()
        setIsFocused(false)
    }, [onBlur])
    return {
        isFocused,
        onFocus: onFocusHandler,
        onBlur: onBlurHandler,
    }
}

/**
 * define OtherOptionWithHighlightProps
 *
 * @typedef {Object} OtherOptionWithHighlightProps
 * @property {(id: any, value: {checked: boolean, value: string}) => void} onChangeValue - callback function when input text is changed
 * @property {string} textValue -
 */
/** @typedef {import('./OptionWithHighlight').OptionWithHighlightProps} OptionWithHighlightProps */

/**
 * @param {OtherOptionWithHighlightProps & OptionWithHighlightProps} props
 * @returns {React.FunctionComponent<OtherOptionWithHighlightProps & OptionWithHighlightProps>}
 */
function OtherOptionWithHighlightProps(props) {
    const {id, checked, textValue, onChangeValue, checkedColor} = props

    const dimensionWidthType = useDimensionWidthType()
    const inputRef = React.useRef(null)

    // return checked as true when focus
    const onFocusHandler = () => {
        onChangeValue(id, {
            value: textValue,
            checked: true,
        })
    }

    // return checked as false, if the textValue is empty
    const onBlurHandler = () => {
        if (!textValue || textValue.trim().length <= 0) {
            onChangeValue(id, {
                value: '',
                checked: false,
            })
        }
    }
    const {isFocused, ...focusProps} = useFocus(onBlurHandler, onFocusHandler)

    // when the option is pressed, call focus if current checked is false
    const onPressHandler = () => {
        if (inputRef.current && !checked) {
            inputRef.current.focus()
        } else {
            // toggle checked value when pressing
            onChangeValue(id, {
                value: textValue,
                checked: !checked,
            })
        }
    }

    // when text input is changed, return the text
    const onChangeTextHandler = (text) =>
        onChangeValue &&
        onChangeValue(id, {
            checked: true,
            value: text,
        })

    const inputTextBorderBottomStyle = isFocused
        ? {
              borderBottomColor: checkedColor,
              borderBottomWidth: 2,
          }
        : undefined

    const rtl = i18n.dir() === 'rtl'

    const textInput = (
        <View
            style={[
                styles.textInputContainer,
                rtl && GlobalStyles.flexRowReverse,
            ]}>
            <Text
                style={[
                    styles.otherText,
                    QuestionContentTextSize[dimensionWidthType],
                ]}>
                {i18n.t('survey:other-option')}
            </Text>
            <TextInput
                ref={inputRef}
                style={[
                    styles.textInput,
                    rtl && GlobalStyles.textAlignRight,
                    inputTextBorderBottomStyle,
                    QuestionContentTextSize[dimensionWidthType],
                ]}
                placeholder={i18n.t('survey:other-placeholder')}
                placeholderTextColor={Colors.inputPlaceholder}
                onChangeText={onChangeTextHandler}
                underlineColorAndroid={Colors.transparent}
                selectionColor={checkedColor}
                value={textValue}
                maxLength={50}
                {...focusProps}
            />
        </View>
    )

    return (
        <OptionWithHighlight
            {...props}
            onPress={onPressHandler}
            title={textInput}
            containerStyle={styles.container}
        />
    )
}

OtherOptionWithHighlightProps.propTypes = {
    ...OptionWithHighlightPropTypes,
    title: PropTypes.any,
    onChangeValue: PropTypes.func,
    value: PropTypes.any,
}

OtherOptionWithHighlightProps.defaultProps = {}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
        paddingTop: 0,
    },
    otherText: {
        color: Colors.surveyContent,
        fontWeight: 'normal',
        marginHorizontal: 12,
    },
    textInput: {
        color: Colors.surveyContent,
        flex: 1,
        fontStyle: 'normal',
        fontWeight: 'normal',
        letterSpacing: 0,
        textAlign: 'left',
        textAlignVertical: 'center',
        ...Platform.select({
            ios: {
                paddingVertical: 13,
            },
        }),
    },
    textInputContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
})

export default OtherOptionWithHighlightProps
