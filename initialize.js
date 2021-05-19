import {sdkFetcher} from './lib/API'
import {initialize} from './lib/encrypted-storage'

/**
 * @param {InitializeParams} param0
 */
export async function initializeWithAPIKey({apiKey, baseURL} = {}) {
    sdkFetcher.init({
        baseURL,
        apiKey,
    })
    await initialize(apiKey)
}
