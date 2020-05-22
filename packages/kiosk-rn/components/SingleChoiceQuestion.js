import React, {PureComponent} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'

import GlobalStyle from '../styles'
import MandatoryTitle from './MandatoryTitle'
import OptionWithHighlight from './OptionWithHighlight'
import OtherOptionWithHighlight from './OtherOptionWithHighlight'
import {getOptionsFromQuestion} from '@dropthought/dropthought-data'

/**
 * @typedef {Object} SingleChoiceQuestionProps
 * @property {Question} question
 * @property {Feedback} feedback
 * @property {(feedback: Feedback) => void} onFeedback
 * @property {boolean} forgot
 * @property {string} themeColor - use hex color string
 */
/**
 * @typedef {Object} SingleChoiceQuestionState
 * @property {Option[]} options - ex. [{isOther:false, title: 'Option1'}, {isOther:false, title: 'Option2'}, {isOther: true, title: ''}
 * @property {number} value - which option is selected (an index number)
 * @property {string} otherText - text value for other option
 */
/** @typedef {import('@dropthought/dropthought-data').Question} Question */
/** @typedef {import('@dropthought/dropthought-data').Option} Option */
/** @typedef {import('@dropthought/dropthought-data').Feedback} Feedback */

/**
 * @augments {React.Component<SingleChoiceQuestionProps, SingleChoiceQuestionState>}
 */
class SingleChoiceQuestion extends PureComponent {
    /**
     * @param {SingleChoiceQuestionProps} props
     */
    constructor(props) {
        super(props)

        let otherText = ''
        function getInitialValueFromFeedbackProps() {
            if (
                props.feedback &&
                props.feedback.answers &&
                props.feedback.answers[0]
            ) {
                const answer = props.feedback.answers[0]
                if (Number.isInteger(answer)) {
                    return answer
                } else {
                    // if the answer is not a number type,
                    // it is for other label, return the last index
                    otherText = answer
                    return props.question.options.length
                }
            }
            return undefined
        }

        this.onFeedback = this.onFeedback.bind(this)
        this.onChangeValueHandler = this.onChangeValueHandler.bind(this)
        this.state = {
            value: getInitialValueFromFeedbackProps(),
            options: getOptionsFromQuestion(props.question),
            otherText,
        }
    }

    // when normal option is pressed, set the id(index) as answer
    onFeedback(id) {
        this.setState({
            value: id,

            // DK-864, when selecting normal options, reset the other input's value
            otherText: '',
        })
        this.props.onFeedback({
            questionId: this.props.question.questionId,
            answers: [id],
            type: 'singleChoice',
        })
    }

    // when other option's value is changed, newValues is {checked: boolean, value: string}
    onChangeValueHandler(index, newValue) {
        this.setState({
            // if newValues is checked, set value to this index
            value: newValue.checked ? index : undefined,
            otherText: newValue.checked ? newValue.value : '',
        })
        this.props.onFeedback({
            questionId: this.props.question.questionId,
            // the answer of this feedback is the text value
            answers: newValue.checked ? [newValue.value] : [],
            type: 'singleChoice',

            // set otherFlag if newValue is checked
            otherFlag: newValue.checked,
        })
    }

    renderRadios() {
        return this.state.options.map(({title: option, isOther}, index) => {
            let OptionComponent = OptionWithHighlight
            if (isOther) OptionComponent = OtherOptionWithHighlight

            let isActive = this.state.value === index
            return (
                <OptionComponent
                    id={index}
                    key={index}
                    onPress={this.onFeedback} // only for OptionWithHighlight
                    title={option}
                    checked={isActive}
                    checkedColor={this.props.themeColor}
                    onChangeValue={this.onChangeValueHandler} // only for OtherOptionWithHighlight
                    textValue={this.state.otherText} // only for OtherOptionWithHighlight
                />
            )
        })
    }

    render() {
        return (
            <View style={GlobalStyle.questionContainer}>
                <MandatoryTitle
                    forgot={this.props.forgot}
                    question={this.props.question}
                />
                <View style={styles.radioForm}>{this.renderRadios()}</View>
            </View>
        )
    }
}

SingleChoiceQuestion.propTypes = {
    question: PropTypes.object,
    onFeedback: PropTypes.func,
    feedback: PropTypes.shape({
        answers: PropTypes.array,
        questionId: PropTypes.string,
    }),
    forgot: PropTypes.bool,
    themeColor: PropTypes.string,
}

const styles = StyleSheet.create({
    radioForm: {
        marginTop: 20,
    },
})

export default SingleChoiceQuestion
