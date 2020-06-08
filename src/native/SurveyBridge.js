import {NativeModules} from 'react-native'

const {Survey: SurveyBridge} = NativeModules

export default SurveyBridge || {
    dismiss: () => {
        console.log('dev dismiss')
    },
}
