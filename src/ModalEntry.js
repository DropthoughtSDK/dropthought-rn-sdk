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
                apiKey="paste api key here"
                surveyId="paste survey id here"
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
