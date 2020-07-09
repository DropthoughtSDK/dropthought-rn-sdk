import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {KioskProvider} from '@dropthought/kiosk-rn-ui'
import {initializeWithAPIKey} from '@dropthought/dropthought-data'

import {SurveyContextProvider} from './contexts/survey'
import SurveyStackContainer from './SurveyStackContainer'

/**
 * @typedef {object} SDKEntryProps
 * @property {string} apiKey
 * @property {string} surveyId
 * @property {string=} defaultLanguage if not provided, default is "en"
 */

/**
 * @param {SDKEntryProps} props
 */
export default function App(props) {
    React.useEffect(() => {
        initializeWithAPIKey(props.apiKey)
    }, [props.apiKey])

    return (
        <SafeAreaProvider>
            <SurveyContextProvider {...props}>
                <NavigationContainer>
                    <KioskProvider>
                        <SurveyStackContainer />
                    </KioskProvider>
                </NavigationContainer>
            </SurveyContextProvider>
        </SafeAreaProvider>
    )
}
