import {FunctionComponent} from 'react'
import {ModalProps} from 'react-native'
import {SurveyFeedback} from '@dropthought/dropthought-data/data'

export declare interface DropthoughtContainerProps extends ModalProps {
    /**
     * api key of your dropthought account
     */
    apiKey: string

    /**
     * the survey id to open with
     */
    surveyId: string

    /**
     * if not provided, default is "en"
     */
    defaultLanguage?: string

    /**
     * callback, when the close is pressed in the header
     */
    onClose?: () => void
}

export declare interface OpenSurveyParams {
    /**
     * the survey id to open with
     */
    surveyId?: string

    /**
     * callback function, when a feedback is submitted (failed or not)
     */
    onSubmit?: (feedback: SurveyFeedback, error?: Error) => void

    metadata?: any

    /**
     * @deprecated use `onSubmit`
     * callback function, when a feedback is successfully sent to cloud
     */
    onSubmitSuccess?: (feedback: SurveyFeedback) => void

    /**
     * if not provided, default is "en"
     */
    defaultLanguage?: string
}

declare function DropthoughtContainer(
    props: DropthoughtContainerProps,
): React.FunctionComponent<DropthoughtContainerProps>

declare function useOpenSurvey(): (params: OpenSurveyParams) => void

declare const feedbackUploader: {
    upload: () => Promise<void>
}
