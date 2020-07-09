/**
 * @description
 * this context keep the mandatory question title ref of a single survey page
 * they are saved in the mandatoryQuestionTitleRefs, as map:
 * {
 *     'question-id-1': ref1,
 *     'question-id-3': ref3,
 * }
 */
import * as React from 'react'
import {assoc} from 'ramda'

/** @type {SurveyPageContextValue} */
const initialValue = {
    mandatoryQuestionTitleRefs: {},
    addMandatoryQuestionTitleRef: () => undefined,
}

/** @type {React.Context<SurveyPageContextValue>} */
const SurveyPageContext = React.createContext(initialValue)

export function SurveyPageProvider({children}) {
    const [mandatoryQuestionTitleRefs, setRefs] = React.useState({})

    const addMandatoryQuestionTitleRef = React.useCallback(
        (questionId, ref) => {
            // update the refs map by setting the questionId to ref
            setRefs(assoc(questionId, ref))
        },
        [],
    )

    /** @type {SurveyPageContextValue} */
    const state = React.useMemo(
        () => ({
            mandatoryQuestionTitleRefs,
            addMandatoryQuestionTitleRef,
        }),
        [mandatoryQuestionTitleRefs, addMandatoryQuestionTitleRef],
    )

    return (
        <SurveyPageContext.Provider value={state}>
            {children}
        </SurveyPageContext.Provider>
    )
}

/**
 * @returns {SurveyPageContextValue}
 */
export const useSurveyPageContext = () => {
    return React.useContext(SurveyPageContext)
}

export const useAddMandatoryRef = () => {
    const {addMandatoryQuestionTitleRef} = useSurveyPageContext()
    return addMandatoryQuestionTitleRef
}

/**
 * @typedef {import('@dropthought/dropthought-data').Feedback} Feedback
 */
/**
 * @typedef {object} SurveyPageContextValue
 * @property {{[questionId: string]: any}} mandatoryQuestionTitleRefs - the ref of the question titles of this page
 * @property {(questionId: string, ref: any)=>void} addMandatoryQuestionTitleRef - add the ref of MandatoryQuestionTitle
 */
