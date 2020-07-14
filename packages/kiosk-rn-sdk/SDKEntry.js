import 'react-native-gesture-handler'

import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {KioskProvider} from '@dropthought/kiosk-rn-ui'
import {initializeWithAPIKey} from './lib/API'

import {SurveyContextProvider} from './contexts/survey'
import SurveyStackContainer from './SurveyStackContainer'

/**
 * @typedef {object} SDKEntryProps
 * @property {string} apiKey
 * @property {string} surveyId
 * @property {string=} defaultLanguage if not provided, default is "en"
 * @property {string=} baseURL if not provided, default is ...
 * @property {()=>void=} onClose when the close icon is pressed in the header
 */

/**
 * @param {SDKEntryProps} props
 */
export default function App(props) {
    React.useEffect(() => {
        initializeWithAPIKey({
            apiKey: props.apiKey,
            baseURL: props.baseURL,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
