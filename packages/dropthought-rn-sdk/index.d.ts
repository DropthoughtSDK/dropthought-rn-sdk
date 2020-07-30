import {FunctionComponent} from 'react'
import {ModalProps} from 'react-native'

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

declare function DropthoughtContainer(
    props: DropthoughtContainerProps,
): React.FunctionComponent<DropthoughtContainerProps>

declare function useOpenSurvey(): () => void

declare const feedbackUploader: {
    upload: () => Promise<void>
}
