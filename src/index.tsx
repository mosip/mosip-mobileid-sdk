import { NativeModules, Platform } from 'react-native';
import RNFS from 'react-native-fs';

const LINKING_ERROR =
  `The package 'mosip-inji-face-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const MosipInjiFaceSdk = NativeModules.MosipInjiFaceSdk  ? NativeModules.MosipInjiFaceSdk  : new Proxy(
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

export async function init(url: string, overrideCache: boolean) {
  const fileDir = `${RNFS.CachesDirectoryPath}/model.tflite`;
  const fileExists = RNFS.exists(fileDir);
  if (!fileExists || overrideCache) {
    console.log('inside init')
    await RNFS.downloadFile({
      fromUrl: url,
      toFile: fileDir,
    }).promise.then(() => console.log('Model loaded from url : ' + url));
    console.log('download completed.......................')
  }
}
