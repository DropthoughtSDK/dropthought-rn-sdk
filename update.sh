cd iosSDK
rm assets/main.jsbundle
yarn run build:ios
cd ../iosDemo
rm Podfile.lock
rm -rf Pods
pod install
open iosDemoObjc.xcworkspace
cd ..
rm -R ../dropthought-ios-sdk/react-native-modules
mkdir ../dropthought-ios-sdk/react-native-modules
cp -a node_modules/@react-native-community/. ../dropthought-ios-sdk/react-native-modules/@react-native-community/
cp -a node_modules/react-native/. ../dropthought-ios-sdk/react-native-modules/react-native/
cp -a node_modules/react-native-gesture-handler/. ../dropthought-ios-sdk/react-native-modules/react-native-gesture-handler/
cp -a node_modules/react-native-localize/. ../dropthought-ios-sdk/react-native-modules/react-native-localize/
cp -a node_modules/react-native-safe-area-context/. ../dropthought-ios-sdk/react-native-modules/react-native-safe-area-context/
rm ../dropthought-ios-sdk/Dropthought/assets/main.jsbundle
cp iosSDK/assets/main.jsbundle ../dropthought-ios-sdk/Dropthought/assets/main.jsbundle
