import {View, Text, StyleSheet} from 'react-native'
import * as React from 'react'
import PropTypes from 'prop-types'
import GlobalStyle, {Colors} from '../styles'
import QuestionWarningMessage from './QuestionWarningMessage'
import i18n from '../translation'
import {
    DimensionWidthType,
    useDimensionWidthType,
} from '../hooks/useWindowDimensions'

const renderTitle = (title, dimensionWidthType) => {
    return title.split(' ').map((text, index) => (
        <Text
            key={index}
            style={[
                styles.questionTitle,
                questionTitleSize[dimensionWidthType],
            ]}>
            {text + ' '}
        </Text>
    ))
}

/** @typedef {import('@dropthought/dropthought-data').Question} Question */
/**
 * @typedef {Object} MandatoryTitleProps
 * @property {object} style - container style
 * @property {boolean} forgot
 * @property {Question} question
 * @property {string|boolean} invalidMessage -
 */
/**
 * @param {MandatoryTitleProps} props
 * @returns {FunctionComponent<MandatoryTitleProps>}
 */
const MandatoryTitle = (props) => {
    const rtl = i18n.dir() === 'rtl'
    const dimensionWidthType = useDimensionWidthType()

    return (
        <View
            style={[
                styles.horizontal,
                props.style,
                rtl && GlobalStyle.flexRowReverse,
            ]}>
            {renderTitle(props.question.questionTitle, dimensionWidthType)}
            {props.question.mandatory && <Text style={styles.hint}>*</Text>}
            <QuestionWarningMessage
                // forgot message has higher priority than custom invalid message
                message={
                    props.forgot
                        ? i18n.t('survey:mandatory')
                        : props.invalidMessage
                }
            />
        </View>
    )
}

export default MandatoryTitle

/*
class MandatoryTitle extends React.Component {
    state = {ref: undefined}
    constructor(props) {
        super(props)
        this.setRef = this.setRef.bind(this)
    }

    _renderTitle(title) {
        return title.split(' ').map((text, index) => (
            <Text key={index} style={styles.questionTitle}>
                {text + ' '}
            </Text>
        ))
    }

    setRef(ref) {
        this.setState({ref})
    }

    render() {
        // let context = this.context
        const rtl = i18n.dir() === 'rtl'

        // if (this.props.forgot || this.props.invalidMessage) {
        //   context.unAnsweredRefs[this.props.question.questionId] = this.state.ref
        // }

        return (
            <View
                ref={this.setRef}
                style={[
                    styles.horizontal,
                    this.props.style,
                    rtl && GlobalStyle.flexRowReverse,
                ]}>
                {this._renderTitle(this.props.question.questionTitle)}
                {this.props.question.mandatory && (
                    <Text style={styles.hint}>*</Text>
                )}
                <QuestionWarningMessage
                    // forgot message has higher priority than custom invalid message
                    message={
                        this.props.forgot
                            ? i18n.t('survey:mandatory')
                            : this.props.invalidMessage
                    }
                />
            </View>
        )
    }
}
// MandatoryTitle.contextType = SurveyContext
*/

MandatoryTitle.propTypes = {
    forgot: PropTypes.bool,
    invalidMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    question: PropTypes.object,
    style: PropTypes.object,
}

const questionTitleSize = StyleSheet.create({
    [DimensionWidthType.phone]: {
        fontSize: 16,
    },
    [DimensionWidthType.tablet]: {
        fontSize: 18,
    },
})

const styles = StyleSheet.create({
    hint: {
        color: Colors.red,
        fontSize: 18,
    },
    horizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    questionTitle: {
        fontSize: 18,
        marginBottom: 2,
        textAlignVertical: 'center',
        alignSelf: 'center',
    },
})
