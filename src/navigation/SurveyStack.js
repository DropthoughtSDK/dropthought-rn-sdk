import * as React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {Colors} from '@dropthought/kiosk-rn'

import StartScreen from '../screens/StartScreen'
import SurveyScreen from '../screens/SurveyScreen'
import EndScreen from '../screens/EndScreen'
import {useSurvey} from '../contexts/survey'
const Stack = createStackNavigator()

const SurveyStack = () => {
    const survey = useSurvey()
    const themeColor = survey.surveyProperty.hexCode

    return (
        <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{
                headerStyle: {
                    backgroundColor: themeColor,
                    elevation: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: Colors.white,
                headerTitleStyle: {
                    fontSize: 16,
                    fontWeight: '600',
                },
                headerTitleAlign: 'left',
                headerBackTitleVisible: false,
                headerLeft: null,
                headerRight: null,
                title: '',
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
