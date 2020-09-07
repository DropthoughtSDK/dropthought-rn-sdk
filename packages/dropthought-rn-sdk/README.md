# Dropthought React Native SDK

## install packages

### install peer dependency:

-   `yarn add @react-native-community/async-storage`
-   `yarn add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view` (if you already have these packages installed when installing `react-navigation`, you don't need this step)
-   `yarn add react-native-localize`

### install dropthought-rn-sdk

```shell
yarn add git+ssh://git@gitlab.com:bct-taipei/dropthought-sdk.git#dropthought-rn-sdk-v1.0.2-gitpkg
```

for iOS, remember to `pod install` again

### additional settings for android

If you have open-ended questions (text input) in your survey, in order to let android avoid the keyboard while editing, you might need to add `adjustResize` to `android:windowSoftInputMode` in your `AndroidManifest.xml`:

```xml
    <activity
        android:name=".MainActivity"
        android:windowSoftInputMode="adjustResize"
    >
    </activity>
```

## Integrate Dropthought to your RN project

### 1. Use DropthoughtContainer

use `DropthoughtContainer` to initialize Dropthought with your apiKey and surveyId, put it to the parent of your component/screen that needs to open survey (or you can put it to one of your root providers)

use `useOpenSurvey` hook to get the function that opens the dropthought survey

```jsx
import React from 'react'
import {SafeAreaView, StyleSheet, Button, StatusBar} from 'react-native'

import {DropthoughtContainer, useOpenSurvey} from 'dropthought-rn-sdk'

const App = () => {
    const openSurvey = useOpenSurvey()
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <Button title="Open Survey" onPress={() => openSurvey()} />
            </SafeAreaView>
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

const AppRoot = () => (
    <DropthoughtContainer
        apiKey="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW5nLmNoZW5AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyNjg2NzcxNiwiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.eihfroHtnqhH-INiuAaYY2uLW28dENPvpqfU2RlQ3Far3G612atoUs5qfidtl74wW2P5yHLJ-e8jNLDaj5jFYg"
        surveyId="8c472f20-b3b2-4260-83a3-8f1a3b32cd73">
        <App />
    </DropthoughtContainer>
)

export default AppRoot
```

#### open another survey

```javascript
const openSurvey = useOpenSurvey()

// in some onPress handler
openSurvey({
    surveyId: 'another survey id',
})
```

#### on submit feedback

you can pass a callback function to get the feedback that is submitted by client

for example:

```javascript
const openSurvey = useOpenSurvey()

// in some onPress handler
openSurvey({
    surveyId: 'another survey id',
    onSubmit: (feedback, error) => {
        // if error is null, it means survey is sent to server
        // if error is not null, then this feedback is stored offline
        console.log('feedback', feedback)
    },
})
```

NOTE. onSubmitSuccess will be deprecated soon

#### passing optional metadata

you can pass optional metadata when user submits a survey, metadata can be anything

for example:

```javascript
const openSurvey = useOpenSurvey()

// in some onPress handler
openSurvey({
    surveyId: 'another survey id',
    metadata: {
        Email: 'some-email',
        Name: 'the name',
        EmpId: 'the id',
        anythingId: 'anything you want',
    },
})
```
