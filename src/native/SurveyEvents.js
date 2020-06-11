import {
    DeviceEventEmitter,
    NativeModules,
    NativeEventEmitter,
    Platform,
} from 'react-native'
import {initializeWithAPIKey} from '@dropthought/dropthought-data'
import {feedbackUploader} from '../lib/FeedbacksUploader'

const uploadQueuedFeedbacksHandler = (params) => {
    initializeWithAPIKey(params.apiKey)
    feedbackUploader
        .upload()
        .then(() => {
            console.log('all finished')
        })
        .catch((err) => {
            console.log('failed when upload', err)
        })

    // un-comment the following codes to debug the feedback uploader
    // feedbackUploader.subscribe((state) => {
    //     console.log('feedback uploader state changed', state)
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
