import * as React from 'react'
import {View} from 'react-native'

import {
    useFeedbackByQid,
    useFeedbackDispatch,
    updateFeedback,
} from '../contexts/feedback'
import SingleChoiceQuestion from '../components/SingleChoiceQuestion'
import MultiChoiceQuestion from '../components/MultiChoiceQuestion'
import SmileyRatingQuestion from '../components/SmileyRatingQuestion'
import SliderRatingQuestion from '../components/SliderRatingQuestion'
import MandatoryTitle from '../components/MandatoryTitle'
import GlobalStyle from '../styles'

/**
 * @param {QuestionContainerProps} props
 */
const TempComponent = ({question}) => {
    return (
        <View style={GlobalStyle.questionContainer}>
            <MandatoryTitle question={question} />
        </View>
    )
}

/** @typedef {import('@dropthought/dropthought-data').Question} Question */
/** @typedef {import('@dropthought/dropthought-data').Feedback} Feedback */
/**
 * @typedef {Object} QuestionContainerProps
 * @property {Question} question
 * @property {(feedback: Feedback) => void} onFeedback
 * @property {boolean} forgot
 * @property {string} themeColor - use hex color string
 * @property {() => void=} onChange
 */

/**
 * @type {React.FunctionComponent<QuestionContainerProps>}
 * @param {QuestionContainerProps} props
 */
const QuestionContainer = (props) => {
    const {onFeedback: propsOnFeedback} = props

    let QuestionComponent = TempComponent

    // get/update feedback to context
    const feedback = useFeedbackByQid(props.question.questionId)
    const feedbackDispatch = useFeedbackDispatch()
    const onFeedbackHandler = React.useCallback(
        (updatedFeedback) => {
            updateFeedback(feedbackDispatch, updatedFeedback)
            propsOnFeedback && propsOnFeedback(updateFeedback)
        },
        [feedbackDispatch, propsOnFeedback],
    )

    switch (props.question.type) {
        case 'singleChoice':
            QuestionComponent = SingleChoiceQuestion
            break
        case 'multiChoice':
            QuestionComponent = MultiChoiceQuestion
            break
        case 'rating':
            if (props.question.subType === 'smiley') {
                QuestionComponent = SmileyRatingQuestion
            } else {
                QuestionComponent = SliderRatingQuestion
            }
            break
        default:
            QuestionComponent = TempComponent
    }

    return (
        <QuestionComponent
            {...props}
            feedback={feedback}
            onFeedback={onFeedbackHandler}
        />
    )
}

export default QuestionContainer
