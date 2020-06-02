import QuestionContainer from './containers/QuestionContainer'
import SurveyScreenLayout from './containers/SurveyScreenLayout'
import EndScreenLayout from './containers/EndScreenLayout'
import StartScreenLayout from './containers/StartScreenLayout'
import {KioskProvider} from './KioskProvider'
import i18n from './translation'
import {Colors} from './styles'
export * from './hooks/useWindowDimensions'

export {
    QuestionContainer,
    Colors,
    SurveyScreenLayout,
    EndScreenLayout,
    StartScreenLayout,
    KioskProvider,
    i18n,
}
