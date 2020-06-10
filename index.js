/**
 * @format
 */
import 'react-native-gesture-handler'

import {
    AppRegistry,
    DeviceEventEmitter,
    NativeModules,
    NativeEventEmitter,
} from 'react-native'
import SDKEntry from './src/SDKEntry'
import {name as appName} from './app.json'

AppRegistry.registerComponent(appName, () => SDKEntry)

import {
    apiPostEvent,
    initializeWithAPIKey,
    apiGetProgramById,
} from '@dropthought/dropthought-data'
import {loadData} from './src/lib/Storage'

const onSessionConnect = (params) => {
    console.log('on session connect handler with params', params)
    initializeWithAPIKey(params.apiKey)
    loadData('survey-feedbacks', []).then((data) => {
        console.log('load data', data)
        if (data.length) {
            const surveyFeedback = data[0]
            apiPostEvent({
                programId: surveyFeedback.surveyId,
                feedbacks: surveyFeedback.feedbacks,
            })
                .then((result) => {
                    console.log('submit result', result)
                })
                .catch((err) => {
                    console.log('submit failed', err)
                })
        }
    })
    apiGetProgramById({
        programId: '23856ed5-5805-4146-b67e-5ff9aace0362',
    })
        .then((data) => {
            console.log('load program data', data)
        })
        .catch((err) => {
            console.log('load program data failed', err)
        })
}

DeviceEventEmitter.addListener('onSessionConnect', onSessionConnect)

const {SurveyEmitter} = NativeModules
const eventEmitter = new NativeEventEmitter(SurveyEmitter)
eventEmitter.addListener('onSessionConnect', onSessionConnect)
