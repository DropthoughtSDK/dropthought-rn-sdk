import React from 'react'
import {
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    View,
} from 'react-native'
import {useLayout} from '@react-native-community/hooks'

import {useWindowDimensions} from '../hooks/useWindowDimensions'
import QuestionContainer from './QuestionContainer'
import SurveyProgressBar from './SurveyProgressBar'
import SurveyFooter from './SurveyFooter'
import GlobalStyle, {Colors} from '../styles'

import {singlePageSurvey, multiPagesLogicSurvey} from '../mockSurveyData'

/** @typedef {import('@dropthought/dropthought-data').Survey} Survey*/
/**
 * define props for SurveyScreenLayout
 *
 * @typedef {Object} SurveyScreenLayoutProps
 * @property {number} pageIndex - current page index (start from 0)
 * @property {Survey} survey
 * @property {()=>void} onSubmit
 * @property {(nextPageIndex: number)=>void} onNextPage
 * @property {()=>void} onPrevPage
 * @property {()=>void} onPageEnter
 * @property {()=>void} onPageLeave
 * @property {()=>void} onFeedback
 */

const surveyMockData = singlePageSurvey

const DEFAULT_KEYBOARD_VERTICAl_OffSET = 64

/**
 * @type {React.FunctionComponent<SurveyScreenLayoutProps>}
 * @param {SurveyScreenLayoutProps} props
 */
const SurveyScreenLayout = (props) => {
    const {pageIndex = 0} = props
    const {onLayout, ...layout} = useLayout()
    const {height} = useWindowDimensions()

    const questions = surveyMockData.pages[pageIndex].questions.map(
        (question) => {
            return (
                <QuestionContainer
                    key={question.questionId}
                    question={question}
                    forgot={false}
                    themeColor={surveyMockData.surveyProperty.hexCode}
                />
            )
        },
    )

    const keyboardVerticalOffset = layout.height
        ? height - layout.height
        : DEFAULT_KEYBOARD_VERTICAl_OffSET

    return (
        <View onLayout={onLayout} style={GlobalStyle.flex1}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={keyboardVerticalOffset}
                style={styles.keyboardAvoidingViewStyle}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContentContainer}>
                    {/* man body content: questions and buttons */}
                    <View style={styles.bodyContent}>
                        {questions}
                        <SurveyFooter {...props} survey={surveyMockData} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <SurveyProgressBar survey={surveyMockData} />
        </View>
    )
}

export default SurveyScreenLayout

const noop = () => undefined
SurveyScreenLayout.defaultProps = {
    pageIndex: 0,
    onSubmit: noop,
    onNextPage: noop,
    onPrevPage: noop,
}

const styles = StyleSheet.create({
    keyboardAvoidingViewStyle: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 30,
        backgroundColor: Colors.white,
    },
    scrollViewContentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 30,
    },

    // where the questions and submit/page buttons go
    bodyContent: {
        width: '100%',
        flex: 1,
        maxWidth: 648,
    },
})
