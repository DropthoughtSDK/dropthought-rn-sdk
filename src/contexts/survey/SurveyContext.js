/**
 * @description
 * survey context expose two data: survey and changeLanguage function
 * it only renders children when survey is available,
 * therefore, the children would always be sure to have "survey" in context
 */
import * as React from 'react'
import {StyleSheet, View, Text, ActivityIndicator, Image} from 'react-native'
import {useAsync} from 'react-async'
import {
    apiGetProgramById,
    initializeWithAPIKey,
} from '@dropthought/dropthought-data'
import {i18n} from '@dropthought/kiosk-rn'

import {saveCache, loadCache} from './Storage'

const DT_ERR_MISSING_PARAMS = 'dt-missing-parameters'

/**
 * @typedef {object} SurveyContextValue
 * @property {Survey} survey
 * @property {(language: string) => void} changeLanguage
 */
/** @typedef {import('@dropthought/dropthought-data').Survey} Survey */

/** @type {React.Context<SurveyContextValue>} */
const SurveyContext = React.createContext({
    survey: undefined,
    changeLanguage: () => undefined,
})

export const useSurveyContext = () => {
    return React.useContext(SurveyContext)
}

export const useSurvey = () => {
    const surveyContextValue = React.useContext(SurveyContext)
    return surveyContextValue.survey
}

/**
 * @param {string} uri
 * @return {Promise<{width: number, height: number}>}
 */
const preFetchImage = (uri) =>
    new Promise((resolve) => {
        if (!uri || typeof uri !== 'string') resolve({})

        // pre-fetch the uri if it is not base64
        const base64Reg = /^data:image\/.+;base64/
        if (!uri.match(base64Reg)) {
            Image.prefetch(uri)
        }
        Image.getSize(
            uri,
            (width, height) => {
                resolve({
                    width,
                    height,
                })
            },
            () => {
                resolve({})
            },
        )
    })

/**
 * load the program data from cache or api
 * @param {{surveyId: string, language: string, apiKey: string}} param0
 */
const getProgram = async ({surveyId, apiKey, language}) => {
    const programCacheKey = `survey-${surveyId}-${language}`
    if (!surveyId || !apiKey) {
        throw new Error(DT_ERR_MISSING_PARAMS)
    }
    // should we put this in another initialize function ?
    initializeWithAPIKey(apiKey)

    /** @type {Survey} */
    let survey = await loadCache(programCacheKey)

    if (!survey) {
        survey = await apiGetProgramById({
            programId: surveyId,
            language,
        })
        await saveCache(programCacheKey, survey)
    }

    // change the i18n language
    i18n.changeLanguage(survey.language)

    // pre-fetch image
    await preFetchImage(survey?.surveyProperty.image)

    return survey
}

export const SurveyContextProvider = ({
    surveyId,
    apiKey,
    children,
    defaultLanguage = 'en',
}) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState(
        defaultLanguage,
    )

    const {data, error, isPending} = useAsync({
        promiseFn: getProgram,

        apiKey,
        surveyId,
        language: selectedLanguage,

        watch: selectedLanguage,
    })

    /** @type {SurveyContextValue} */
    const contextValue = React.useMemo(
        () => ({
            survey: data,
            changeLanguage: setSelectedLanguage,
        }),
        [data],
    )

    // initial loading data view
    if (!data) {
        let content = <ActivityIndicator size="large" />
        if (error) {
            if (error.message === DT_ERR_MISSING_PARAMS) {
                content = <Text>Missing surveyId or apiKey</Text>
            } else {
                content = <Text>Unable to fetch survey</Text>
            }
        }
        return <View style={styles.fullCenter}>{content}</View>
    }

    return (
        <SurveyContext.Provider value={contextValue}>
            <View style={styles.flex1}>
                {children}
                {isPending && (
                    <View style={styles.loadingMask}>
                        <ActivityIndicator />
                    </View>
                )}
            </View>
        </SurveyContext.Provider>
    )
}

const loadingMaskBG = '#FFFFFF9C'
const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    flexGrow: {
        flexGrow: 1,
    },
    fullCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingMask: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: loadingMaskBG,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
})
