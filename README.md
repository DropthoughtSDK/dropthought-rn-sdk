# Dropthought SDK

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
