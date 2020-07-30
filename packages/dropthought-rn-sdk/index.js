import * as React from 'react'

import {
    SurveyModalContainer,
    feedbackUploader,
    useOpenSurvey,
} from '@dropthought/kiosk-rn-sdk'

/**
 * @type {React.FunctionComponent<DropthoughtContainerOwnProps & ModalProps>}
 * @param {DropthoughtContainerOwnProps & ModalProps} param0
 */
export const DropthoughtContainer = (props) => {
    return (
        <SurveyModalContainer
            {...props}
            baseURL="https://app.dropthought.com/dtapp"
        />
    )
}

/**
 * @typedef {object} DropthoughtContainerOwnProps
 * @property {string} apiKey
 * @property {string} surveyId
 * @property {string=} defaultLanguage if not provided, default is "en"
 * @property {()=>void=} onClose when the close icon is pressed in the header
 */

/**
 * @typedef {import('react-native').ModalProps} ModalProps
 */

export {feedbackUploader, useOpenSurvey}
