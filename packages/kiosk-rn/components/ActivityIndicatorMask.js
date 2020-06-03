import React from 'react'
import {ActivityIndicator, View} from 'react-native'
import {GlobalStyle} from '../styles'

export const activityIndicatorMask = (
    <View style={[GlobalStyle.loadingMask, GlobalStyle.fullCenter]}>
        <ActivityIndicator />
    </View>
)

const ActivityIndicatorMask = ({loading = false}) => {
    return loading && activityIndicatorMask
}

export default ActivityIndicatorMask
