# Dropthought SDK

## Integration

### React Native Integration

#### install packages

install peer dependency:

-   `yarn add @react-native-community/async-storage`
-   `yarn add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view` (if you already have these packages installed when installing `react-navigation`, you don't need this step)
-   `yarn add react-native-localize`

install dropthought-rn-sdk

```shell
yarn add git+ssh://git@gitlab.com:bct-taipei/dropthought-sdk.git#dropthought-rn-sdk-v1.0.0-rc.7-gitpkg
```

for iOS, remember to `pod install` again

#### Example

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

### Native Project Integration

-   iOS: https://github.com/DropthoughtSDK/dropthought-ios-sdk
-   android: https://github.com/DropthoughtSDK/dropthought-android-sdk

## Development workflow

### React-Native UI/Elements

When developing react-native elements, just use the normal process as in other react-native project:

Start the Metro Bundler:

```shell
$ yarn start
```

Start a dev application to view the result while developing:

```shell
$ yarn android
$ yarn ios
```

### Build SDK

When ready to test the result with SDK

#### Android

```shell
$ yarn build:android-sdk
```

this script would build a sdk of this sub project:

```
 /android
    /dt-sdk
```

This will build the `dt-sdk` library, and save to local maven (it should be under the `~/.m2` directory)

The version number will be equal to the version property of `package.json`

Open `androidDemo` to see if the result is correct

##### other notes

In order to build 3rd party RN libraries which has native module into dt-sdk, we copy `native_modules.gradle` from `node_modules/@react-native-community/cli-platform-android` (it is used to set up the dependencies of these libraries) and modify some places to fit our needs:

```gradle
def androidSourceDir = new File(reactNativeModule["androidSourceDir"], "/src/main/java")
appProject.android.sourceSets {
  main {
    java {
      srcDirs += androidSourceDir
    }
  }
}
```

this add the native module's source directory into project's sourceSets. Why not just use dependencies configuration only? Because that just doesn't work.

However, not every 3rd party library source could be added automatically, in dt-sdk's build.gradle, we manually add this source directory:

```gradle
sourceSets {
    main.java.srcDirs += "$rootDir/../node_modules/react-native-gesture-handler/android/lib/src/main/java"
}
```

besides source directories, we also need to include the dependencies from these libraries into `pom.xml`:

```gradle
dependencies {
    // ...
    // here we copy the dependencies from the 3rd party rn modules, ex. react-native-screens, ...
    api "androidx.transition:transition:1.1.0"
    api 'androidx.fragment:fragment:1.2.1'
    api 'androidx.coordinatorlayout:coordinatorlayout:1.1.0'
    api 'androidx.swiperefreshlayout:swiperefreshlayout:1.0.0'
    api 'com.google.android.material:material:1.1.0'
}
```

these are copied from the build.gradle file of `@react-native-community/masked-view`, `react-native-gesture-handler`, `react-native-screens`, ... Maybe this could be done automatically

the `api` dependency would be added later within pom file (please check `android/dt-sdk/gradle-mvn-push.gradle`)

## Publish workflow
