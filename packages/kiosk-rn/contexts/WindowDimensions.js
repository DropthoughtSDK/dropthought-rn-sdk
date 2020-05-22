import * as React from 'react'
import {useWindowDimensions, Dimensions} from 'react-native'

/** @enum {'portrait' | 'landscape'} */
export const DimensionWidthType = {
    portrait: 'portrait',
    landscape: 'landscape',
}

/** @typedef {import('react-native').ScaledSize} ScaledSize */
/**
 * @typedef {object} DimensionType
 * @property {DimensionWidthType} widthType
 */
/** @typedef {DimensionType&ScaledSize} WindowDimensionsState */

/**
 * @param {ScaledSize} scaledSize
 * @returns {DimensionWidthType}
 */
const getWidthType = (scaledSize) => {
    if (scaledSize.width < 768) return DimensionWidthType.portrait
    return DimensionWidthType.landscape
}

/**
 * @returns {WindowDimensionsState}
 */
const initContextValue = () => {
    const scaledSize = Dimensions.get('window')
    return {
        ...scaledSize,
        widthType: getWidthType(scaledSize),
    }
}

/** @type {import('react').Context<WindowDimensionsState>} */
export const WindowDimensionsContext = React.createContext(initContextValue())

export const WindowDimensionsContextProvider = ({children}) => {
    const scaledSize = useWindowDimensions()
    const contextState = React.useMemo(
        () => ({
            ...scaledSize,
            widthType: getWidthType(scaledSize),
        }),
        [scaledSize],
    )

    return (
        <WindowDimensionsContext.Provider value={contextState}>
            {children}
        </WindowDimensionsContext.Provider>
    )
}
