import * as React from 'react'

import {SDKEntry} from '@dropthought/kiosk-rn-sdk'

import SurveyNativeBridge from './native/SurveyBridge'

/** @typedef {import('@dropthought/kiosk-rn-sdk').SDKEntryProps} SDKEntryProps */

/**
 * @param {SDKEntryProps} props
 */
export default function NativeSDKEntry(props) {
    const onClosePressHandler = React.useCallback(() => {
        SurveyNativeBridge.dismiss()
    }, [])

    return <SDKEntry {...props} onClose={onClosePressHandler} />
}
