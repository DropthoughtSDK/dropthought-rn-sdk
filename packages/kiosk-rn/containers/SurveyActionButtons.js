import * as React from 'react'
import {StyleSheet, View} from 'react-native'

import {
    questionFeedbackValidator,
    nextPage,
} from '@dropthought/dropthought-data'

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
    const {survey, pageIndex = 0, onPrevPage, onNextPage, onSubmit} = props

    const lastPage = pageIndex === survey.pageOrder.length - 1
    const currentPage = survey.pages[pageIndex]

    const onBackPressHandler = React.useCallback(() => {
        onPrevPage()
    }, [onPrevPage])

    // check if feedbacks are valid, apply the skip-logic rule, only call onNextPage when valid
    const onNextPressHandler = React.useCallback(() => {
        const isValid = validatePageFeedbacks(currentPage, feedbackState)
        if (isValid) {
            const nextPageIndex = nextPage(
                pageIndex,
                currentPage.pageId,
                feedbackState.feedbacksMap,
                survey,
            )
            if (nextPageIndex === -1) {
                onSubmit()
            } else {
                onNextPage(nextPageIndex)
            }
        }
    }, [currentPage, feedbackState, onNextPage, onSubmit, pageIndex, survey])

    const onSubmitPressHandler = React.useCallback(() => {}, [])

    let LeftButtonComponent = Button
    if (!pageIndex || pageIndex <= 0) {
        // why use a dummy button? we use 'space-between' to layout the buttons
        LeftButtonComponent = DummyButton
    }

    const themeColor = props.survey.surveyProperty.hexCode
    const btnWidth = dimensionWidthType === DimensionWidthType.phone ? 76 : 100
    return (
        <View style={[styles.container, rtl && GlobalStyle.flexRowReverse]}>
            <LeftButtonComponent
                width={btnWidth}
                title="Back"
                color={themeColor}
                onPress={onBackPressHandler}
                containerStyle={styles.leftBtnContainer}
            />
            <Button
                width={btnWidth}
                title={lastPage ? 'Submit' : 'Next'}
                color={themeColor}
                onPress={lastPage ? onSubmitPressHandler : onNextPressHandler}
                containerStyle={styles.rightBtnContainer}
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
