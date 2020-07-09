import {append, identity, evolve, assoc} from 'ramda'

/** @enum {'clear-feedbacks' | 'update-feedback'} */
export const FeedbackReducerActionType = {
    Clear: 'clear-feedbacks',
    Update: 'update-feedback',
}

/** @type {FeedbackReducerState} */
export const initialState = {
    answeredQuestionIds: [],
    feedbacksMap: {},
}

/**
 * @type {(state: FeedbackReducerState, action: FeedbackReducerAction) => FeedbackReducerState}
 */
export const feedbackReducer = (state, action) => {
    switch (action.type) {
        case FeedbackReducerActionType.Update:
            return updateFeedbackReducer(state, action)
        case FeedbackReducerActionType.Clear:
            return initialState
    }
    return state
}
export const reducer = feedbackReducer

/**
 * @type {(state: FeedbackReducerState, action: UpdateFeedbackAction) => FeedbackReducerState}
 */
const updateFeedbackReducer = (state, action) => {
    const feedback = action.payload.feedback
    const existed = !!state.feedbacksMap[feedback.questionId]

    return evolve({
        // if the feedback is already existed, return the original array(identity), otherwise, append the question id to the list
        answeredQuestionIds: existed ? identity : append(feedback.questionId),

        // always set the questionId to the feedback object
        feedbacksMap: assoc(feedback.questionId, feedback),
    })(state)
}

/**
 * @typedef {import('@dropthought/dropthought-data').Feedback} Feedback
 */
/**
 * @typedef {object} FeedbackReducerState
 * @property {string[]} answeredQuestionIds
 * @property {{[questionId: string]: Feedback}} feedbacksMap
 */

/**
 * @typedef {Object} ClearFeedbacksAction
 * @property {'clear-feedbacks'} type
 */
/**
 * @typedef {Object} UpdateFeedbackAction
 * @property {'update-feedback'} type
 * @property {{feedback: Feedback}} payload
 */

/**
 * @typedef { ClearFeedbacksAction | UpdateFeedbackAction} FeedbackReducerAction
 */

/**
 * @typedef {(action: FeedbackReducerAction) => void} FeedbackReducerDispatch
 */
