cd ../iosSDK
rm assets/main.jsbundle
cd ..
yarn run build:ios
cd iosDemo
rm Podfile.lock
rm -rf Pods
pod install
open iosDemoObjc.xcworkspace
