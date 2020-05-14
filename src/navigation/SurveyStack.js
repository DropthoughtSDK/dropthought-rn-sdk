import * as React from 'react'
import {View, Text} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

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
    <Stack.Navigator>
      <Stack.Screen name="SurveyStart" component={SurveyStartScreen} />
    </Stack.Navigator>
  )
}

export default SurveyStack
