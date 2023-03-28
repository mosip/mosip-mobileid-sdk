import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'mosip-mobileid-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const MosipMobileidSdk = NativeModules.MosipMobileidSdk
  ? NativeModules.MosipMobileidSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export async function init(url: string): Promise<boolean> {
  const config = {
    withFace: {
      encoder: {
        faceNetModel: {
          tfliteModelPath: url,
          tfliteModelChecksum: -1,
          inputWidth: 160,
          inputHeight: 160,
          outputLength: 128,
        },
      },
      matcher: {
        threshold: 10.0,
      },
    },
  };
  try {
    await MosipMobileidSdk.configure(config);
    return true;
  } catch (e) {
    console.error('init failed', e);
    return false;
  }
}
export async function faceAuth(capturedImage: string, vcImage: string): Promise<boolean> {
  try {
    const template1 = await MosipMobileidSdk.faceExtractAndEncode(capturedImage);
    const template2 = await MosipMobileidSdk.faceExtractAndEncode(vcImage);
    return await MosipMobileidSdk.faceCompare(template1, template2);
  } catch (e) {
    console.error('faceAuth auth failed', e);
    return false;
  }
}
