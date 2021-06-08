import {isEmpty} from 'ramda'
import uuidv4 from 'uuid/v4'

import {apiPostEvent} from './API'

import QueueStorage from './QueueStorage'

const KEY_FEEDBACKS = 'KEY_FEEDBACKS'
const KEY_FAILED_FEEDBACKS_DURING_PROCESSING =
    'KEY_FAILED_FEEDBACKS_DURING_PROCESSING'
const KEY_FAILED_REASONS_DURING_PROCESSING =
    'KEY_FAILED_REASONS_DURING_PROCESSING'

/** @type {QueueStorage<SurveyFeedback>} */
export const FeedbacksQueue = new QueueStorage({
    key: KEY_FEEDBACKS,
    encrypted: true,
})
/** @type {QueueStorage<SurveyFeedback>} */
export const FailedFeedbacksQueue = new QueueStorage({
    key: KEY_FAILED_FEEDBACKS_DURING_PROCESSING,
    encrypted: true,
})
/** @type {QueueStorage<FailedReason>} */
export const FailedReasonsQueue = new QueueStorage({
    key: KEY_FAILED_REASONS_DURING_PROCESSING,
    encrypted: true,
})

/**
 * @param {SurveyFeedback} surveyFeedback
 * @param {*} cancelSource
 */
async function sendFeedback(surveyFeedback) {
    return apiPostEvent({
        programId: surveyFeedback.surveyId,
        feedbacks: surveyFeedback.feedbacks,
        metadata: surveyFeedback.metadata,
    })
}

/** @enum {'idle' | 'processing' } */
export const UploaderStates = {
    Idle: 'idle',
    Processing: 'processing',
}

/**
 * @typedef {Object} FeedbackUploaderSubscription
 * @property {string} id
 * @property {FeedbackUploaderSubscriber} subscriber
 */
/**
 * @typedef {Object} FeedbackUploaderPublishState
 * @property {UploaderStates} uploadStatus
 * @property {number} numOfFeedbacksProcessed
 * @property {SurveyFeedback[]} queuedFeedbacks
 * @property {SurveyFeedback[]} failedFeedbacksDuringProcessing
 * @property {FailedReason[]} failedReasons
 * @property {boolean} userCanceled
 */
/**
 * @typedef {(state: FeedbackUploaderPublishState) => void} FeedbackUploaderSubscriber
 */

/**
 * @param {() => boolean} check
 * @returns
 */
const waitUntil = async (check) => {
    let round = 0
    return new Promise((resolve) => {
        const timeout = () => {
            round++
            setTimeout(() => {
                if (check() || round >= 10) {
                    resolve()
                    return
                } else {
                    timeout()
                }
            }, 500)
        }
        timeout()
    })
}

function CreateFeedbacksUploader() {
    /** @type {boolean | null | undefined} */
    let initialized = null // null -> not start yet, undefined -> in progress, true -> finished
    let state = UploaderStates.Idle
    let numOfProcessed = 0
    let userCanceled = false

    /** @type {FeedbackUploaderSubscription[]} */
    let subscriptions = []

    function publish() {
        if (isEmpty(subscriptions)) return

        const [
            queuedFeedbacks,
            failedFeedbacksDuringProcessing,
            failedReasons,
        ] = [
            FeedbacksQueue.getAll(),
            FailedFeedbacksQueue.getAll(),
            FailedReasonsQueue.getAll(),
        ]

        subscriptions.forEach((subscription) => {
            if (
                subscription.subscriber &&
                typeof subscription.subscriber === 'function'
            ) {
                subscription.subscriber({
                    uploadStatus: state,
                    numOfFeedbacksProcessed: numOfProcessed,
                    queuedFeedbacks,
                    failedFeedbacksDuringProcessing,
                    failedReasons,
                    userCanceled,
                })
            }
        })
    }

    async function uploadSingle() {
        // if user cancel, stop process the next feedback
        if (userCanceled) {
            return
        }

        const feedback = FeedbacksQueue.front()

        // no more feedback in the queue, stop
        if (!feedback) return

        try {
            await sendFeedback(feedback)
            numOfProcessed++
        } catch (err) {
            console.log(
                'failed when sending feedback',
                feedback.surveyId,
                err.message,
            )
            // failed, add to failed queue
            FailedFeedbacksQueue.enqueue(feedback)
            FailedReasonsQueue.enqueue({
                message: err.message,
                status: err.response?.status,
            })
        } finally {
            FeedbacksQueue.dequeue()

            publish()
            await uploadSingle()
        }
    }

    function uploadDone() {
        state = UploaderStates.Idle
        publish()
    }

    function retryFailed() {
        // get failed feedbacks and save to processing queue
        // clear failed feedback queue
        const failedFeedbacks = FailedFeedbacksQueue.getAll()
        FeedbacksQueue.enqueue(failedFeedbacks)
        FailedFeedbacksQueue.clear()
        FailedReasonsQueue.clear()
    }

    function uploadStart() {
        // reset states
        state = UploaderStates.Processing
        numOfProcessed = 0
        userCanceled = false

        retryFailed()
        publish()
    }

    function uploadContinue() {
        retryFailed()
        publish()
    }

    /**
     * @public
     */
    function cancel() {
        userCanceled = true
        publish()
    }

    /**
     * @public
     */
    async function clear() {
        cancel()
        await Promise.all([
            FeedbacksQueue.clear(),
            FailedFeedbacksQueue.clear(),
            FailedReasonsQueue.clear(),
        ])
    }

    /**
     * @public
     */
    async function initialize() {
        // only initialize once
        if (initialized === true) return
        if (typeof initialized === 'undefined') {
            return waitUntil(() => initialized === true)
        }
        initialized = undefined

        // check queues are initialized
        await Promise.all([
            FeedbacksQueue.initialize(),
            FailedFeedbacksQueue.initialize(),
            FailedReasonsQueue.initialize(),
        ])
        initialized = true
    }

    /**
     * @public
     */
    async function upload() {
        if (initialized !== true) return

        if (state === UploaderStates.Processing) {
            // upload is in process
            uploadContinue()
            return
        }

        uploadStart()

        // upload feedback one by one
        await uploadSingle()

        // all the feedbacks are processed
        uploadDone()
    }

    /**
     * @public
     * @param {FeedbackUploaderSubscriber} subscriber
     */
    function subscribe(subscriber) {
        const id = uuidv4()
        const subscription = {
            id,
            subscriber,
        }
        subscriptions.push(subscription)
        publish()
        return function removeSubscription() {
            subscriptions = subscriptions.filter((sub) => sub.id !== id)
        }
    }

    return {
        upload,
        subscribe,
        cancel,
        clear,
        initialize,
    }
}

/**
 * @description singleton uploader
 * @example
 *     // to upload
 *     feedbackUploader.upload()
 *
 *     // to cancel
 *     feedbackUploader.cancel()
 *
 *     // to clear all the saved unsent feedbacks
 *     feedbackUploader.clear()
 *
 *     // to subscribe state
 *     const unSubscribe = feedbackUploader.subscribe( state => {
 *         console.log(state)
 *         // check type FeedbackUploaderPublishState
 *     })
 *     // to unsubscribe
 *     unSubscribe()
 */
export const feedbackUploader = CreateFeedbacksUploader()

/**@typedef {import('@dropthought/dropthought-data').Feedback} Feedback */
/**@typedef {import('@dropthought/dropthought-data/data').SurveyFeedback} SurveyFeedback */

/**
 * @typedef {Object} FailedReason
 * @property {string} message
 * @property {number|undefined} status
 */
