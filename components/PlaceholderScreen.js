import React from 'react'
import PropTypes from 'prop-types'
import {View, Image, StyleSheet, Text} from 'react-native'

import {Colors, GlobalStyle} from '../styles'
import i18n from '../translation'

/** @enum {'NoInternet' | 'ProgramScheduled' | 'ProgramExpired' | 'ProgramDeleted' | 'ProgramDeactivated' | 'ProgramUnavailable'} */
export const PlaceholderImageTypes = {
    NoInternet: 'NoInternet',
    ProgramScheduled: 'ProgramScheduled',
    ProgramExpired: 'ProgramExpired',
    ProgramDeleted: 'ProgramDeleted',
    ProgramDeactivated: 'ProgramDeactivated',
    ProgramUnavailable: 'ProgramUnavailable',
}
const ImageTypes = PlaceholderImageTypes

const imageTypeSources = {
    [ImageTypes.NoInternet]: require('../assets/placeholder-no-internet.png'),
    [ImageTypes.ProgramScheduled]: require('../assets/placeholder-program-scheduled.png'),
    [ImageTypes.ProgramExpired]: require('../assets/placeholder-program-expired.png'),
    [ImageTypes.ProgramDeleted]: require('../assets/placeholder-program-deleted.png'),
    [ImageTypes.ProgramDeactivated]: require('../assets/placeholder-program-deactivated.png'),
    [ImageTypes.ProgramUnavailable]: require('../assets/placeholder-program-unavailable.png'),
}

/**
 * @type {React.FunctionComponent<PlaceholderScreenProps>}
 * @param {PlaceholderScreenProps} params
 */
const PlaceholderScreen = ({message, imageSource, imageType, children}) => {
    // const imgStyle = {marginTop: 134}
    const title = i18n.t(`placeholder-title:${imageType}`, undefined)

    return (
        <View style={styles.container}>
            <Image
                source={imageTypeSources[imageType] || imageSource}
                style={styles.image}
            />

            <View style={styles.body}>
                {title && <Text style={styles.title}>{title}</Text>}

                {message && <Text style={styles.message}>{message}</Text>}
                {children}
            </View>
        </View>
    )
}
PlaceholderScreen.propTypes = {
    message: PropTypes.string,
    imageSource: PropTypes.any,
    imageType: PropTypes.oneOf(Object.values(ImageTypes)),
}

const styles = StyleSheet.create({
    container: {
        ...GlobalStyle.flex1,
        backgroundColor: Colors.white,
        justifyContent: 'center',
    },
    image: {
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    body: {
        paddingHorizontal: 60,
    },
    title: {
        marginTop: 30,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 22,
        color: Colors.placeholderText,
    },
    message: {
        marginTop: 12,
        textAlign: 'center',
        lineHeight: 22,
        fontSize: 14,
        fontWeight: 'normal',
        color: Colors.placeholderText,
    },
})

export default PlaceholderScreen

/**
 * @typedef {Object} PlaceholderScreenProps
 * @property {string=} message
 * @property {ImageTypes=} imageType
 * @property {string=} imageSource
 */
/** @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent */
