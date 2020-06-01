export * from './Question'
export * from './SkipLogic'
export * from './api'

import {apiInitialize} from './api/APIClient'

/**
 * @param {string} apiKey
 */
export function initializeWithAPIKey(apiKey) {
    apiInitialize({
        apiKey,
    })
}
