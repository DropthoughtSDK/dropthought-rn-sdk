/**
 * This Fake Screen is used when you need a header, but it is not in any navigation
 * it is used to display the placeholder when unable to fetch survey
 */
import React from 'react'
import {View, StatusBar, Platform, StyleSheet} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'

import {GlobalStyle, Colors} from '@dropthought/kiosk-rn'
import CloseButton from '../components/CloseButton'

const FakeScreen = ({children}) => {
    return (
        <>
            {Platform.OS === 'android' && (
                <StatusBar backgroundColor={Colors.white} />
            )}
            <SafeAreaView style={styles.container}>
                <CloseButton tintColor={Colors.purple} />
                <View style={GlobalStyle.flex1}>{children}</View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        ...GlobalStyle.flex1,
        backgroundColor: Colors.white,
    },
})

export default FakeScreen
