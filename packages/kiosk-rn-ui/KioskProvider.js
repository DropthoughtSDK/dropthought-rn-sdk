import * as React from 'react'

import {FeedbackProvider} from './contexts/feedback'

export const KioskProvider = ({children}) => {
    return <FeedbackProvider>{children}</FeedbackProvider>
}
