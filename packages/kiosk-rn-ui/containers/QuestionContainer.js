import * as React from 'react'
import {View} from 'react-native'
import {mandatoryQuestionValidator} from '@dropthought/dropthought-data'

import {
    useFeedbackByQid,
    useFeedbackDispatch,
    updateFeedback,
} from '../contexts/feedback'
import SingleChoiceQuestion from '../components/SingleChoiceQuestion'
import MultiChoiceQuestion from '../components/MultiChoiceQuestion'
import SmileyRatingQuestion from '../components/SmileyRatingQuestion'
import SliderRatingQuestion from '../components/SliderRatingQuestion'
import OpenQuestion from '../components/OpenQuestion'
import MandatoryTitle from '../components/MandatoryTitle'
import GlobalStyle from '../styles'

/**
 * @param {QuestionContainerProps} props
 */
const TempComponent = ({question, forgot}) => {
    return (
        <View style={GlobalStyle.questionContainer}>
            <MandatoryTitle question={question} forgot={forgot} />
        </View>
    )
}

/** @typedef {import('@dropthought/dropthought-data').Question} Question */
/** @typedef {import('@dropthought/dropthought-data').Feedback} Feedback */
/**
 * @typedef {Object} QuestionContainerProps
 * @property {boolean} anonymous
 * @property {Question} question
 * @property {boolean} validationStarted
 * @property {string} themeColor - use hex color string
 */

/**
 * @type {React.FunctionComponent<QuestionContainerProps>}
 * @param {QuestionContainerProps} props
 */
const QuestionContainer = (props) => {
    const {onFeedback: propsOnFeedback, validationStarted} = props

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

    // whether to display the forgot warning message
    const forgot =
        validationStarted &&
        !mandatoryQuestionValidator(props.question, feedback)

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
        case 'nps':
            QuestionComponent = SliderRatingQuestion
            break
        case 'open':
            QuestionComponent = OpenQuestion
            break
        default:
            QuestionComponent = TempComponent
    }

    return (
        <QuestionComponent
            {...props}
            feedback={feedback}
            onFeedback={onFeedbackHandler}
            forgot={forgot}
        />
    )
}

export default QuestionContainer
