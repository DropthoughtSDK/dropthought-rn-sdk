import React from 'react'
import {Text, ScrollView, StyleSheet} from 'react-native'

import {Colors, SurveyScreenLayout} from '@dropthought/kiosk-rn'

const SurveyScreen = () => {
    return <SurveyScreenLayout />
}

export default SurveyScreen

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '8%',
        backgroundColor: Colors.white,
    },
})
