import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'

import {Colors} from '../styles'
import {
    DimensionWidthType,
    useDimensionWidthType,
} from '..//hooks/useWindowDimensions'
import {multiPagesLogicSurvey} from '../mockSurveyData'
import i18n from '../translation'

const iconSource = require('../assets/rating.png')
const logoSource = require('../assets/ic_dtlogo.png')

const EndScreen = () => {
    const dimensionWidthType = useDimensionWidthType()

    const isPhone = dimensionWidthType === DimensionWidthType.phone
    const styles = isPhone ? phoneStyles : tabletStyles
    const iconStyle = styles.icon

    const surveyMockData = multiPagesLogicSurvey
    const {surveyProperty, thankYouText} = surveyMockData

    const iconView = () => {
        const {image} = surveyProperty
        return image === undefined ? (
            <Image style={iconStyle} source={iconSource} />
        ) : (
            <Image style={iconStyle} source={{uri: image}} />
        )
    }

    return (
        <View style={shareStyles.container}>
            <View style={styles.main}>
                {iconView()}
                <Text style={styles.title}>{i18n.t('end-survey:thank')}</Text>
                <Text style={styles.subtitle}>{thankYouText}</Text>
            </View>
            <View style={styles.vertical}>
                <View style={styles.horizontal}>
                    <Text style={styles.power_by}>Powered by </Text>
                    <Image style={styles.dtLogo} source={logoSource} />
                </View>
                <Text style={styles.power_by_bold}>dropthought</Text>
            </View>
        </View>
    )
}

export default EndScreen

const shareStyles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        alignItems: 'center',
    },
})

const phoneStyles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 38,
    },
    icon: {
        height: 65,
        width: 65,
    },
    title: {
        lineHeight: 27,
        marginTop: 44,
        fontSize: 22,
        opacity: 0.9,
    },
    subtitle: {
        color: Colors.endSurveySubTitleGrey,
        lineHeight: 23,
        marginTop: 17,
        fontSize: 19,
        textAlign: 'center',
        opacity: 0.72,
    },
    vertical: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 83,
    },
    horizontal: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    power_by: {
        color: Colors.settingsGreyText,
        fontSize: 9,
    },
    power_by_bold: {
        color: Colors.settingsGreyText,
        fontSize: 12,
        fontWeight: '500',
    },
    dtLogo: {
        height: 15,
        width: 15,
    },
})

const tabletStyles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 70,
    },
    icon: {
        height: 72,
        width: 72,
    },
    title: {
        lineHeight: 38,
        marginTop: 44,
        fontSize: 31,
        opacity: 0.9,
    },
    subtitle: {
        color: Colors.endSurveySubTitleGrey,
        lineHeight: 25,
        marginTop: 17,
        fontSize: 21,
        textAlign: 'center',
        opacity: 0.72,
    },
    vertical: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 67,
    },
    horizontal: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    power_by: {
        color: Colors.settingsGreyText,
        fontSize: 12,
    },
    power_by_bold: {
        color: Colors.settingsGreyText,
        fontSize: 15,
        fontWeight: '500',
    },
    dtLogo: {
        height: 17,
        width: 17,
    },
})
