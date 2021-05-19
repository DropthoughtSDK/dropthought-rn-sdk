// dummy bridge, native sdk needs implement the real code
export default {
    dismiss: () => {
        console.log('dev dismiss')
    },

    // error is a return code number
    // 0 means success
    onFeedbackResult: (surveyFeedback, errorCode) => {
        console.log('dev onFeedback Result', errorCode)
    },
}
