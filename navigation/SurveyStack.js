import * as React from 'react'
import {Platform} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import {isEmpty, isNil} from 'ramda'

import {
    Colors,
    useDimensionWidthType,
    DimensionWidthType,
    PlaceholderImageTypes,
    PlaceholderScreen,
    i18n,
} from '@dropthought/kiosk-rn-ui'

import CloseButton from '../components/CloseButton'
import StartScreen from '../screens/StartScreen'
import SurveyScreen from '../screens/SurveyScreen'
import EndScreen from '../screens/EndScreen'
import FakeScreen from '../screens/FakeScreen'
import {useSurveyContext} from '../contexts/survey'
const Stack = createStackNavigator()

const noData = (a) => isNil(a) || isEmpty(a)

const SurveyStack = () => {
    const {survey, onClose} = useSurveyContext()
    const isPhone = useDimensionWidthType() === DimensionWidthType.phone

    // check if survey data is valid
    if (
        noData(survey.pages) ||
        noData(survey.surveyProperty) ||
        noData(survey.surveyStartDate) ||
        noData(survey.surveyEndDate)
    ) {
        // need to render placeholder
        return (
            <FakeScreen onClose={onClose}>
                <PlaceholderScreen
                    imageType={PlaceholderImageTypes.ProgramUnavailable}
                    message={i18n.t('start-survey:placeholder-message')}
                />
            </FakeScreen>
        )
    }

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
                headerLeft: () => <CloseButton onPress={onClose} />,
                headerRight: () => <CloseButton onPress={onClose} />,
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
 * @property {import('@dropthought/dropthought-data/data').SurveyFeedback=} surveyFeedback
 */

/**
 * @template T
 * @typedef {import('@react-navigation/stack').StackNavigationProp<SurveyStackParamList, T>} SurveyStackNavigationProps
 */

/**
 * @template T
 * @typedef {import('@react-navigation/native').RouteProp<SurveyStackParamList, T>} SurveyStackRouteProp
 */
