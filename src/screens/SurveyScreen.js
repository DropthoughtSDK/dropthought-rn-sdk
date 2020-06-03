import React from 'react'
import {useAsync} from 'react-async'

import {SurveyScreenLayout, ActivityIndicatorMask} from '@dropthought/kiosk-rn'

import {useSurvey} from '../contexts/survey'
import {useSurveyHeader} from './useSurveyHeader'
import {submitFeedback} from '../lib/Feedback'

const useSubmitFeedback = (navigation) => {
    const onResolveHandler = React.useCallback(() => {
        navigation.push('End')
    }, [navigation])

    return useAsync({
        deferFn: submitFeedback,
        onResolve: onResolveHandler,
    })
}

/**
 * @type {React.FunctionComponent<ScreenProps>}
 * @param {ScreenProps} props
 */
const SurveyScreen = (props) => {
    const {navigation, route} = props
    const pageIndex = route.params.pageIndex || 0
    const survey = useSurvey()
    useSurveyHeader(navigation)

    const {run, isPending} = useSubmitFeedback(navigation)

    const onNextPageHandler = React.useCallback(
        (nextPageIndex) => {
            navigation.push('Survey', {
                pageIndex: nextPageIndex,
            })
        },
        [navigation],
    )

    /** @type {(surveyFeedback: SurveyFeedback) => void} */
    const onSubmitHandler = React.useCallback(
        (surveyFeedback) => {
            run(surveyFeedback)
        },
        [run],
    )

    const surveyScreenLayout = (
        <SurveyScreenLayout
            survey={survey}
            pageIndex={pageIndex}
            onNextPage={onNextPageHandler}
            onPrevPage={navigation.pop}
            onSubmit={onSubmitHandler}
        />
    )

    return (
        <>
            {surveyScreenLayout}
            <ActivityIndicatorMask loading={isPending} />
        </>
    )
}

export default SurveyScreen

/**@typedef {import('@dropthought/dropthought-data').SurveyFeedback} SurveyFeedback */
/**@typedef {import('../navigation/SurveyStack').SurveyStackNavigationProps<"Survey">} ScreenNavigationProp */
/**@typedef {import('../navigation/SurveyStack').SurveyStackRouteProp<"Survey">} ScreenRouteProp */
/**
 * @typedef {Object} ScreenProps
 * @property {ScreenNavigationProp} navigation
 * @property {ScreenRouteProp} route
 */
