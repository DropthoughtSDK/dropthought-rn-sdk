/**
 * @description simple queue operation, and sync to async storage with designated key
 */
import {saveData, loadData} from './Storage'
import {head, tail, append} from 'ramda'

/**
 * @example
 *     const basicTextQueue = new QueueStorage({ key: 'Storage-basic-text'})
 *     basicTextQueue.enqueue('a')  // queue: ['a']
 *     basicTextQueue.front() // => 'a'
 *     basicTextQueue.enqueue('b') // queue: ['a', 'b']
 *     basicTextQueue.enqueue(['c', 'd']) // queue: ['a', 'b', 'c', 'd']
 *     basicTextQueue.front() // => 'a'
 *
 *     basicTextQueue.dequeue()  // queue: ['b', 'c', 'd']
 *     basicTextQueue.front() // => 'b'
 * @template T
 */
export class QueueStorage {
    constructor({key}) {
        /** @type {string} */
        this.storageKey = key
        /** @type {T[]} */
        this.queue = []

        /** @type {boolean} */
        this.initialized = false

        this.initialize()
    }

    /**
     * @private
     */
    async syncToStorage() {
        if (!this.initialized) return
        return saveData(this.storageKey, this.queue)
    }

    /**
     * @private
     */
    async initialize() {
        const queuedElements = await loadData(this.storageKey, [])
        if (this.initialized) return

        this.queue = queuedElements.concat(this.queue)
        this.initialized = true
        await this.syncToStorage()
    }

    async clear() {
        this.queue = []
        await this.syncToStorage()
    }

    /**
     * @returns {T[]}
     */
    getAll() {
        return this.queue
    }

    /**
     * get the first element of the queue
     * @returns {T|undefined}
     */
    front() {
        return head(this.queue)
    }

    /**
     * adding element(s) to the back of the queue
     * @param {T|[T]} element
     */
    enqueue(element) {
        // if element is an array, use array concat, otherwise, use append
        if (Array.isArray(element)) {
            this.queue = this.queue.concat(element)
        } else {
            this.queue = append(element, this.queue)
        }
        this.syncToStorage()
    }

    /**
     * remove an element from the front of the queue
     * @returns {T|undefined}
     */
    dequeue() {
        const firstElement = head(this.queue)
        this.queue = tail(this.queue)
        this.syncToStorage()
        return firstElement
    }
}

export default QueueStorage
