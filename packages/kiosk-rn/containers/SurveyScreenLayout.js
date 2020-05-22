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
import GlobalStyle, {Colors} from '../styles'

/** @type {import('@dropthought/dropthought-data').Survey} */
const surveyMockData = {
    anonymous: true,
    kiosk: 0,
    language: 'en',
    languages: ['en'],
    pageOrder: ['c948fa69-65b6-4fd0-8611-f7d57d50b86d'],
    pages: [
        {
            pageId: 'c948fa69-65b6-4fd0-8611-f7d57d50b86d',
            pageTitle: '1st Page',
            questions: [
                {
                    category: 'Performant',
                    mandatory: false,
                    metaDataType: null,
                    options: ['Poor', 'Fair', 'Neutral', 'Good', 'Excellent'],
                    questionBrand: '',
                    questionId: '608f85e9-cd65-4534-ad73-cc02a9769768',
                    questionTitle:
                        'How Does The App Run After Installation Or Update? (Performant)',
                    scale: '5',
                    subType: 'slider',
                    type: 'rating',
                },
                {
                    category: 'Satisfaction',
                    mandatory: false,
                    metaDataType: null,
                    options: ['Poor', 'Fair', 'Neutral', 'Good', 'Excellent'],
                    questionBrand: '',
                    questionId: 'b42cc374-7fcc-43ad-9397-faad909de6f2',
                    questionTitle: 'How Useful Is The App For You?',
                    scale: '5',
                    subType: 'smiley',
                    type: 'rating',
                },
                {
                    category: 'Satisfaction',
                    mandatory: false,
                    metaDataType: null,
                    options: ['Poor', 'Fair', 'Neutral', 'Good', 'Excellent'],
                    questionBrand: '',
                    questionId: '6a36c003-b520-4504-9265-5dd9f1b4bc9d',
                    questionTitle:
                        'How Satisfied Are You With The Look And Feel Of The App?',
                    scale: '5',
                    subType: 'smiley',
                    type: 'rating',
                },
                {
                    category: 'Price',
                    mandatory: false,
                    metaDataType: null,
                    options: ['Poor', 'Fair', 'Neutral', 'Good', 'Excellent'],
                    questionBrand: '',
                    questionId: '2ce26b18-3ed8-4885-be24-2457e6316544',
                    questionTitle:
                        'How Does The Pricing Of The App Compare With Other Software In The Category?',
                    scale: '5',
                    subType: 'slider',
                    type: 'rating',
                },
                {
                    category: 'Satisfaction',
                    mandatory: false,
                    metaDataType: null,
                    options: ['Poor', 'Fair', 'Neutral', 'Good', 'Excellent'],
                    questionBrand: '',
                    questionId: 'a60acc8f-2fc6-4b05-ac44-9f5a41065dc8',
                    questionTitle:
                        'How Satisfied Are You With The Customer Support Team For The App?',
                    scale: '5',
                    subType: 'smiley',
                    type: 'rating',
                },
                {
                    mandatory: false,
                    metaDataType: 'Name',
                    questionBrand: 'Type in your answer here',
                    questionId: '48544604-dd1c-4523-9750-51477b005ce6',
                    questionTitle: 'Name',
                    scale: '0',
                    type: 'open',
                },
                {
                    mandatory: false,
                    metaDataType: 'Email',
                    questionBrand: 'Type in your answer here',
                    questionId: 'b735b6bb-02c4-4bcd-b05e-08b49a3ad0d3',
                    questionTitle: 'Email',
                    scale: '0',
                    type: 'open',
                },
                {
                    mandatory: false,
                    metaDataType: 'Phone',
                    questionBrand: 'Type in your answer here',
                    questionId: 'a40110bc-7517-4210-b527-f5b05556449a',
                    questionTitle: 'Phone',
                    scale: '0',
                    type: 'open',
                },
                {
                    mandatory: false,
                    metaDataType: 'Date',
                    questionBrand: 'Type in your answer here',
                    questionId: 'e5aeb990-ab8e-4c6c-94ef-3af456cec692',
                    questionTitle: 'Birthday',
                    scale: '0',
                    type: 'open',
                },
                {
                    mandatory: false,
                    metaDataType: 'Number',
                    questionBrand: 'Type in your answer here',
                    questionId: 'fdd0d327-ede1-41f8-8c00-50573408fcb8',
                    questionTitle: 'Value',
                    scale: '0',
                    type: 'open',
                },
                {
                    mandatory: false,
                    metaDataType: 'String',
                    options: ['Male', 'Female'],
                    questionBrand: 'other',
                    questionId: '8dd4e758-4394-4be7-930f-e9749a92ce4c',
                    questionTitle: 'Gender',
                    scale: '0',
                    type: 'singleChoice',
                },
                {
                    mandatory: false,
                    metaDataType: 'String',
                    questionBrand: 'Type in your answer here',
                    questionId: '093453d0-791b-4afd-bc1a-c049768e548b',
                    questionTitle: 'Location',
                    scale: '0',
                    type: 'open',
                },
                {
                    mandatory: false,
                    metaDataType: null,
                    options: [
                        'Staff/Service',
                        'Ambience',
                        'Food',
                        'Price',
                        'Cleanliness',
                    ],
                    questionBrand: 'other',
                    questionId: 'cf8c0262-c47c-48ee-9bde-f6291e0d8beb',
                    questionTitle:
                        'What Are The Things You Want Us To Improve?',
                    scale: '5',
                    type: 'multiChoice',
                },
            ],
        },
    ],
    rules: {},
    state: 'active',
    surveyEndDate: '2020-05-31 04:35:00',
    surveyId: 'ecef84c8-5787-4138-a8f2-318dcbd87b43',
    surveyName: 'Kiosk, anonymous, May 2020, metadata type question',
    surveyProperty: {
        image:
            'https://dt-program-banner.s3.us-west-1.amazonaws.com/e60c8719-30bf-4c89-9fcc-d27fc685ac65-65.png',
        hexCode: '#1ea188',
        fileName: 'logo.png',
        imageBase64: '',
    },
    surveyStartDate: '2020-05-06 04:35:30',
    surveyStatus: 'active',
    thankYouText: 'Thank you for taking our survey!',
    timezone: 'America/Los_Angeles',
    welcomeText: null,
}

const DEFAULT_KEYBOARD_VERTICAl_OffSET = 64

const SurveyScreenLayout = () => {
    const {onLayout, ...layout} = useLayout()
    const {height} = useWindowDimensions()

    const questions = surveyMockData.pages[0].questions.map((question) => {
        return (
            <QuestionContainer
                key={question.questionId}
                question={question}
                forgot={false}
                themeColor={surveyMockData.surveyProperty.hexCode}
            />
        )
    })

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
                    <View style={styles.bodyContent}>
                        {/* man body content: questions and buttons */}
                        {questions}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SurveyScreenLayout

const styles = StyleSheet.create({
    keyboardAvoidingViewStyle: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: '8%',
        backgroundColor: Colors.white,
    },
    scrollViewContentContainer: {
        flexGrow: 1,
        alignItems: 'center',
    },

    // where the questions and submit/page buttons go
    bodyContent: {
        width: '100%',
        flex: 1,
        maxWidth: 648,
    },
})
