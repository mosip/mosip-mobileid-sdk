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
    const modelDirPath = `${RNFS.CachesDirectoryPath}/model.tflite`;
    const checksumCachePath = `${RNFS.CachesDirectoryPath}/model_sha256sum.txt`;

    var fileExists = await RNFS.exists(modelDirPath);

    // checking if file is alredy present and downloaded properly
    fileExists = await doesFileExists(fileExists, overrideCache, modelDirPath, checksumCachePath);

    if (!fileExists || overrideCache) {
      let txtDownloadRes: DownloadResult = await downloadFile(url + '/model_sha256sum.txt', checksumCachePath)
      console.log('Checksum file download status code = ' + txtDownloadRes.statusCode)

      let downloadRes: DownloadResult = await downloadFile(url + '/model.tflite', modelDirPath)
      console.log('Model File download size = ' + downloadRes.bytesWritten)

      var checksum = await RNFS.readFile(checksumCachePath);  
      checksum = checksum.replace(/\s/g, "");
      var fileData = await RNFS.hash(modelDirPath, 'sha256');
      console.log('checksum calculated from file = ' + fileData)
      console.log('checksum received from server = ' + checksum.replace(/\s/g, ""))
      if (fileData === checksum) {
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

async function doesFileExists(fileExists:boolean, overrideCache:boolean, fileDir:string, checksumCachePath:string): Promise<boolean> {
  if (fileExists && !overrideCache) {
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
