import * as React from 'react'
import {View, Text} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import StartScreen from '../screens/StartScreen'
import SurveyScreen from '../screens/SurveyScreen'
import EndScreen from '../screens/EndScreen'
import {useSurvey} from '../contexts/survey'
const Stack = createStackNavigator()

const SurveyStack = () => {
    const survey = useSurvey()
    return (
        <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{
                headerStyle: {
                    backgroundColor: survey.surveyProperty.hexCode,
                },
                headerTitleAlign: 'left',
                headerBackTitleVisible: false,
                headerLeft: null,
                headerRight: null,
            }}>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen
                name="Survey"
                component={SurveyScreen}
                initialParams={{
                    pageIndex: 0,
                }}
            />
            <Stack.Screen name="End" component={EndScreen} />
        </Stack.Navigator>
    )
}

export default SurveyStack

/**
 * @typedef {Object} SurveyStackParamList
 * @property {undefined} Start
 * @property {SurveyScreenParams} Survey
 * @property {undefined} End
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
