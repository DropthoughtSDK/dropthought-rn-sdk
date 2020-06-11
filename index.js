/**
 * @format
 */
import 'react-native-gesture-handler'

import {AppRegistry} from 'react-native'
import SDKEntry from './src/SDKEntry'
import {name as appName} from './app.json'

// register events
import './src/native/SurveyEvents'

AppRegistry.registerComponent(appName, () => SDKEntry)
