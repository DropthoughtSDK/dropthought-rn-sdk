import React from 'react'
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native'
import MandatoryTitle from './MandatoryTitle'
import GlobalStyle, {Colors} from '../styles'
import PropTypes from 'prop-types'
import i18n from '../translation'
import {
    DimensionWidthType,
    useDimensionWidthType,
} from '../hooks/useWindowDimensions'

const MIN_VALUE = 1

const getInitialSelectedValue = (feedback) => {
    if (feedback && feedback.answers && feedback.answers[0]) {
        return parseInt(feedback.answers[0])
    }
    return undefined
}

const SliderRatingQuestion = ({
    question,
    onFeedback,
    backgroundColor,
    tintColor,
    feedback,
    forgot,
    themeColor,
}) => {
    const [value, setValue] = React.useState(getInitialSelectedValue(feedback))
    const minimumValue = MIN_VALUE
    const maximumValue = parseInt(question.scale)

    const dimensionWidthType = useDimensionWidthType()

    const getBackgroundColorStyle = () => {
        return {
            backgroundColor: themeColor,
            resizeMode: 'contain',
        }
    }

    const getSliderIndicator = () => {
        return [...Array(maximumValue).keys()].map((valueData, index) => (
            <>
                {dimensionWidthType === DimensionWidthType.phone ? (
                    <TouchableHighlight
                        underlayColor={Colors.white}
                        key={index.toString()}
                        onPress={() => {
                            onFeedback({
                                questionId: question.questionId,
                                answers: [index],
                                type: 'rating',
                            })
                            setValue(index)
                        }}>
                        <View
                            style={[
                                styles.backgroundPhone,
                                index === value
                                    ? getBackgroundColorStyle()
                                    : {},
                            ]}>
                            <Text
                                style={[
                                    index === value
                                        ? styles.selected_label
                                        : styles.label,
                                ]}>
                                {valueData + minimumValue}
                                {valueData === 0 && ' - ' + question.options[0]}
                                {valueData + minimumValue === maximumValue &&
                                    ' - ' +
                                        question.options[
                                            question.options.length - 1
                                        ]}
                            </Text>
                        </View>
                    </TouchableHighlight>
                ) : (
                    <TouchableHighlight
                        underlayColor={Colors.white}
                        key={index.toString()}
                        onPress={() => {
                            onFeedback({
                                questionId: question.questionId,
                                answers: [index],
                                type: 'rating',
                            })
                            setValue(index)
                        }}>
                        <View
                            style={[
                                styles.backgroundTablet,
                                index === value
                                    ? getBackgroundColorStyle()
                                    : {},
                            ]}>
                            <Text
                                style={[
                                    index === value
                                        ? styles.selected_label
                                        : styles.label,
                                ]}>
                                {valueData + minimumValue}
                            </Text>
                        </View>
                    </TouchableHighlight>
                )}
            </>
        ))
    }

    const getWidthStyle = (rtl = false) => {
        let width =
            (maximumValue / 10.0) * 100 > 100
                ? 100
                : (maximumValue / 10.0) * 100
        return {
            maxWidth: width + '%',
            alignSelf: rtl ? 'flex-end' : 'auto',
            marginTop: 22,
            paddingHorizontal: 10,
        }
    }

    const rtl = i18n.dir() === 'rtl'
    return (
        <View style={GlobalStyle.questionContainer}>
            <MandatoryTitle
                forgot={forgot}
                style={styles.marginBottom25}
                question={question}
            />
            {dimensionWidthType === DimensionWidthType.phone ? (
                <View
                    style={[
                        styles.vertical,
                        rtl && GlobalStyle.flexRowReverse,
                    ]}>
                    {getSliderIndicator()}
                </View>
            ) : (
                <>
                    <View style={getWidthStyle(rtl)}>
                        <View style={styles.line} />
                        <View
                            style={[
                                styles.horizontal,
                                rtl && GlobalStyle.flexRowReverse,
                            ]}>
                            {getSliderIndicator()}
                        </View>
                    </View>
                    <View
                        style={[
                            styles.horizontal,
                            styles.marginTop10,
                            getWidthStyle(rtl),
                            rtl && GlobalStyle.flexRowReverse,
                        ]}>
                        <Text style={styles.options}>
                            {question.options[0]}
                        </Text>
                        <Text style={styles.options}>
                            {question.options[question.options.length - 1]}
                        </Text>
                    </View>
                </>
            )}
        </View>
    )
}

export default React.memo(SliderRatingQuestion)

SliderRatingQuestion.propTypes = {
    question: PropTypes.object,
    onFeedback: PropTypes.func,
    backgroundColor: PropTypes.string,
    tintColor: PropTypes.string,
    feedback: PropTypes.shape({
        answers: PropTypes.array,
        questionId: PropTypes.string,
    }),
    forgot: PropTypes.bool,
    themeColor: PropTypes.string,
}

const styles = StyleSheet.create({
    backgroundPhone: {
        backgroundColor: Colors.white,
        borderColor: Colors.sliderShadowColor,
        borderRadius: 2,
        elevation: 5,
        height: 33,
        justifyContent: 'center',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.16,
        shadowRadius: 3,
        width: '100%',
        marginBottom: 8,
    },
    backgroundTablet: {
        backgroundColor: Colors.white,
        borderColor: Colors.sliderShadowColor,
        borderRadius: 1000,
        elevation: 5,
        height: 45,
        justifyContent: 'center',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: 45,
    },
    horizontal: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    vertical: {
        flex: 1,
        justifyContent: 'space-between',
        width: '100%',
    ...Platform.select({
            android: {
                paddingHorizontal: 7,
            },
        }),
    },
    label: {
        color: Colors.black,
        textAlign: 'center',
    },
    line: {
        backgroundColor: Colors.sliderShadowColor,
        height: 1,
        top: '50%',
        width: '100%',
    },
    marginBottom10: {
        marginBottom: 10,
    },
    marginBottom25: {
        marginBottom: 25,
    },
    marginTop10: {
        marginTop: 10,
    },
    options: {
        fontSize: 12,
    },
    selected_label: {
        color: Colors.white,
        textAlign: 'center',
    },
})
