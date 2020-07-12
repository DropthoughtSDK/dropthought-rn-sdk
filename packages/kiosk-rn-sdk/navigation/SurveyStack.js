import * as React from 'react'
import {Platform} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import {
    Colors,
    useDimensionWidthType,
    DimensionWidthType,
} from '@dropthought/kiosk-rn-ui'

import CloseButton from '../components/CloseButton'
import StartScreen from '../screens/StartScreen'
import SurveyScreen from '../screens/SurveyScreen'
import EndScreen from '../screens/EndScreen'
import {useSurvey} from '../contexts/survey'
const Stack = createStackNavigator()

const SurveyStack = () => {
    const survey = useSurvey()
    const isPhone = useDimensionWidthType() === DimensionWidthType.phone
    const themeColor = survey.surveyProperty.hexCode

    return (
        <Stack.Navigator
            initialRouteName="Start"
            headerMode="float"
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
                headerTitleAlign: isPhone ? 'left' : 'center',
                headerBackTitleVisible: false,
                headerLeft: () => <CloseButton />,
                headerRight: () => <CloseButton />,
                title: survey.surveyName,
                ...Platform.select({
                    android: TransitionPresets.FadeFromBottomAndroid,
                }),
            }}>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen
                name="Survey"
                component={SurveyScreen}
                initialParams={{
                    pageIndex: 0,
                }}
            />
            <Stack.Screen
                name="End"
                component={EndScreen}
                initialParams={{
                    error: undefined,
                    surveyFeedback: undefined,
                }}
                options={{
                    gestureEnabled: false,
                }}
            />
        </Stack.Navigator>
    )
}

export default SurveyStack

/**
 * @typedef {Object} SurveyStackParamList
 * @property {undefined} Start
 * @property {SurveyScreenParams} Survey
 * @property {EndScreenParams} End
 */
/**
 * @typedef {Object} SurveyScreenParams
 * @property {number} pageIndex
 */
/**
 * @typedef {Object} EndScreenParams
 * @property {Error=} error
 * @property {import('@dropthought/dropthought-data').SurveyFeedback=} surveyFeedback
 */

/**
 * @template T
 * @typedef {import('@react-navigation/stack').StackNavigationProp<SurveyStackParamList, T>} SurveyStackNavigationProps
 */

/**
 * @template T
 * @typedef {import('@react-navigation/native').RouteProp<SurveyStackParamList, T>} SurveyStackRouteProp
 */
