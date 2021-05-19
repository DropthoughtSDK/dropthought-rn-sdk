/**
 * @description simple queue operation, and sync to async storage with designated key
 */
import {saveData, loadData, removeData} from './Storage'
import encryptedStorage from './encrypted-storage'
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
    constructor({key, encrypted = false}) {
        /** @type {string} */
        this.storageKey = key
        /** @type {T[]} */
        this.queue = []

        /** @type {boolean} */
        this.initialized = false

        /** @type {boolean} */
        this.encrypted = encrypted
    }

    /**
     * @private
     * @template T
     * @param {string} key
     * @param {T} data
     */
    async saveData(key, data) {
        if (this.encrypted) {
            return encryptedStorage.setItemT(key, data)
        } else {
            return saveData(key, data)
        }
    }

    /**
     * @private
     * @template T
     * @param {string} key
     * @param {T} defaultValue
     */
    async loadData(key, defaultValue) {
        if (this.encrypted) {
            return encryptedStorage.getItemT(key, defaultValue)
        } else {
            return loadData(key, defaultValue)
        }
    }

    /**
     * @private
     */
    async syncToStorage() {
        if (!this.initialized) return
        return this.saveData(this.storageKey, this.queue)
    }

    /**
     * @private
     */
    async migration() {
        const queuedElements = await loadData(this.storageKey)
        if (!queuedElements || !queuedElements.length) {
            // console.log('### no data in', this.storageKey)
            return
        }
        await encryptedStorage.setItemT(this.storageKey, queuedElements)
        await removeData(this.storageKey)
    }

    /**
     * @public
     */
    async initialize() {
        await this.migration()

        const queuedElements = await this.loadData(this.storageKey, [])
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
