import React from 'react'
import {useAsync, Alert} from 'react-async'

import {SurveyScreenLayout, ActivityIndicatorMask} from '@dropthought/kiosk-rn'

import {useSurvey} from '../contexts/survey'
import {useSurveyHeader} from './useSurveyHeader'
import {submitFeedback, saveFeedback} from '../lib/Feedback'

const useSubmitFeedback = (navigation) => {
    const surveyFeedbackRef = React.useRef()

    const onRejectHandler = React.useCallback(() => {
        // TODO: call a native callback
        if (surveyFeedbackRef.current) saveFeedback(surveyFeedbackRef.current)
        navigation.push('End')
    }, [navigation])
    const onResolveHandler = React.useCallback(() => {
        // TODO: call a native callback
        navigation.push('End')
    }, [navigation])

    const {run, isPending} = useAsync({
        deferFn: submitFeedback,
        onResolve: onResolveHandler,
        onReject: onRejectHandler,
    })

    /** @type {(surveyFeedback: SurveyFeedback) => void} */
    const onSubmitHandler = React.useCallback(
        (surveyFeedback) => {
            surveyFeedbackRef.current = surveyFeedback
            run(surveyFeedback)
        },
        [run],
    )

    return React.useMemo(
        () => ({
            onSubmit: onSubmitHandler,
            isPending,
        }),
        [onSubmitHandler, isPending],
    )
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

    const {onSubmit, isPending} = useSubmitFeedback(navigation)

    const onNextPageHandler = React.useCallback(
        (nextPageIndex) => {
            navigation.push('Survey', {
                pageIndex: nextPageIndex,
            })
        },
        [navigation],
    )

    const surveyScreenLayout = (
        <SurveyScreenLayout
            survey={survey}
            pageIndex={pageIndex}
            onNextPage={onNextPageHandler}
            onPrevPage={navigation.pop}
            onSubmit={onSubmit}
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
