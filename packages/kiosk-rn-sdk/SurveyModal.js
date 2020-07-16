import * as React from 'react'
import {View, Modal} from 'react-native'
import {pick, omit} from 'ramda'

import {GlobalStyle} from '@dropthought/kiosk-rn-ui'

import SDKEntry from './SDKEntry'
import {initializeWithAPIKey} from './lib/API'
import {feedbackUploader} from './lib/FeedbacksUploader'

const sdkPropsKeys = [
    'apiKey',
    'surveyId',
    'defaultLanguage',
    'baseURL',
    'onClose',
]

/**
 * @param {SurveyModalProps & SDKEntryProps & ModalProps } props
 */
export function SurveyModal(props) {
    const sdkProps = pick(sdkPropsKeys, props)
    const modalProps = omit(sdkPropsKeys, props)
    return (
        <Modal presentationStyle="fullScreen" {...modalProps}>
            <View style={GlobalStyle.flex1}>
                <SDKEntry {...sdkProps} />
            </View>
        </Modal>
    )
}

/** @type {React.Context<() => void>} */
export const SurveyModalOpenSurveyContext = React.createContext(() => undefined)

export const useOpenSurvey = () => {
    const context = React.useContext(SurveyModalOpenSurveyContext)
    if (context === undefined) {
        throw new Error(
            'useOpenSurvey must be used within a SurveyModalContainer',
        )
    }

    return context
}

/**
 * @param {SurveyModalProps & SDKEntryProps & ModalProps } param0
 */
export const SurveyModalContainer = ({
    children,
    onClose,
    visible: _vi,
    ...props
}) => {
    const [visible, setVisible] = React.useState(false)

    const openSurvey = React.useCallback(() => {
        setVisible(true)
    }, [])

    const onCloseSurveyHandler = React.useCallback(() => {
        onClose && onClose()
        setVisible(false)
    }, [onClose])

    React.useEffect(() => {
        initializeWithAPIKey({
            apiKey: props.apiKey,
            baseURL: props.baseURL,
        })
        feedbackUploader.upload()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <SurveyModalOpenSurveyContext.Provider value={openSurvey}>
            {children}
            <SurveyModal
                {...props}
                visible={visible}
                onClose={onCloseSurveyHandler}
            />
        </SurveyModalOpenSurveyContext.Provider>
    )
}

/**
 * @typedef {import('./SDKEntry').SDKEntryProps} SDKEntryProps
 * @typedef {import('react-native').ModalProps} ModalProps
 */
/**
 * @typedef {object} SurveyModalProps
 * @property {boolean} visible
 */
