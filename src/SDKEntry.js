import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {SafeAreaProvider} from 'react-native-safe-area-context'

import SurveyStack from './navigation/SurveyStack'

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <SurveyStack />
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
