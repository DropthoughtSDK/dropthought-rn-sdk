import {FeedbackReducerActionType} from './FeedbackReducer'

/**
 * @param {FeedbackReducerDispatch} dispatch
 * @param {Feedback} feedback
 */
export function updateFeedback(dispatch, feedback) {
    dispatch({
        type: FeedbackReducerActionType.Update,
        payload: {
            feedback,
        },
    })
}

/**
 * @param {FeedbackReducerDispatch} dispatch
 */
export function clearFeedbacks(dispatch) {
    dispatch({
        type: FeedbackReducerActionType.Clear,
    })
}

/** @typedef {import('./FeedbackReducer').FeedbackReducerState} FeedbackReducerState */
/** @typedef {import('./FeedbackReducer').FeedbackReducerDispatch} FeedbackReducerDispatch */
/** @typedef {import('./FeedbackReducer').Feedback} Feedback */
