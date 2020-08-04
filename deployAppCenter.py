import json
import requests

def deploy(ownerName, appName, apiToken, apkName):
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Token': apiToken
    }

    resp = requests.post(f'https://api.appcenter.ms/v0.1/apps/{ownerName}/{appName}/release_uploads', headers=headers)
    releaseUploads = resp.json()
    print('1. Get upload URL: ', releaseUploads)
    uploadUrl = releaseUploads['upload_url']
    uploadId = releaseUploads['upload_id']

    files = { 'ipa': open(apkName, 'rb') }
    resp = requests.post(uploadUrl, files=files)
    print('2. Upload apk: ', resp.status_code)

    data = {
        'status': 'committed'
    }
    resp = requests.patch(f'https://api.appcenter.ms/v0.1/apps/{ownerName}/{appName}/release_uploads/{uploadId}', json=data, headers=headers)
    releaseUploads = resp.json()
    print('3. Get release ID: ', releaseUploads)
    releaseId = releaseUploads['release_id']

    data={
        "destination_name": "Collaborators",
        "release_notes": "N/A"
    }
    resp = requests.patch(f'https://api.appcenter.ms/v0.1/apps/{ownerName}/{appName}/releases/{releaseId}', json=data, headers=headers)
    print('4. Distribute the release: ', resp.json())

owner = 'taipei-bct'
token = 'cd48a9b210997edbc736ea8041dfeca5c7904440'

deploy(owner, 'Dropthought-SDK-Demo-android', token, 'androidDemo/app/build/outputs/apk/release/app-release.apk')