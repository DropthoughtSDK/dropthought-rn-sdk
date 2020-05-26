import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {KioskProvider} from '@dropthought/kiosk-rn'

import SurveyStack from './navigation/SurveyStack'

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <KioskProvider>
                    <SurveyStack />
                </KioskProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
