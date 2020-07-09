import React from 'react'
import PropTypes from 'prop-types'
import {Text, StyleSheet, View, ImageBackground} from 'react-native'

import GlobalStyle, {Colors} from '../styles'
import i18n from '../translation'

/**
 * @typedef {Object} QuestionWarningMessageProps
 * @property {string} message
 */

/**
 * @type {React.FunctionComponent<QuestionWarningMessageProps>}
 * @param {QuestionWarningMessageProps} params
 */
const QuestionWarningMessage = ({message}) => {
    if (!message) return null
    const rtl = i18n.dir() === 'rtl'

    return (
        <View>
            <ImageBackground
                imageStyle={rtl && GlobalStyle.horizontalFlip}
                style={styles.hintImage}
                source={require('../assets/hint.png')}>
                <Text style={[styles.hint, rtl && GlobalStyle.horizontalFlip]}>
                    {message}
                </Text>
            </ImageBackground>
        </View>
    )
}
QuestionWarningMessage.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}
export default QuestionWarningMessage

const styles = StyleSheet.create({
    hint: {
        color: Colors.black,
        fontSize: 13,
        marginRight: 15,
        position: 'absolute',
        width: '100%',
        paddingLeft: 26,
    },
    hintImage: {
        height: 34,
        justifyContent: 'center',
        width: 300,
        marginTop: 12,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.16,
        shadowRadius: 3,
    },
})
