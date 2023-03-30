import { NativeModules, Platform } from 'react-native';
import RNFS, { DownloadResult } from 'react-native-fs';

const LINKING_ERROR =
  `The package 'mosip-inji-face-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const MosipInjiFaceSdk = NativeModules.MosipInjiFaceSdk ? NativeModules.MosipInjiFaceSdk : new Proxy(
  {},
  {
    get() {
      throw new Error(LINKING_ERROR);
    },
  }
);

export function faceAuth(capturedImage: string, vcImage: string): Promise<boolean> {
  return MosipInjiFaceSdk.faceAuth(capturedImage, vcImage);
}

export async function init(url: string, overrideCache: boolean): Promise<boolean> {
  try {
    console.log('inside inji face sdk init function, url is - ' + url)
    const modelFilePath = `${RNFS.CachesDirectoryPath}/model.tflite`;
    const checksumCachePath = `${RNFS.CachesDirectoryPath}/model.sha256`;

    var fileExists = await RNFS.exists(modelFilePath);

    // checking if file is alredy present and downloaded properly
    fileExists = await doesModelExist(fileExists, overrideCache, modelFilePath, checksumCachePath);

    if (!fileExists || overrideCache) {
      let checksumDownloadResult: DownloadResult = await downloadFile(url + '/model.sha256', checksumCachePath)
      console.log('Checksum file download status code = ' + checksumDownloadResult.statusCode)

      let downloadRes: DownloadResult = await downloadFile(url + '/model.tflite', modelFilePath)
      console.log('Model File download size = ' + downloadRes.bytesWritten)

      var checksum = await RNFS.readFile(checksumCachePath);  
      checksum = checksum.replace(/\s/g, "");
      var actualModelChecksum = await RNFS.hash(modelFilePath, 'sha256');
      console.log('checksum calculated from file = ' + actualModelChecksum)
      console.log('checksum received from server = ' + checksum.replace(/\s/g, ""))
      if (actualModelChecksum === checksum) {
        return Promise.resolve(true)
      }
    } else if (fileExists) {
      return Promise.resolve(true)
    }
  } catch (e) {
    console.error('Error occured downloading model from - ' + url);
    console.error(e);
  }
  return Promise.resolve(false);
}

async function doesModelExist(fileExists:boolean, overrideCache:boolean, fileDir:string, checksumCachePath:string): Promise<boolean> {
  if (fileExists && !overrideCache) {
    try {
      // compare checksum to verify if file downloaded successfully
      var checksum:string = await RNFS.readFile(checksumCachePath);
      checksum = checksum.replace(/\s/g, "");
      var fileData:string = await RNFS.hash(fileDir, 'sha256');
      console.log('file exists......so comparing checksum')
      if (checksum !== fileData) {
        fileExists = false;
      } else {
        fileExists = true;
      }
    } catch (e) {
      console.error(e)
      fileExists = false
    }
  }
  return fileExists
}

async function downloadFile(url:string, toFile:string): Promise<RNFS.DownloadResult> {
  let downloadRes: DownloadResult = await RNFS.downloadFile({
    fromUrl: url,
    toFile: toFile,
  }).promise;
  return downloadRes;
}
