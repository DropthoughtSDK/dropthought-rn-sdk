import * as React from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewPropTypes,
    Text,
} from 'react-native'

import {Colors} from '../styles'

/**
 * @type {React.FunctionComponent<ButtonProps>}
 * @param {ButtonProps} props - button props
 */
const Button = ({
    title,
    disabled,
    full,
    width,
    containerStyle,
    color = Colors.purple,
    ...props
}) => {
    const buttonStyle = [
        styles.button,
        {
            backgroundColor: color,
        },
        disabled && styles.disabledButton,
        width && {width},
    ]

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity
                {...props}
                disabled={disabled}
                underlayColor={Colors.white}>
                <View style={buttonStyle}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

Button.propTypes = {
    ...(TouchableOpacity.propTypes || {}),
    title: PropTypes.string.isRequired,
    width: PropTypes.number,
    containerStyle: ViewPropTypes.style,
}

Button.defaultProps = {
    disabled: false,
}

export default Button

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
    },
    button: {
        alignItems: 'center',
        borderRadius: 3,
        flex: undefined,
    },
    title: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0,
        textAlign: 'center',
        paddingVertical: 12,
    },
    disabledButton: {
        backgroundColor: Colors.settingsButtonDisable,
    },
})

/** @typedef {import('react-native').TouchableOpacityProps} TouchableProps */

/**
 * @typedef {Object} ButtonOwnProps
 * @property {string} title - button title
 * @property {number=} width - total width
 * @property {string=} color - button background color
 * @property {any=} containerStyle
 */

/** @typedef {TouchableProps & ButtonOwnProps} ButtonProps */
