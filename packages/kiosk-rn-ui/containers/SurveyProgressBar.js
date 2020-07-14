import * as React from 'react'
import {StyleSheet, View, Platform} from 'react-native'
import {sum} from 'ramda'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import DefaultProgressBar_ from '../components/ProgressBar'
import {useFeedbackState} from '../contexts/feedback'
import {opacity10} from '../styles'

/**
 * @param {ProgressBarProps} param0
 */
const DefaultProgressBar = ({numAnswered, numQuestions, themeColor}) => (
    <DefaultProgressBar_
        value={numAnswered}
        maxValue={numQuestions}
        themeColor={themeColor}
    />
)

/**
 * @param {FeedbackReducerState} param0
 */
const numValidFeedbacks = ({answeredQuestionIds, feedbacksMap}) => {
    return answeredQuestionIds.filter((qid) => {
        const feedback = feedbacksMap[qid]

        // if no answers or 0 length, filter out
        if (!feedback || !feedback.answers || !feedback.answers.length) {
            return false
        }

        // a special case: answers: [""], should also consider as invalid
        const answer = feedback.answers[0]
        if (typeof answer === 'string' && !answer.length) {
            return false
        }

        return true
    }).length
}

/**
 * @param {Survey} survey
 */
const numTotalQuestions = (survey) => {
    const questionNumOfPages = survey.pages.map((page) => page.questions.length)
    return sum(questionNumOfPages)
}

/**
 * define props for Custom ProgressBar
 *
 * @typedef {object} ProgressBarProps
 * @property {number} pageIndex - current page index (start from 0)
 * @property {string} themeColor
 * @property {Survey} survey
 * @property {number} numAnswered
 * @property {number} numQuestions
 * @property {number} numPages
 */
/** @typedef {import('React').ComponentType<ProgressBarProps>} ProgressBarComponent*/
/** @typedef {import('../contexts/feedback').FeedbackReducerState} FeedbackReducerState*/
/** @typedef {import('@dropthought/dropthought-data').Survey} Survey*/
/**
 * define props for SurveyProgressBar
 *
 * @typedef {Object} SurveyProgressBarProps
 * @property {Survey} survey - the current value
 * @property {number} pageIndex
 * @property {ProgressBarComponent} ProgressBar
 */

/**
 * @type {React.FunctionComponent<SurveyProgressBarProps>}
 * @param {SurveyProgressBarProps} props
 */
const SurveyProgressBar = ({
    ProgressBar = DefaultProgressBar,
    pageIndex = 0,
    ...props
}) => {
    const feedbackState = useFeedbackState()
    const themeColor = props.survey.surveyProperty.hexCode
    const insets = useSafeAreaInsets()

    const insetsBottom =
        // if it is android, and the insets bottom is not normal,
        // maybe it is because the keyboard is showed, don't use this insets
        Platform.OS === 'android' && insets.bottom >= 100 ? 0 : insets.bottom

    const containerStyle = React.useMemo(
        () => [
            styles.container,
            {
                backgroundColor: opacity10(themeColor),
                paddingBottom: insetsBottom || 15,
            },
        ],
        [insetsBottom, themeColor],
    )

    return (
        <View style={containerStyle}>
            <ProgressBar
                pageIndex={pageIndex}
                numPages={props.survey.pageOrder.length}
                numAnswered={numValidFeedbacks(feedbackState)}
                numQuestions={numTotalQuestions(props.survey)}
                survey={props.survey}
                themeColor={themeColor}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        width: '100%',
    },
})

export default React.memo(SurveyProgressBar)
