import {sdkFetcher} from './lib/API'
import {initialize} from './lib/encrypted-storage'
import {feedbackUploader} from './lib/FeedbacksUploader'

/**
 * @param {{apiKey: string, baseURL?: string}} param0
 */
export async function initializeWithAPIKey({apiKey, baseURL} = {}) {
    sdkFetcher.init({
        baseURL,
        apiKey,
    })
    await initialize(apiKey)
    await feedbackUploader.initialize()
}
