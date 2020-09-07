import * as React from 'react'
import {View, Button, StyleSheet, TextInput} from 'react-native'

import {SurveyModalContainer, useOpenSurvey} from '@dropthought/kiosk-rn-sdk'

/** @typedef {import('@dropthought/kiosk-rn-sdk').SDKEntryProps} SDKEntryProps */

/**
 * @param {SDKEntryProps} props
 */
function ModalEntry(props) {
    const openSurvey = useOpenSurvey()
    const [surveyId, setSurveyId] = React.useState('')
    const [name, setName] = React.useState('')

    const onSubmitHandler = (feedback, error) => {
        console.log('success feedback', feedback?.feedbacks, error)
    }

    return (
        <>
            <View style={styles.container}>
                <TextInput
                    placeholder="Enter Survey Id"
                    onChangeText={setSurveyId}
                    value={surveyId}
                    style={{width: 200, fontSize: 16, marginBottom: 30}}
                />
                <TextInput
                    placeholder="Enter Name"
                    onChangeText={setName}
                    value={name}
                    style={{width: 200, fontSize: 16, marginBottom: 30}}
                />
                <Button
                    title="Open Survey"
                    onPress={() =>
                        openSurvey({
                            onSubmit: onSubmitHandler,
                            // metadata: name
                            //     ? {
                            //           Name: name,
                            //       }
                            //     : undefined,
                            surveyId:
                                surveyId ||
                                'c377db1d-68f0-44b6-bc13-7726d7afd3e1',
                        })
                    }
                />
            </View>
        </>
    )
}

export default function ModalEntryRoot() {
    return (
        <SurveyModalContainer
            animated
            animationType="slide"
            apiKey="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW5nLmNoZW5AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyODE0MjgxNywiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.MXZcIaRwjuLGGUVMyAWcCq1I0lbk7ASaCouwnpM474SigSEfrLk3Y50b3bgvF7M2jY5hAJnxWkkqJDmXYhV0MA"
            surveyId="a614cb3a-e9b4-4633-beaf-07b43e88bf13">
            <ModalEntry />
        </SurveyModalContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
