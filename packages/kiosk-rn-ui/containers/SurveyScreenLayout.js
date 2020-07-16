import React from 'react'
import {
    ScrollView as RNScrollView,
    StyleSheet,
    Platform,
    View,
    findNodeHandle,
} from 'react-native'

import {SurveyPageProvider} from '../contexts/survey-page'
import QuestionContainer from './QuestionContainer'
import DefaultSurveyProgressBar from './SurveyProgressBar'
import SurveyFooter from './SurveyFooter'
import DefaultSurveyPageIndicator from '../components/SurveyPageIndicator'
import {KeyboardAvoidingScrollView} from '../components/KeyboardAvoidingView'
import GlobalStyle, {Colors} from '../styles'
import i18n from '../translation'

/** @enum {0|1} */
export const SurveyProgressBarPosition = {
    FixedBottom: 0,
    BelowBody: 1,
}

/** @typedef {import('@dropthought/dropthought-data').Survey} Survey*/
/** @typedef {import('@dropthought/dropthought-data').SurveyFeedback} SurveyFeedback*/
/** @typedef {import('./SurveyProgressBar').SurveyProgressBarComponent} SurveyProgressBarComponent*/
/** @typedef {import('React').ComponentType<import('../components/SurveyPageIndicator').SurveyPageIndicatorProps>} SurveyPageIndicatorComponent*/
/**
 * define props for SurveyScreenLayout
 *
 * @typedef {Object} SurveyScreenLayoutProps
 * @property {number} pageIndex - current page index (start from 0)
 * @property {Survey} survey
 * @property {(surveyFeedback: SurveyFeedback)=>void} onSubmit
 * @property {(nextPageIndex: number)=>void} onNextPage
 * @property {()=>void} onPrevPage
 * @property {()=>void} onPageEnter
 * @property {()=>void} onPageLeave
 * @property {()=>void} onFeedback
 * @property {SurveyProgressBarComponent} SurveyProgressBar
 * @property {SurveyProgressBarPosition} surveyProgressBarPosition
 * @property {SurveyPageIndicatorComponent} SurveyPageIndicator
 */

const ScrollView =
    Platform.OS === 'ios' ? KeyboardAvoidingScrollView : RNScrollView

/**
 * @type {React.FunctionComponent<SurveyScreenLayoutProps>}
 * @param {SurveyScreenLayoutProps} props
 */
const SurveyScreenLayout = (props) => {
    const {
        pageIndex = 0,
        survey,
        SurveyPageIndicator = DefaultSurveyPageIndicator,
        SurveyProgressBar = DefaultSurveyProgressBar,
        surveyProgressBarPosition = SurveyProgressBarPosition.FixedBottom,
    } = props
    const scrollViewRef = React.useRef()

    // when validation start, set the state
    const [validationStarted, setValidationStarted] = React.useState(false)
    const onValidationStartHandler = React.useCallback(() => {
        setValidationStarted(true)
    }, [])

    // when validation failed, scroll to the ref
    const onValidationFailedHandler = React.useCallback((_, targetReg) => {
        if (targetReg && scrollViewRef.current) {
            targetReg.measureLayout(
                findNodeHandle(scrollViewRef.current),
                (_x, y) => {
                    scrollViewRef.current.scrollTo({
                        x: 0,
                        y: y,
                        animated: true,
                    })
                },
            )
        }
    }, [])

    const questions = survey.pages[pageIndex].questions.map((question) => {
        return (
            <QuestionContainer
                key={question.questionId}
                anonymous={survey.anonymous}
                question={question}
                validationStarted={validationStarted}
                themeColor={survey.surveyProperty.hexCode}
            />
        )
    })

    const surveyProgressBar = (
        <SurveyProgressBar
            survey={survey}
            pageIndex={pageIndex}
            rtl={i18n.dir() === 'rtl'}
        />
    )

    return (
        <View style={GlobalStyle.flex1}>
            <SurveyPageIndicator
                pageIndex={pageIndex}
                survey={survey}
                rtl={i18n.dir() === 'rtl'}
            />
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContentContainer}>
                {/* man body content: questions and buttons */}
                <View style={styles.bodyContent}>
                    {questions}
                    <SurveyFooter
                        {...props}
                        survey={survey}
                        onValidationFailed={onValidationFailedHandler}
                        onValidationStart={onValidationStartHandler}
                    />
                    {surveyProgressBarPosition ===
                        SurveyProgressBarPosition.BelowBody &&
                        surveyProgressBar}
                </View>
            </ScrollView>
            {surveyProgressBarPosition ===
                SurveyProgressBarPosition.FixedBottom && surveyProgressBar}
        </View>
    )
}

/**
 * @type {React.FunctionComponent<SurveyScreenLayoutProps>}
 * @param {SurveyScreenLayoutProps} props
 */
const SurveyScreenLayoutWrapper = (props) => {
    return (
        <SurveyPageProvider>
            <SurveyScreenLayout {...props} />
        </SurveyPageProvider>
    )
}

export default SurveyScreenLayoutWrapper

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