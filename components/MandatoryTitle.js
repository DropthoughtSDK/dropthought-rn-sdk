import {View, Text, StyleSheet} from 'react-native'
import * as React from 'react'
import PropTypes from 'prop-types'

import {useAddMandatoryRef} from '../contexts/survey-page'
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
 * @returns {React.FunctionComponent<MandatoryTitleProps>}
 */
const MandatoryTitle = (props) => {
    const rtl = i18n.dir() === 'rtl'
    const dimensionWidthType = useDimensionWidthType()

    const ref = React.useRef()
    const addMandatoryRef = useAddMandatoryRef()

    React.useEffect(() => {
        if (ref.current && props.question.mandatory) {
            addMandatoryRef(props.question.questionId, ref.current)
        }
    }, [addMandatoryRef, props.question.mandatory, props.question.questionId])

    return (
        <View
            ref={ref}
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
        color: Colors.mandatoryRed,
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
