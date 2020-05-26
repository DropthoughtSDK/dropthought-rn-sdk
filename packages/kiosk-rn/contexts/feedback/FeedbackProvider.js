import * as React from 'react'

import {FeedbackStateContext, FeedbackDispatchContext} from './FeedbackContext'
import {reducer, initialState} from './FeedbackReducer'

export function FeedbackProvider({children}) {
    const [state, dispatch] = React.useReducer(reducer, initialState)

    return (
        <FeedbackStateContext.Provider value={state}>
            <FeedbackDispatchContext.Provider value={dispatch}>
                {children}
            </FeedbackDispatchContext.Provider>
        </FeedbackStateContext.Provider>
    )
}
