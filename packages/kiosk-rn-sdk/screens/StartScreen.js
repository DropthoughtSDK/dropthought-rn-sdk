import React from 'react'

import {fromAPIDateStrToJS} from '@dropthought/dropthought-data'
import {
    StartScreenLayout,
    PlaceholderImageTypes,
    PlaceholderScreen,
    i18n,
} from '@dropthought/kiosk-rn-ui'

import {useSurveyContext} from '../contexts/survey'
import {useSurveyHeader} from './useSurveyHeader'

/**
 *
 * @param {import('@dropthought/dropthought-data/data').ProgramStateType} surveyState
 * @param {Date} surveyStartDate
 * @param {Date} surveyEndDate
 */
const checkSurveyStatus = (surveyState, surveyStartDate, surveyEndDate) => {
    let imageType
    switch (surveyState) {
        case 'active':
            imageType = null
            break
        case 'expired':
            imageType = PlaceholderImageTypes.ProgramExpired
            break
        case 'scheduled':
            imageType = PlaceholderImageTypes.ProgramScheduled
            break
        case 'drafts':
        default:
            imageType = PlaceholderImageTypes.ProgramUnavailable
    }
    // still need to check the start-end time
    if (!imageType) {
        const now = new Date()
        if (now < surveyStartDate) {
            imageType = PlaceholderImageTypes.ProgramScheduled
        } else if (now > surveyEndDate) {
            imageType = PlaceholderImageTypes.ProgramExpired
        }
    }
    return imageType
}

/**
 * @type {React.FunctionComponent<ScreenProps>}
 * @param {ScreenProps} props
 */
const SurveyScreen = (props) => {
    const {navigation} = props
    const {survey, changeLanguage} = useSurveyContext()
    const {
        state: surveyState,
        surveyEndDate: surveyEndDateStr,
        surveyStartDate: surveyStartDateStr,
    } = survey
    const surveyStartDate = fromAPIDateStrToJS(surveyStartDateStr)
    const surveyEndDate = fromAPIDateStrToJS(surveyEndDateStr)

    useSurveyHeader(navigation)

    const onStartHandler = React.useCallback(() => {
        navigation.push('Survey', {
            pageIndex: 0,
        })
    }, [navigation])

    const onLanguageSelectHandler = React.useCallback(
        (language) => {
            changeLanguage(language)
        },
        [changeLanguage],
    )

    // render placeholder
    const imageType = checkSurveyStatus(
        surveyState,
        surveyStartDate,
        surveyEndDate,
    )
    if (imageType) {
        // need to render placeholder
        return (
            <PlaceholderScreen
                imageType={imageType}
                message={i18n.t('start-survey:placeholder-message')}
            />
        )
    }

    return (
        <StartScreenLayout
            survey={survey}
            onStart={onStartHandler}
            onLanguageSelect={onLanguageSelectHandler}
        />
    )
}

export default SurveyScreen

/**@typedef {import('../navigation/SurveyStack').SurveyStackNavigationProps<"Start">} ScreenNavigationProp */
/**@typedef {import('../navigation/SurveyStack').SurveyStackRouteProp<"Start">} ScreenRouteProp */
/**
 * @typedef {Object} ScreenProps
 * @property {ScreenNavigationProp} navigation
 * @property {ScreenRouteProp} route
 */
