import * as React from 'react'
import {View, Modal} from 'react-native'
import {pick, omit} from 'ramda'

import {GlobalStyle} from '@dropthought/kiosk-rn-ui'

import SDKEntry from './SDKEntry'
import {feedbackUploader} from './lib/FeedbacksUploader'
import {initializeWithAPIKey} from './initialize'

const ModalProps = [
    'animated',
    'animationType',
    'transparent',
    'visible',
    'onRequestClose',
    'onShow',
    'presentationStyle',
    'supportedOrientations',
    'onDismiss',
    'onOrientationChange',
    'hardwareAccelerated',
]

/**
 * @param {SurveyModalProps & SDKEntryProps & ModalProps } props
 */
export function SurveyModal(props) {
    const sdkProps = omit(ModalProps, props)
    const modalProps = pick(ModalProps, props)
    return (
        <Modal presentationStyle="fullScreen" {...modalProps}>
            <View style={GlobalStyle.flex1}>
                <SDKEntry independent {...sdkProps} />
            </View>
        </Modal>
    )
}

/** @type {React.Context<(param: OpenSurveyProps) => void>} */
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

    const customPropsRef = React.useRef({})

    const openSurvey = React.useCallback((customProps) => {
        customPropsRef.current = customProps
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
        }).then(() => {
            feedbackUploader.upload()
        })
    }, [props.apiKey, props.baseURL])

    return (
        <SurveyModalOpenSurveyContext.Provider value={openSurvey}>
            {children}
            {visible ? (
                <SurveyModal
                    {...props}
                    {...customPropsRef.current}
                    visible={visible}
                    onClose={onCloseSurveyHandler}
                />
            ) : null}
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
/**
 * @typedef {SDKEntryProps & ModalProps} OpenSurveyProps
 */
