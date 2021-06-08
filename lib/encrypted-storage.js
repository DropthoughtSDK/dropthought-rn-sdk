import AsyncStorage from '@react-native-community/async-storage'
import {EncryptedStorage} from '@bct-taipei/dt-rn-encrypted-storage'

const SDK_ACCOUNT = 'DT_ENC_V1'
const encryptedStorageClient = new EncryptedStorage(AsyncStorage)

export async function initialize(apiKey) {
    return encryptedStorageClient.setAccount(SDK_ACCOUNT, apiKey)
}

export default encryptedStorageClient
