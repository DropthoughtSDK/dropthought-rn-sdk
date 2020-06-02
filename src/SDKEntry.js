import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {KioskProvider} from '@dropthought/kiosk-rn'

import {SurveyContextProvider} from './contexts/survey'
import SurveyStack from './navigation/SurveyStack'

export default function App(props) {
    return (
        <SafeAreaProvider>
            <SurveyContextProvider {...props}>
                <NavigationContainer>
                    <KioskProvider>
                        <SurveyStack />
                    </KioskProvider>
                </NavigationContainer>
            </SurveyContextProvider>
        </SafeAreaProvider>
    )
}
