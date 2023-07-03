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

export async function init(): Promise<boolean> {
  const config = {
    withFace: {
      encoder: {
        faceNetModel: {
          path: "https://api.dev.mosip.net/inji/model.tflite",
          inputWidth: 160,
          inputHeight: 160,
          outputLength: 512,
          // optional
          modelChecksum: "797b4d99794965749635352d55da38d4748c28c659ee1502338badee4614ed06",
        },
      },
      matcher: {
        threshold: 1.0,
      },
    },
  };
  try {
    console.log(`init with: ${JSON.stringify(config)}`)
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
