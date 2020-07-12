import {
    DeviceEventEmitter,
    NativeModules,
    NativeEventEmitter,
    Platform,
} from 'react-native'

import {initializeWithAPIKey, feedbackUploader} from '@dropthought/kiosk-rn-sdk'

const uploadQueuedFeedbacksHandler = (params) => {
    initializeWithAPIKey({
        apiKey: params.apiKey,
    })

    // un-comment the following codes to debug the feedback uploader
    // const unsubscribe = feedbackUploader.subscribe(async (state) => {
    //     console.log('feedback uploader state changed', state)
    // })

    feedbackUploader.upload()
    // un-comment the following codes to debug the feedback uploader
    // .finally(() => {
    //     unsubscribe()
    // })
}

if (Platform.OS === 'android') {
    DeviceEventEmitter.addListener(
        'UploadQueuedFeedback',
        uploadQueuedFeedbacksHandler,
    )
} else if (Platform.OS === 'ios') {
    const {SurveyEmitter} = NativeModules
    const eventEmitter = new NativeEventEmitter(SurveyEmitter)
    eventEmitter.addListener(
        'UploadQueuedFeedback',
        uploadQueuedFeedbacksHandler,
    )
}
