import React from 'react'
import {useAsync} from 'react-async'

import {
    SurveyScreenLayout,
    ActivityIndicatorMask,
} from '@dropthought/kiosk-rn-ui'

import {useSurvey} from '../contexts/survey'
import {useMetadata} from '../contexts/custom-props'
import {useSurveyHeader} from './useSurveyHeader'
import {submitFeedback} from '../lib/Feedback'

/**
 * @param {ScreenNavigationProp} navigation
 */
const useSubmitFeedback = (navigation) => {
    const surveyFeedbackRef = React.useRef()
    const metadata = useMetadata()

    const onRejectHandler = React.useCallback(
        (error) => {
            navigation.push('End', {
                surveyFeedback: surveyFeedbackRef.current,
                error,
            })
        },
        [navigation],
    )
    const onResolveHandler = React.useCallback(() => {
        navigation.push('End', {
            surveyFeedback: surveyFeedbackRef.current,
            error: undefined,
        })
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
            run(surveyFeedback, metadata)
        },
        [run, metadata],
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
