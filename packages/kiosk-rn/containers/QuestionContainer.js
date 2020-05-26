import React from 'react'
import {View} from 'react-native'

import SingleChoiceQuestion from '../components/SingleChoiceQuestion'
import MultiChoiceQuestion from '../components/MultiChoiceQuestion'
import SmileyRatingQuestion from '../components/SmileyRatingQuestion'
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
 * @property {Feedback} feedback
 * @property {(feedback: Feedback) => void} onFeedback
 * @property {boolean} forgot
 * @property {string} themeColor - use hex color string
 * @property {() => void=} onChange
 */

/**
 * @param {QuestionContainerProps} props
 */
const QuestionContainer = (props) => {
    let QuestionComponent = TempComponent

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
                QuestionComponent = TempComponent
            }
            break
        default:
            QuestionComponent = TempComponent
    }

    return (
        <QuestionComponent
            {...props}
            feedback={undefined}
            onFeedback={() => undefined}
        />
    )
}

export default QuestionContainer
