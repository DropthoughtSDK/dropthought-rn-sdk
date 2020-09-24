import * as React from 'react'

import {SDKEntry, initializeWithAPIKey} from '@dropthought/kiosk-rn-sdk'

import SurveyNativeBridge from './native/SurveyBridge'

/** @typedef {import('@dropthought/kiosk-rn-sdk').SDKEntryProps} SDKEntryProps */

/**
 * @param {SDKEntryProps} props
 */
export default function NativeSDKEntry(props) {
    const onClosePressHandler = React.useCallback(() => {
        SurveyNativeBridge.dismiss()
    }, [])

    React.useEffect(() => {
        initializeWithAPIKey({
            apiKey: props.apiKey,
        })
    }, [props.apiKey])

    return <SDKEntry {...props} onClose={onClosePressHandler} />
}
