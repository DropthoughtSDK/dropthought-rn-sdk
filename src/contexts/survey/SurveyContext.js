/**
 * @description
 * survey context expose two data: survey and changeLanguage function
 * it only renders children when survey is available,
 * therefore, the children would always be sure to have "survey" in context
 */
import * as React from 'react'
import {View, Text, ActivityIndicator, Image} from 'react-native'
import {evolve, merge} from 'ramda'
import {useAsync} from 'react-async'
import {apiGetProgramById} from '@dropthought/dropthought-data'
import {i18n, ActivityIndicatorMask, GlobalStyle} from '@dropthought/kiosk-rn'

import {saveCache, loadCache} from '../../lib/Storage'

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
 * pre-fetch survey's image, get the width and height of the survey image
 * @param {Survey} survey
 * @return {Promise<Survey>}
 */
const preFetchImage = (survey) =>
    new Promise((resolve) => {
        const {image: uri, width, height} = survey?.surveyProperty || {}
        if (!uri || typeof uri !== 'string') {
            resolve(survey)
            return
        }

        // pre-fetch the uri if it is not base64
        const base64Reg = /^data:image\/.+;base64/
        if (!uri.match(base64Reg)) {
            Image.prefetch(uri)
        }

        // if height and width already existed
        if (width && height) {
            resolve(survey)
            return
        }

        // get image's width and height
        Image.getSize(
            uri,
            (w, h) => {
                // resolve the updated survey with surveyProperty merge with {width, height}
                resolve(
                    evolve({
                        surveyProperty: merge({
                            width: w,
                            height: h,
                        }),
                    })(survey),
                )
            },
            () => {
                resolve(survey)
            },
        )
    })

/**
 * load the program data from cache or api
 * @param {{surveyId: string, language: string}} param0
 */
const getProgram = async ({surveyId, language}) => {
    const programCacheKey = `survey-${surveyId}-${language}`
    if (!surveyId) {
        throw new Error(DT_ERR_MISSING_PARAMS)
    }

    /** @type {Survey} */
    let survey = await loadCache(programCacheKey)

    if (!survey) {
        survey = await apiGetProgramById({
            programId: surveyId,
            language,
        })
    }
    // pre-fetch image
    survey = await preFetchImage(survey)

    // save to cache
    await saveCache(programCacheKey, survey)

    // change the i18n language
    i18n.changeLanguage(survey.language)

    return survey
}

export const SurveyContextProvider = ({
    surveyId,
    children,
    defaultLanguage = 'en',
}) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState(
        defaultLanguage,
    )

    const {data, error, isPending} = useAsync({
        promiseFn: getProgram,

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
                content = <Text>Missing surveyId</Text>
            } else {
                content = <Text>Unable to fetch survey</Text>
            }
        }
        return <View style={GlobalStyle.fullCenter}>{content}</View>
    }

    return (
        <SurveyContext.Provider value={contextValue}>
            <View style={GlobalStyle.flex1}>
                {children}
                <ActivityIndicatorMask loading={isPending} />
            </View>
        </SurveyContext.Provider>
    )
}
