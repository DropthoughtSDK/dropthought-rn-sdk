import * as React from 'react'
import {View, Button, StyleSheet} from 'react-native'

import {SurveyModal} from '@dropthought/kiosk-rn-sdk'

/** @typedef {import('@dropthought/kiosk-rn-sdk').SDKEntryProps} SDKEntryProps */

/**
 * @param {SDKEntryProps} props
 */
export default function ModalEntry(props) {
    const [visible, setVisible] = React.useState(false)

    return (
        <>
            <View style={styles.container}>
                <Button title="Open Survey" onPress={() => setVisible(true)} />
            </View>
            <SurveyModal
                visible={visible}
                apiKey="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW5nLmNoZW5AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyNjA3MzE4NSwiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.0yADsK6-C8UFd5QvND6UAlrgggFnPiXOVsk15QAcCg0lqOweWRCYxe0qyTFEld6O3wV1mpBgFM48tVflvmvPtA"
                surveyId="fe34fc81-416d-4cfe-9105-59a213f4a9d7"
                onClose={() => setVisible(false)}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
