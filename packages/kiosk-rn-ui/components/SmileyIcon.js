import {
    View,
    Image,
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
} from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import {
    DimensionWidthType,
    useDimensionWidthType,
} from '../hooks/useWindowDimensions'
import GlobalStyle from '../styles'
import i18n from '../translation'

const SmileyIcon = (props) => {
    const dimensionWidthType = useDimensionWidthType()
    const isPhone = dimensionWidthType === DimensionWidthType.phone
    const styles = isPhone ? phoneStyles : tabletStyles
    const rtl = i18n.dir() === 'rtl'
    const containerStyle = isPhone
        ? [styles.container, rtl && GlobalStyle.flexRowReverse]
        : styles.container

    return (
        <View style={containerStyle}>
            {props.source !== undefined && (
                <>
                    <TouchableWithoutFeedback onPress={props.onPress}>
                        <Image
                            resizeMode="contain"
                            style={styles.emoji}
                            source={props.source}
                        />
                    </TouchableWithoutFeedback>
                    <Text style={styles.label}>{props.label}</Text>
                </>
            )}
        </View>
    )
}

export default SmileyIcon

SmileyIcon.propTypes = {
    source: PropTypes.number,
    onPress: PropTypes.func,
    selected: PropTypes.bool,
    label: PropTypes.string,
}

const phoneStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        height: 65,
    },
    emoji: {
        height: 51,
        width: 51,
    },
    label: {
        marginLeft: 20,
        fontSize: 17,
        marginRight: 20,
    },
})

const tabletStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 50,
        flex: 1,
        maxWidth: 70,
    },
    emoji: {
        height: 68,
        marginTop: 20,
        width: 68,
    },
    label: {
        alignSelf: 'center',
        marginTop: 11,
        textAlign: 'center',
    },
})
