import * as React from 'react'
import {StyleSheet, TouchableOpacity, Image} from 'react-native'

const closeIconSource = require('../assets/ic-close.png')
const hitSlop = {
    top: 10,
    bottom: 10,
    right: 10,
    left: 10,
}

export const CloseButton = ({tintColor = undefined, ...props}) => {
    return (
        <TouchableOpacity style={styles.icon} {...props} hitSlop={hitSlop}>
            <Image
                source={closeIconSource}
                style={[styles.iconImage, {tintColor}]}
            />
        </TouchableOpacity>
    )
}

export default CloseButton

const styles = StyleSheet.create({
    icon: {
        width: 52,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconImage: {
        resizeMode: 'contain',
    },
})
