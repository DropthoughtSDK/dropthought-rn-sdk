import React from 'react'
import {View, StyleSheet} from 'react-native'
import {noop} from 'lodash'
import SmileyIcon from './SmileyIcon'
import PropTypes from 'prop-types'
import MandatoryTitle from './MandatoryTitle'
import GlobalStyle from '../styles'
import i18n from '../translation'
import {
    DimensionWidthType,
    useDimensionWidthType,
} from '../hooks/useWindowDimensions'

const fakeSmiley = (
    <SmileyIcon selected={false} onPress={noop} source={null} label="" />
)

const getInitialSelectedValue = (feedback, question) => {
    let prevAnswer
    if (feedback && feedback.answers && feedback.answers[0]) {
        prevAnswer = parseInt(feedback.answers[0], 10)
    }
    return question.options.map((_option, index) => prevAnswer === index)
}

const SmileyRatingQuestion = ({question, onFeedback, feedback, forgot}) => {
    const [selected, setSelected] = React.useState(
        getInitialSelectedValue(feedback, question),
    )

    const setSelectedAndFeedback = React.useCallback(
        (index) => {
            let selectedMap = question.options.map(() => false)
            selectedMap[index] = true
            setSelected(selectedMap)
            onFeedback({
                questionId: question.questionId,
                answers: [index],
                type: 'rating',
            })
        },
        [onFeedback, question.options, question.questionId],
    )

    const rtl = i18n.dir() === 'rtl'
    const dimensionWidthType = useDimensionWidthType()
    const styles =
        dimensionWidthType === DimensionWidthType.phone
            ? phoneStyles
            : tabletStyles

    const renderSmiley = () => {
        const viewStyle = [
            dimensionWidthType === DimensionWidthType.phone
                ? styles.vertical
                : styles.horizontal,
            rtl && GlobalStyle.flexRowReverse,
        ]
        const {options} = question
        switch (options.length) {
            case 2:
                return (
                    <View style={viewStyle}>
                        <SmileyIcon
                            selected={selected[0]}
                            onPress={() => setSelectedAndFeedback(0)}
                            source={
                                selected[0]
                                    ? require('../assets/btn_very_dislike_selected.png')
                                    : require('../assets/btn_very_dislike.png')
                            }
                            label={options[0]}
                        />
                        <SmileyIcon
                            selected={selected[1]}
                            onPress={() => setSelectedAndFeedback(1)}
                            source={
                                selected[1]
                                    ? require('../assets/btn_very_like_selected.png')
                                    : require('../assets/btn_very_like.png')
                            }
                            label={options[1]}
                        />
                        {fakeSmiley}
                        {fakeSmiley}
                        {fakeSmiley}
                    </View>
                )
            case 3:
                return (
                    <View style={viewStyle}>
                        <SmileyIcon
                            selected={selected[0]}
                            onPress={() => setSelectedAndFeedback(0)}
                            source={
                                selected[0]
                                    ? require('../assets/btn_very_dislike_selected.png')
                                    : require('../assets/btn_very_dislike.png')
                            }
                            label={options[0]}
                        />
                        <SmileyIcon
                            selected={selected[1]}
                            onPress={() => setSelectedAndFeedback(1)}
                            source={
                                selected[1]
                                    ? require('../assets/btn_not_sure_selected.png')
                                    : require('../assets/btn_not_sure.png')
                            }
                            label={options[1]}
                        />
                        <SmileyIcon
                            selected={selected[2]}
                            onPress={() => setSelectedAndFeedback(2)}
                            source={
                                selected[2]
                                    ? require('../assets/btn_very_like_selected.png')
                                    : require('../assets/btn_very_like.png')
                            }
                            label={options[2]}
                        />
                        {fakeSmiley}
                        {fakeSmiley}
                    </View>
                )
            case 4:
                return (
                    <View style={viewStyle}>
                        <SmileyIcon
                            selected={selected[0]}
                            onPress={() => setSelectedAndFeedback(0)}
                            source={
                                selected[0]
                                    ? require('../assets/btn_very_dislike_selected.png')
                                    : require('../assets/btn_very_dislike.png')
                            }
                            label={options[0]}
                        />
                        <SmileyIcon
                            selected={selected[1]}
                            onPress={() => setSelectedAndFeedback(1)}
                            source={
                                selected[1]
                                    ? require('../assets/btn_not_sure_selected.png')
                                    : require('../assets/btn_not_sure.png')
                            }
                            label={options[1]}
                        />
                        <SmileyIcon
                            selected={selected[2]}
                            onPress={() => setSelectedAndFeedback(2)}
                            source={
                                selected[2]
                                    ? require('../assets/btn_like_selected.png')
                                    : require('../assets/btn_like.png')
                            }
                            label={options[2]}
                        />
                        <SmileyIcon
                            selected={selected[3]}
                            onPress={() => setSelectedAndFeedback(3)}
                            source={
                                selected[3]
                                    ? require('../assets/btn_very_like_selected.png')
                                    : require('../assets/btn_very_like.png')
                            }
                            label={options[3]}
                        />
                        {fakeSmiley}
                    </View>
                )
            case 5:
                return (
                    <View style={viewStyle}>
                        <SmileyIcon
                            selected={selected[0]}
                            onPress={() => setSelectedAndFeedback(0)}
                            source={
                                selected[0]
                                    ? require('../assets/btn_very_dislike_selected.png')
                                    : require('../assets/btn_very_dislike.png')
                            }
                            label={options[0]}
                        />
                        <SmileyIcon
                            selected={selected[1]}
                            onPress={() => setSelectedAndFeedback(1)}
                            source={
                                selected[1]
                                    ? require('../assets/btn_dislike_selected.png')
                                    : require('../assets/btn_dislike.png')
                            }
                            label={options[1]}
                        />
                        <SmileyIcon
                            selected={selected[2]}
                            onPress={() => setSelectedAndFeedback(2)}
                            source={
                                selected[2]
                                    ? require('../assets/btn_not_sure_selected.png')
                                    : require('../assets/btn_not_sure.png')
                            }
                            label={options[2]}
                        />
                        <SmileyIcon
                            selected={selected[3]}
                            onPress={() => setSelectedAndFeedback(3)}
                            source={
                                selected[3]
                                    ? require('../assets/btn_like_selected.png')
                                    : require('../assets/btn_like.png')
                            }
                            label={options[3]}
                        />
                        <SmileyIcon
                            selected={selected[4]}
                            onPress={() => setSelectedAndFeedback(4)}
                            source={
                                selected[4]
                                    ? require('../assets/btn_very_like_selected.png')
                                    : require('../assets/btn_very_like.png')
                            }
                            label={options[4]}
                        />
                    </View>
                )
        }
    }

    return (
        <View style={GlobalStyle.questionContainer}>
            <MandatoryTitle forgot={forgot} question={question} />
            <View
                style={[styles.smileyRowContainer, rtl && GlobalStyle.flexEnd]}>
                {renderSmiley(rtl)}
            </View>
        </View>
    )
}

export default React.memo(SmileyRatingQuestion)

SmileyRatingQuestion.propTypes = {
    question: PropTypes.object,
    onFeedback: PropTypes.func,
    feedback: PropTypes.shape({
        answers: PropTypes.array,
        questionId: PropTypes.string,
    }),
    forgot: PropTypes.bool,
}

const phoneStyles = StyleSheet.create({
    horizontal: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 10,
        justifyContent: 'space-between',
    },
    smileyRowContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 6,
    },
})

const tabletStyles = StyleSheet.create({
    horizontal: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: 560,
        paddingLeft: 10,
        justifyContent: 'space-between',
    },
    vertical: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: 560,
        paddingLeft: 10,
        justifyContent: 'space-between',
    },
    smileyRowContainer: {
        flex: 1,
        flexDirection: 'row',
    },
})
