import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import {sum} from 'ramda'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import ProgressBar from '../components/ProgressBar'
import {useFeedbackState} from '../contexts/feedback'
import {opacity10} from '../styles'

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

/** @typedef {import('../contexts/feedback').FeedbackReducerState} FeedbackReducerState*/
/** @typedef {import('@dropthought/dropthought-data').Survey} Survey*/
/**
 * define props for SurveyProgressBar
 *
 * @typedef {Object} SurveyProgressBarProps
 * @property {Survey} survey - the current value
 */

/**
 * @type {React.FunctionComponent<SurveyProgressBarProps>}
 * @param {SurveyProgressBarProps} props
 */
const SurveyProgressBar = (props) => {
    const feedbackState = useFeedbackState()
    const themeColor = props.survey.surveyProperty.hexCode
    const insets = useSafeAreaInsets()

    const containerStyle = [
        styles.container,
        {
            backgroundColor: opacity10(themeColor),
            paddingBottom: insets.bottom || 15,
        },
    ]

    return (
        <View style={containerStyle}>
            <ProgressBar
                value={numValidFeedbacks(feedbackState)}
                maxValue={numTotalQuestions(props.survey)}
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
