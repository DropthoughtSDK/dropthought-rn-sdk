import R from 'ramda'
import {EvaluateRuleSet} from './dt-common-lib'

/**
 * return -1 if not existed
 * @type {(pageId: string, survey: Survey) => number}
 */
export const getPageIndexFromPageId = R.curry((pageId, survey) =>
    R.pipe(
        //
        R.prop('pageOrder'),
        R.findIndex(R.equals(pageId)),
    )(survey),
)

/**
 * only keep the feedbacks that belongs to a certain page
 * if a question is not answered => textOrIndexArr: ['']
 * also convert the answers to 0-based
 * transform it to IQAData type
 * @type {(pageIndex: number, survey: Survey, feedbacksMap: {[questionId: string]: Feedback} ) => [IQAData]}
 */
const transformFeedbacks = (pageIndex, survey, feedbacksMap) => {
    // get the default page IQAData
    /** @type {IQAData[]} */
    const defaultPageIQAData = R.pipe(
        R.prop('pages'),
        R.nth(pageIndex),
        R.prop('questions'),
        R.map((question) => ({
            questionId: question.questionId,
            textOrIndexArr: [''],
        })),
    )(survey)

    // if feedback has answers, use it to replace the default
    return defaultPageIQAData.map((defaultIQAData) => {
        const feedback = feedbacksMap[defaultIQAData.questionId]
        if (feedback && !R.isEmpty(feedback.answers)) {
            return {
                questionId: defaultIQAData.questionId,
                textOrIndexArr: feedback.answers,
            }
        }
        return defaultIQAData
    })
}

/**
 * @param {number} pageIndex
 * @param {string} pageId
 * @param {{[questionId: string]: Feedback}} feedbacksMap
 * @param {Survey} survey
 * @return {number} return -1 means jump to end
 */
export function nextPage(pageIndex, pageId, feedbacksMap, survey) {
    const defaultNextPage = () =>
        pageIndex >= survey.pageOrder.length - 1 ? -1 : pageIndex + 1

    // if there's no rule, go to default next page
    const pageRuleSet = survey.rules[pageId]
    if (!pageRuleSet || R.isEmpty(pageRuleSet)) {
        return defaultNextPage()
    }

    // apply the rule
    const iQADataArr = transformFeedbacks(pageIndex, survey, feedbacksMap)
    const nextPageId = EvaluateRuleSet(pageRuleSet, iQADataArr)
    if (!nextPageId) {
        return defaultNextPage()
    }

    // next page index
    return getPageIndexFromPageId(nextPageId, survey)
}

/** @typedef {import('.').Survey} Survey */
/** @typedef {import('./dt-common-lib/IfcRule').IQAData} IQAData */
/** @typedef {import('.').Feedback} Feedback */
