import React from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import {Colors} from '../styles'
import {
    DimensionWidthType,
    useDimensionWidthType,
} from '../hooks/useWindowDimensions'
import Button from '../components/Button'
import i18n from '../translation'

const defaultIconSource = require('../assets/rating.png')
const defaultIconSize = {
    [DimensionWidthType.phone]: 65,
    [DimensionWidthType.tablet]: 72,
}

const LANG_TITLE = {
    en: 'English',
    ar: 'العربي',
}

/** @typedef {import('@dropthought/dropthought-data').Survey} Survey*/
/**
 * define props for SurveyScreenLayout
 *
 * @typedef {Object} StartScreenLayoutProps
 * @property {Survey} survey
 * @property {()=>void} onStart
 * @property {(language: string)=>void} onLanguageSelect
 */

/**
 * @type {React.FunctionComponent<StartScreenLayoutProps>}
 * @param {StartScreenLayoutProps} props
 */
const StartScreen = ({onLanguageSelect, onStart, survey}) => {
    const dimensionWidthType = useDimensionWidthType()

    const isPhone = dimensionWidthType === DimensionWidthType.phone
    const styles = isPhone ? phoneStyles : tabletStyles

    const {surveyProperty, surveyName, welcomeText} = survey
    const {
        image,
        hexCode,
        width = defaultIconSize[dimensionWidthType],
        height = defaultIconSize[dimensionWidthType],
    } = surveyProperty
    const iconStyle = {
        width,
        height,
    }
    const iconSource = image === undefined ? defaultIconSource : {uri: image}

    const iconView = (
        <Image resizeMode="cover" style={iconStyle} source={iconSource} />
    )

    const buttonWidth = isPhone ? 143 : 160

    const languagesView = () => {
        const {languages} = survey

        // if there's only one language or no languages, no need to display
        if (!languages || !languages.length || languages.length <= 1)
            return null

        const languageView = languages.map((language, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    onLanguageSelect && onLanguageSelect(language)
                }}>
                <Text
                    style={[
                        styles.language_label,
                        language !== survey.language && {
                            color: survey.surveyProperty.hexCode,
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
                {!!welcomeText && (
                    <Text style={styles.subtitle}>{welcomeText}</Text>
                )}
                <View style={styles.divider} />
                <Button
                    width={buttonWidth}
                    title={i18n.t('start-survey:start-btn')}
                    color={hexCode}
                    onPress={() => {
                        onStart()
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
        justifyContent: 'center',
        paddingHorizontal: 38,
        width: '100%',
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
        height: '12%',
        maxHeight: 90,
    },
})

const tabletStyles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 70,
        width: '100%',
        justifyContent: 'center',
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
        height: '10%',
        maxHeight: 80,
    },
})
