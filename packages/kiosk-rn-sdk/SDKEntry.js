import 'react-native-gesture-handler'

import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {KioskProvider} from '@dropthought/kiosk-rn-ui'

import {SurveyContextProvider} from './contexts/survey'
import {CustomPropsContextProvider} from './contexts/custom-props'
import SurveyStackContainer from './SurveyStackContainer'

/**
 * @typedef {object} SDKEntryOwnProps
 * @property {string} apiKey
 * @property {string} surveyId
 * @property {string=} defaultLanguage if not provided, default is "en"
 * @property {string=} baseURL if not provided, default is ...
 * @property {()=>void=} onClose when the close icon is pressed in the header
 */

/**
 * @typedef {import('./contexts/custom-props').CustomProps & SDKEntryOwnProps} SDKEntryProps
 */

/**
 * @param {SDKEntryProps} props
 */
export default function App(props) {
    return (
        <SafeAreaProvider>
            <CustomPropsContextProvider {...props}>
                <SurveyContextProvider {...props}>
                    <NavigationContainer>
                        <KioskProvider>
                            <SurveyStackContainer />
                        </KioskProvider>
                    </NavigationContainer>
                </SurveyContextProvider>
            </CustomPropsContextProvider>
        </SafeAreaProvider>
    )
}
