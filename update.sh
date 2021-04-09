echo '=== Start to publish SDK ==='
echo 'Remove last version of main.jsbundle'
cd iosSDK
rm assets/main.jsbundle
echo 'Build new version of main.jsbundle'
yarn run build:ios
cd ..
echo 'Copy new version of main.jsbundle and react-native-modules to dropthought-ios-sdk git folder'
rm -R ../dropthought-ios-sdk/react-native-modules/*
cp -a node_modules/@react-native-community/. ../dropthought-ios-sdk/react-native-modules/@react-native-community/
cp -a node_modules/react-native/. ../dropthought-ios-sdk/react-native-modules/react-native/
cp -a node_modules/react-native-gesture-handler/. ../dropthought-ios-sdk/react-native-modules/react-native-gesture-handler/
cp -a node_modules/react-native-localize/. ../dropthought-ios-sdk/react-native-modules/react-native-localize/
cp -a node_modules/react-native-safe-area-context/. ../dropthought-ios-sdk/react-native-modules/react-native-safe-area-context/
rm ../dropthought-ios-sdk/Dropthought/assets/main.jsbundle
cp iosSDK/assets/main.jsbundle ../dropthought-ios-sdk/Dropthought/assets/main.jsbundle
echo 'You can commit the changes to Github'
echo
echo

echo '=== Start to test SDK ==='
cd iosDemo
echo 'Remove last version of Dropthought and react-native-modules'
rm -R Dropthought
rm -R react-native-modules
echo 'Copy new version of Dropthought and react-native-modules'
cp -a ../../dropthought-ios-sdk/Dropthought/. Dropthought/
cp -a ../../dropthought-ios-sdk/react-native-modules/. react-native-modules/
echo 'Reinstall CocoaPods'
rm Podfile.lock
rm -rf Pods
pod install
open iosDemoObjc.xcworkspace