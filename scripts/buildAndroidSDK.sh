#!/usr/bin/env bash
mkdir -p android/dt-sdk/src/main/assets
mkdir -p android/dt-sdk/src/main/res
rm -rf android/dt-sdk/src/main/assets/index.android.bundle
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/dt-sdk/src/main/assets/index.android.bundle --assets-dest android/dt-sdk/src/main/res

cd android;
./gradlew clean dt-sdk:assembleRelease
./gradlew dt-sdk:publishToMavenLocal