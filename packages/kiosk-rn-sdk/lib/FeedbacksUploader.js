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
export const FeedbacksQueue = new QueueStorage({key: KEY_FEEDBACKS})
/** @type {QueueStorage<SurveyFeedback>} */
export const FailedFeedbacksQueue = new QueueStorage({
    key: KEY_FAILED_FEEDBACKS_DURING_PROCESSING,
})
/** @type {QueueStorage<FailedReason>} */
export const FailedReasonsQueue = new QueueStorage({
    key: KEY_FAILED_REASONS_DURING_PROCESSING,
})

/**
 * @param {SurveyFeedback} surveyFeedback
 * @param {*} cancelSource
 */
async function sendFeedback(surveyFeedback) {
    return apiPostEvent({
        programId: surveyFeedback.surveyId,
        feedbacks: surveyFeedback.feedbacks,
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

function CreateFeedbacksUploader() {
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
            numOfProcessed++

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
    async function upload() {
        // check queues are initialized
        if (!FeedbacksQueue.initialized) await FeedbacksQueue.initialize()
        if (!FailedFeedbacksQueue.initialized)
            await FailedFeedbacksQueue.initialize()
        if (!FailedReasonsQueue.initialized)
            await FailedReasonsQueue.initialize()

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
/**@typedef {import('@dropthought/dropthought-data').SurveyFeedback} SurveyFeedback */

/**
 * @typedef {Object} FailedReason
 * @property {string} message
 * @property {number|undefined} status
 */
