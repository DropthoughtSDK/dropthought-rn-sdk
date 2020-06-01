import React from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import {Colors} from '@dropthought/kiosk-rn'
import {
    useWindowDimensions,
    DimensionWidthType,
    useDimensionWidthType,
    OrientationType,
    useOrientationType,
} from '@dropthought/kiosk-rn/hooks/useWindowDimensions'
import {multiPagesLogicSurvey} from '@dropthought/kiosk-rn/mockSurveyData'
import Button from '@dropthought/kiosk-rn/components/Button'

const iconSource = require('@dropthought/kiosk-rn/assets/rating.png')

const LANG_TITLE = {
    en: 'English',
    ar: 'العربي',
}

const StartScreen = ({navigation}) => {
    const [selectedLanguageIndex, setSelectedLanguageIndex] = React.useState(0)

    const dimensionWidthType = useDimensionWidthType()
    const orientationType = useOrientationType()
    const {height} = useWindowDimensions()

    const isPhone = dimensionWidthType === DimensionWidthType.phone
    const isPortrait = orientationType === OrientationType.portrait
    const styles = isPhone ? phoneStyles : tabletStyles
    const ratio = isPhone ? 0.24 : isPortrait ? 0.28 : 0.2
    const iconStyle = [styles.icon, {marginTop: ratio * height}]

    const surveyMockData = multiPagesLogicSurvey
    const {surveyProperty, surveyName, welcomeText} = surveyMockData
    const {image, hexCode} = surveyProperty

    const iconView =
        image === undefined ? (
            <Image style={iconStyle} source={iconSource} />
        ) : (
            <Image style={iconStyle} source={{uri: image}} />
        )

    const buttonWidth = isPhone ? 143 : 160

    const languagesView = () => {
        const {languages} = surveyMockData

        // if there's only one language or no languages, no need to display
        if (!languages || !languages.length || languages.length <= 1)
            return null

        const languageView = languages.map((language, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    setSelectedLanguageIndex(index)
                }}>
                <Text
                    style={[
                        styles.language_label,
                        index !== selectedLanguageIndex && {
                            color: surveyMockData.surveyProperty.hexCode,
                        },
                    ]}>
                    {LANG_TITLE[language]}
                </Text>
            </TouchableOpacity>
        ))
        return <View style={styles.languages}>{languageView}</View>
    }

    return (
        <View style={shareStyles.container}>
            <View style={styles.main}>
                {iconView}
                <Text style={styles.title}>{surveyName}</Text>
                <Text style={styles.subtitle}>{welcomeText}</Text>
                <View style={styles.divider} />
                <Button
                    width={buttonWidth}
                    title="Take Survey"
                    color={hexCode}
                    onPress={() => {
                        navigation.push('Survey')
                    }}
                    containerStyle={styles.takeSurveyButton}
                />
            </View>
            {languagesView()}
        </View>
    )
}

export default StartScreen

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
        paddingHorizontal: 38,
        width: '100%',
    },
    icon: {
        height: 65,
        width: 65,
    },
    title: {
        textAlign: 'center',
        marginTop: 14,
        fontSize: 22,
        opacity: 0.9,
        lineHeight: 27,
    },
    subtitle: {
        color: 'rgb(33,33,33)',
        lineHeight: 23,
        marginTop: 12,
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.72,
    },
    divider: {
        backgroundColor: '#c3c3c3',
        height: 1,
        width: '100%',
        marginTop: 26,
    },
    takeSurveyButton: {
        marginTop: 21,
    },
    language_label: {
        fontSize: 13,
        marginRight: 19,
    },
    languages: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 83,
    },
})

const tabletStyles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 70,
        width: '100%',
    },
    icon: {
        height: 72,
        width: 72,
    },
    title: {
        textAlign: 'center',
        lineHeight: 38,
        marginTop: 18,
        fontSize: 31,
        opacity: 0.9,
    },
    subtitle: {
        color: 'rgb(33,33,33)',
        lineHeight: 25,
        marginTop: 17,
        fontSize: 21,
        textAlign: 'center',
        opacity: 0.72,
    },
    divider: {
        backgroundColor: '#c3c3c3',
        height: 1,
        width: '100%',
        marginTop: 46,
    },
    takeSurveyButton: {
        marginTop: 37,
    },
    language_label: {
        fontSize: 13,
        marginRight: 19,
    },
    languages: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 67,
    },
})
