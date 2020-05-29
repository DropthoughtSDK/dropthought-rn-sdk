import {find, propEq, isEmpty, prop} from 'ramda'

/** @enum {'other'} */
export const QuestionBrandType = {
    Other: 'other',
}

/** @enum {'Date'|'Name'|'Email'|'Phone'|'Number'|'String'} */
export const QuestionMetaDataType = {
    Name: 'Name',
    Email: 'Email',
    Phone: 'Phone',
    Number: 'Number',
    Date: 'Date',
    String: 'String',
}

/**
 * validate if value match metaDataType question' rule
 * @param {Question} question
 * @param {string} value
 * @returns {boolean}
 */
export const metaDataTypeQuestionValidator = (question, value) => {
    // if it is not a open ended question no need to check, return valid
    if (question.type !== 'open') return true

    // no need to check the value when no value or no type
    if (!value || !question.metaDataType) return true

    let reg = null

    switch (question.metaDataType) {
        case QuestionMetaDataType.Number:
            return !isNaN(value)
        case QuestionMetaDataType.Date:
            reg = /^((?:\d{4}-\d{2}-\d{2})|(?:\d{4}\/\d{2}\/\d{2})|(?:\d{4}:\d{2}:\d{2}))?( )?(\d{2}:\d{2}:\d{2})?$/
            return reg.test(value)
        case QuestionMetaDataType.Phone:
            reg = /^\+[1-9]\d{1,14}$/
            return reg.test(value)
        case QuestionMetaDataType.Email:
            reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return reg.test(value)
        default:
            // no need to check the value
            return true
    }
}

/**
 * if mandatory question has feedback
 * @param {Question} question
 * @param {Feedback} feedback
 * @returns {boolean}
 */
export const mandatoryQuestionValidator = (question, feedback) => {
    if (!question.mandatory) return true

    // check if feedback has answer
    return (
        feedback.answers !== undefined &&
        feedback.answers.length &&
        !isEmpty(feedback.answers[0])
    )
}

/**
 * validate if question's feedback is valid:
 * metadata type value check, mandatory check
 * @param {Question} question
 * @param {Feedback} feedback
 * @returns {boolean}
 */
export const questionFeedbackValidator = (question = {}, feedback = {}) => {
    return (
        metaDataTypeQuestionValidator(question, feedback.answers?.[0]) &&
        mandatoryQuestionValidator(question, feedback)
    )
}

/**
 * validate if every question's feedback is valid
 * return false if one of them is invalid
 * @param {Question[]} questions
 * @param {Feedback[]} feedbacks
 */
export const questionsFeedbackValidator = (questions = [], feedbacks = []) => {
    return questions.every(question => {
        // get the feedback that belongs to this question
        /** @type {Feedback} */
        const feedback = find(
            propEq('questionId', question.questionId),
            feedbacks,
        )
        return questionFeedbackValidator(question, feedback)
    })
}

/**
 * return the invalid question ids
 * invalid: answer is not valid or mandatory not answered
 * @param {Question[]} questions
 * @param {Feedback[]} feedbacks
 * @returns {string[]}
 */
export const getInvalidQuestionIds = (questions = [], feedbacks = []) => {
    return questions
        .filter(question => {
            // get the feedback that belongs to this question
            /** @type {Feedback} */
            const feedback = find(
                propEq('questionId', question.questionId),
                feedbacks,
            )
            return !questionFeedbackValidator(question, feedback)
        })
        .map(prop('questionId'))
}

/**
 * @typedef {Object} Question
 * @property {string} questionId -
 * @property {string} questionTitle -
 * @property {QuestionBrandType|string=} questionBrand -
 * @property {QuestionMetaDataType=} metaDataType -
 * @property {boolean} mandatory -
 * @property {string[]=} options -
 * @property {"rating" | "open" | "multiChoice" | "nps" | "singleChoice" } type
 * @property {("slider" | "smiley")=} subType
 * @property {number=} scale
 */

/** @typedef {import('./FeedbacksUploader').Feedback} Feedback */
