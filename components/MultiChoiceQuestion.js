import React, {PureComponent} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {last} from 'ramda'

import MandatoryTitle from './MandatoryTitle'
import OptionWithHighlight from './OptionWithHighlight'
import OtherOptionWithHighlight from './OtherOptionWithHighlight'
import GlobalStyles from '../styles'
import {getOptionsFromQuestion} from '@dropthought/dropthought-data'

/**
 * @typedef {Object} MultiChoiceQuestionProps
 * @property {Question} question
 * @property {Feedback} feedback
 * @property {(feedback: Feedback) => void} onFeedback
 * @property {boolean} forgot
 * @property {string} themeColor - use hex color string
 */
/**
 * @typedef {Object} MultiChoiceQuestionState
 * @property {boolean[]} values - the checked state of each option ex. [true, false, false, true, true]
 * @property {Option[]} options - ex. [{isOther:false, title: 'Option1'}, {isOther:false, title: 'Option2'}, {isOther: true, title: ''}]
 * @property {string} otherText - text value for other option
 */
/** @typedef {import('@dropthought/dropthought-data').Question} Question */
/** @typedef {import('@dropthought/dropthought-data').Option} Option */
/** @typedef {import('@dropthought/dropthought-data').Feedback} Feedback */

/**
 * @augments {React.Component<MultiChoiceQuestionProps, MultiChoiceQuestionState>}
 */
class MultiChoiceQuestion extends PureComponent {
    /**
     * @param {MultiChoiceQuestionProps} props
     */
    constructor(props) {
        super(props)

        const options = getOptionsFromQuestion(props.question)
        let otherText = ''

        /**
         * @returns {boolean[]}
         */
        function getInitialSelectedValuesFromFeedbackProps() {
            // default: selected false for each options
            /** @type {boolean[]} */
            let values = options.map(() => false)

            // if feedback has answers, turn the checked to true
            if (props.feedback && props.feedback.answers) {
                props.feedback.answers.forEach((answer) => {
                    // if the answer is a number type, turn the corresponding value's checked to true
                    if (Number.isInteger(answer)) {
                        values[answer] = true
                    } else {
                        // if the strValue is not a number type,
                        // it is for other label, always the last of the values
                        values[values.length - 1] = true
                        otherText = answer
                    }
                })
            }
            return values
        }

        this.onChangeValueHandler = this.onChangeValueHandler.bind(this)
        this.onOptionPressHandler = this.onOptionPressHandler.bind(this)
        this.state = {
            values: getInitialSelectedValuesFromFeedbackProps(),
            options,
            otherText,
        }
    }

    /**
     * call props.onFeedback and set states
     * @param {boolean[]} values
     */
    feedback(values, otherText) {
        this.props.onFeedback({
            questionId: this.props.question.questionId,
            answers: values
                .map((value, index) => {
                    // only return the answer if checked
                    if (value) {
                        // for 'other option', return the text
                        if (this.state.options[index].isOther) {
                            return otherText
                        }
                        return index
                    }
                    return undefined
                })
                .filter((value) => value !== undefined),
            type: 'multiChoice',

            // otherFlag if the last option is other type and the last values is true and otherText is not undefined
            otherFlag:
                last(this.state.options).isOther &&
                last(values) &&
                otherText !== undefined,
        })
        this.setState({
            values: values,
            otherText,
        })
    }

    onOptionPressHandler(index) {
        // copy the values, and toggle the checked value
        let values = [...this.state.values]
        values[index] = !this.state.values[index]

        this.feedback(values, this.state.otherText)
    }

    /**
     * @param {number} index
     * @param {{checked: boolean, value: string}} newValue
     */
    onChangeValueHandler(index, newValue) {
        // copy the values, and set the value
        let values = [...this.state.values]
        values[index] = newValue.checked

        // DK-864, if "other" is not selected, reset the other input's value to ''
        this.feedback(values, newValue.checked ? newValue.value : '')
    }

    renderOptions() {
        return this.state.options.map(({title: option, isOther}, index) => {
            let OptionComponent = OptionWithHighlight
            if (isOther) OptionComponent = OtherOptionWithHighlight

            return (
                <OptionComponent
                    key={index}
                    id={index}
                    textValue={this.state.otherText}
                    checked={this.state.values[index]}
                    checkedColor={this.props.themeColor}
                    title={option}
                    type="checkbox"
                    onPress={this.onOptionPressHandler}
                    onChangeValue={this.onChangeValueHandler}
                />
            )
        })
    }

    render() {
        return (
            <View style={GlobalStyles.questionContainer}>
                <MandatoryTitle
                    forgot={this.props.forgot}
                    question={this.props.question}
                />
                <View style={styles.title} />
                {this.renderOptions()}
            </View>
        )
    }
}

MultiChoiceQuestion.propTypes = {
    question: PropTypes.object,
    onFeedback: PropTypes.func,
    forgot: PropTypes.bool,
    feedback: PropTypes.shape({
        answers: PropTypes.array,
        questionId: PropTypes.string,
    }),
    themeColor: PropTypes.string,
}

const styles = StyleSheet.create({
    title: {
        marginBottom: 20,
    },
})

export default MultiChoiceQuestion
