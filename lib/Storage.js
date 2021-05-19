import AsyncStorage from '@react-native-community/async-storage'

const keyPrefix = '@dropthought/dt-sdk/'
const cacheKeyPrefix = `${keyPrefix}cache/`

/**
 * given 'program-report/pid/@favorite-filters' -> '@com.abc.com/program-report/pid/@favorite-filters'
 * @param {string} key
 * @returns {string}
 */
export const storageKey = (key) => {
    return `${keyPrefix}${key}`
}

/**
 * given 'program-report/pid/@favorite-filters' -> '@com.abc.com/cache/program-report/pid/@favorite-filters'
 * purpose: we can clear the cache by checking the prefix
 * @param {string} key
 * @returns {string}
 */
export const cacheKey = (key) => {
    return `${cacheKeyPrefix}${key}`
}

/**
 * @description only clear data that starts with '@bundle-id'
 */
export async function clear() {
    const keys = await AsyncStorage.getAllKeys()
    const keysWithPrefix = keys.filter((key) => key.startsWith(keyPrefix))

    await AsyncStorage.multiRemove(keysWithPrefix)
}

/**
 * @description only clear data that starts with '@bundle-id/cache/'
 */
export async function clearCache() {
    const keys = await AsyncStorage.getAllKeys()
    const keysWithPrefix = keys.filter((key) => key.startsWith(cacheKeyPrefix))

    await AsyncStorage.multiRemove(keysWithPrefix)
}

/**
 * @template T
 * @param {string} key
 * @param {T=} initValue
 * @returns {Promise<T>}
 */
const load = async (key, initValue = undefined) => {
    let result = initValue
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            result = JSON.parse(value)
        }
    } catch (e) {}
    return result
}

/**
 * @template T
 * @param {string} key
 * @param {T} data
 */
const save = async (key, data) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
        console.log('failed at save to storage', key, data)
    }
    return data
}

/**
 * @template T
 * @param {string} key
 * @param {T=} initValue
 * @returns {Promise<T>}
 */
export const loadData = async (key, initValue = undefined) => {
    return load(storageKey(key), initValue)
}

/**
 * @template T
 * @param {string} key
 * @param {T} data
 */
export const saveData = async (key, data) => {
    return save(storageKey(key), data)
}

/**
 * @param {string} key
 */
export const removeData = async (key) => {
    return AsyncStorage.removeItem(storageKey(key))
}

/**
 * @template T
 * @param {string} key
 * @param {T=} initValue
 * @returns {Promise<T>}
 */
export const loadCache = async (key, initValue = undefined) => {
    return load(cacheKey(key), initValue)
}

/**
 * @template T
 * @param {string} key
 * @param {T} data
 */
export const saveCache = async (key, data) => {
    return save(cacheKey(key), data)
}
