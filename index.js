/**
 * @format
 */
import 'react-native-gesture-handler'

import {AppRegistry} from 'react-native'
// import App from './App'
import SDKEntry from './src/SDKEntry'
import {name as appName} from './app.json'

AppRegistry.registerComponent(appName, () => SDKEntry)
