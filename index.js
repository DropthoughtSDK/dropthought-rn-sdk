/**
 * @format
 */
import {AppRegistry} from 'react-native'
import {SDKEntry} from '@dropthought/kiosk-rn-sdk'
import {name as appName} from './app.json'

// register events
// import './src/native/SurveyEvents'

AppRegistry.registerComponent(appName, () => SDKEntry)
