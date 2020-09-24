import * as React from 'react'

import {
    SurveyModalContainer,
    feedbackUploader,
    useOpenSurvey,
    initializeWithAPIKey,
    SurveyModal,
} from '@dropthought/kiosk-rn-sdk'

const BASE_URL = 'https://app.dropthought.com/dtapp'
/**
 * @type {React.FunctionComponent<DropthoughtContainerOwnProps & ModalProps>}
 * @param {DropthoughtContainerOwnProps & ModalProps} param0
 */
export const DropthoughtContainer = (props) => {
    return <SurveyModalContainer {...props} baseURL={BASE_URL} />
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

export {feedbackUploader, useOpenSurvey, SurveyModal}

/**
 * Low-level APIs
 */

/**
 * @param {{ apiKey: string}} params
 */
export function initialize(params) {
    initializeWithAPIKey({
        ...params,
        baseURL: BASE_URL,
    })
}
