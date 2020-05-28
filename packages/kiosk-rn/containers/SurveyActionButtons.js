import * as React from 'react'
import {StyleSheet, View} from 'react-native'

import {questionFeedbackValidator} from '@dropthought/dropthought-data'

import {
    DimensionWidthType,
    useDimensionWidthType,
} from '../hooks/useWindowDimensions'
import Button from '../components/Button'
import {useFeedbackState} from '../contexts/feedback'
import {GlobalStyle} from '../styles'
import i18n from '../translation'

const DummyButton = ({width}) => <View style={{width}} />

/** @typedef {import('../contexts/feedback').FeedbackReducerState} FeedbackReducerState*/
/** @typedef {import('@dropthought/dropthought-data').Page} Page*/
/** @typedef {import('@dropthought/dropthought-data').Survey} Survey*/
/**
 * @typedef {import('./SurveyScreenLayout').SurveyScreenLayoutProps} SurveyActionButtonsProps
 */

/**
 * check if the feedbacks of questions of the page is valid
 * @param {Page} page
 * @param {FeedbackReducerState} feedbackState
 */
const validatePageFeedbacks = (page, feedbackState) => {
    return page.questions.every((question) => {
        const feedback = feedbackState.feedbacksMap[question.questionId]
        return questionFeedbackValidator(question, feedback)
    })
}

/**
 * @type {React.FunctionComponent<SurveyActionButtonsProps>}
 * @param {SurveyActionButtonsProps} props
 */
const SurveyActionButtons = (props) => {
    const feedbackState = useFeedbackState()
    const dimensionWidthType = useDimensionWidthType()
    const rtl = i18n.dir() === 'rtl'
    const {survey, pageIndex = 0, onPrevPage, onNextPage} = props

    const lastPage = pageIndex === survey.pageOrder.length - 1
    const currentPage = survey.pages[pageIndex]

    const onBackPressHandler = React.useCallback(() => {
        onPrevPage()
    }, [onPrevPage])

    const onNextPressHandler = React.useCallback(() => {
        // check if feedbacks are valid, only call onNextPage when valid
        const isValid = validatePageFeedbacks(currentPage, feedbackState)
        if (isValid) {
            onNextPage()
        }
    }, [currentPage, feedbackState, onNextPage])

    const onSubmitPressHandler = React.useCallback(() => {}, [])

    let PrevButton = Button
    if (!pageIndex || pageIndex <= 0) {
        PrevButton = DummyButton
    }
    const themeColor = props.survey.surveyProperty.hexCode
    const btnWidth = dimensionWidthType === DimensionWidthType.phone ? 76 : 100
    return (
        <View style={[styles.container, rtl && GlobalStyle.flexRowReverse]}>
            <PrevButton
                width={btnWidth}
                title="Back"
                color={themeColor}
                onPress={onBackPressHandler}
            />
            <Button
                width={btnWidth}
                title={lastPage ? 'Submit' : 'Next'}
                color={themeColor}
                onPress={lastPage ? onSubmitPressHandler : onNextPressHandler}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...GlobalStyle.row,
        justifyContent: 'space-between',
        marginTop: 30,
    },
})

export default React.memo(SurveyActionButtons)
