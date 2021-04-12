#!/usr/bin/env bash
echo "...build js part"
mkdir -p android/dt-sdk/src/main/assets
mkdir -p android/dt-sdk/src/main/res
rm -rf android/dt-sdk/src/main/assets/index.android.bundle
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/dt-sdk/src/main/assets/index.android.bundle --assets-dest android/dt-sdk/src/main/res
cd android
echo "...gradle clean"
./gradlew clean dt-sdk:assembleRelease
echo "...publishToMavenLocal"
./gradlew dt-sdk:publishToMavenLocal
open ../package.json
echo "Change version in package.json before publish Android SDK to s3"
read -p "Press enter to continue"
./gradlew publish