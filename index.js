/**
 * @format
 */
import {AppRegistry} from 'react-native'
import SDKEntry from './src/NativeSDKEntry'
import {name as appName} from './app.json'

// register events
import './src/native/SurveyEvents'

AppRegistry.registerComponent(appName, () => SDKEntry)
