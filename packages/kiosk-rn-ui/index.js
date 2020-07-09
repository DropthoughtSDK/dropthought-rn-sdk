import QuestionContainer from './containers/QuestionContainer'
import SurveyScreenLayout from './containers/SurveyScreenLayout'
import EndScreenLayout from './containers/EndScreenLayout'
import StartScreenLayout from './containers/StartScreenLayout'
import PlaceholderScreen from './components/PlaceholderScreen'
export * from './components/PlaceholderScreen'
import {KioskProvider} from './KioskProvider'
import i18n from './translation'
export {Colors, GlobalStyle} from './styles'
export * from './hooks/useWindowDimensions'

import ActivityIndicatorMask from './components/ActivityIndicatorMask'

export {
    QuestionContainer,
    SurveyScreenLayout,
    EndScreenLayout,
    StartScreenLayout,
    PlaceholderScreen,
    KioskProvider,
    ActivityIndicatorMask,
    i18n,
}
