import * as React from 'react'
import {View, Text} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import SurveyScreen from '../screens/SurveyScreen'
const Stack = createStackNavigator()

function SurveyStartScreen() {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Survey Start Screen</Text>
        </View>
    )
}

const SurveyStack = () => {
    return (
        <Stack.Navigator initialRouteName="Survey">
            <Stack.Screen name="SurveyStart" component={SurveyStartScreen} />
            <Stack.Screen
                name="Survey"
                component={SurveyScreen}
                initialParams={{
                    pageIndex: 0,
                }}
            />
        </Stack.Navigator>
    )
}

export default SurveyStack

/**
 * @typedef {Object} SurveyStackParamList
 * @property {undefined} SurveyStart
 * @property {SurveyScreenParams} Survey
 */
/**
 * @typedef {Object} SurveyScreenParams
 * @property {number} pageIndex
 */

/**
 * @template T
 * @typedef {import('@react-navigation/stack').StackNavigationProp<SurveyStackParamList, T>} SurveyStackNavigationProps
 */

/**
 * @template T
 * @typedef {import('@react-navigation/native').RouteProp<SurveyStackParamList, T>} SurveyStackRouteProp
 */
