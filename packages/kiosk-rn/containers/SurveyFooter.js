/**
 * @description a extension UI/UX component of SurveyScreenLayout
 * it displays three buttons:
 *  - Back, displayed when page is > 0
 *  - Next, displayed when page is not end
 *  - Submit, displayed when page is the last page
 * When "Back" is pressed, call props.onPrevPage
 * When "Next" is pressed,
 *     would check if the answers are valid, and then apply the Skip Logic, get the next page id, call props.onNextPage(nextPageIndex)
 *     or it would call props.onSubmit, when the rule says it should go to end
 * When "Submit" is pressed,
 *     would check if the answers are valid, and then call props.onSubmit
 *
 * when the validation process failed, call props.onValidationFailed
 */
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
import {useSurveyPageContext} from '../contexts/survey-page'
import {GlobalStyle} from '../styles'
import i18n from '../translation'

const DummyButton = ({width}) => <View style={{width}} />

/** @typedef {import('../contexts/feedback').FeedbackReducerState} FeedbackReducerState*/
/** @typedef {import('@dropthought/dropthought-data').Page} Page*/
/**
 * @typedef {import('./SurveyScreenLayout').SurveyScreenLayoutProps} SurveyScreenLayoutProps
 */
/**
 * @typedef {object} OwnProps
 * @property {()=>void} onValidationStart callback when start to validate the answers
 * @property {(invalidQuestionId: string, questionTitleRef: any)=>void} onValidationFailed callback when the answers check not valid
 */

/** @typedef {OwnProps & SurveyScreenLayoutProps} SurveyFooterProps */

/**
 * check if the feedbacks of questions of the page is valid
 * returns the 1st invalid question id or undefined (means all valid)
 * @param {Page} page
 * @param {FeedbackReducerState} feedbackState
 * @returns {string|undefined}
 */
const firstInvalidQuestionId = (page, feedbackState) => {
    let invalidQuestionId
    for (const question of page.questions) {
        const feedback = feedbackState.feedbacksMap[question.questionId]
        if (!questionFeedbackValidator(question, feedback)) {
            invalidQuestionId = question.questionId
            break
        }
    }
    return invalidQuestionId
}

/**
 * @type {React.FunctionComponent<SurveyFooterProps>}
 * @param {SurveyFooterProps} props
 */
const SurveyFooter = (props) => {
    const feedbackState = useFeedbackState()
    const {mandatoryQuestionTitleRefs} = useSurveyPageContext()
    const dimensionWidthType = useDimensionWidthType()
    const rtl = i18n.dir() === 'rtl'
    const {
        survey,
        pageIndex = 0,
        onPrevPage,
        onNextPage,
        onSubmit,
        onValidationStart,
        onValidationFailed,
    } = props

    const lastPage = pageIndex === survey.pageOrder.length - 1
    const currentPage = survey.pages[pageIndex]

    // check if feedbacks are valid
    const validatePageFeedbacks = React.useCallback(() => {
        onValidationStart()
        const invalidQuestionId = firstInvalidQuestionId(
            currentPage,
            feedbackState,
        )
        // if there's an invalid question, call onValidationFailed
        if (invalidQuestionId)
            onValidationFailed(
                invalidQuestionId,
                mandatoryQuestionTitleRefs[invalidQuestionId],
            )
        return !invalidQuestionId
    }, [
        currentPage,
        feedbackState,
        mandatoryQuestionTitleRefs,
        onValidationStart,
        onValidationFailed,
    ])

    // check if feedbacks are valid, apply the skip-logic rule, only call onNextPage when valid
    const onNextPressHandler = React.useCallback(() => {
        const isValid = validatePageFeedbacks()
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
    }, [
        validatePageFeedbacks,
        pageIndex,
        currentPage.pageId,
        feedbackState.feedbacksMap,
        survey,
        onSubmit,
        onNextPage,
    ])

    const onSubmitPressHandler = React.useCallback(() => {
        const isValid = validatePageFeedbacks()
        if (isValid) {
            onSubmit()
        }
    }, [onSubmit, validatePageFeedbacks])

    const onBackPressHandler = React.useCallback(() => {
        onPrevPage()
    }, [onPrevPage])

    // why use a dummy button here? we use 'space-between' to layout the buttons
    let LeftButtonComponent = Button
    if (!pageIndex || pageIndex <= 0) {
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

const noop = () => undefined
SurveyFooter.defaultProps = {
    onValidationFailed: noop,
    onValidationStart: noop,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...GlobalStyle.row,
        justifyContent: 'space-between',
        marginVertical: 30,
    },
})

export default React.memo(SurveyFooter)
