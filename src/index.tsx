import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'mosip-inji-face-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const BiometricSdkReactNative = NativeModules.BiometricSdkReactNative
  ? NativeModules.BiometricSdkReactNative
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
    await BiometricSdkReactNative.configure(config);
    return true;
  } catch (e) {
    console.error('init failed', e);
    return false;
  }
  
}

function faceExtractAndEncode(image: string): Promise<string> {
  return BiometricSdkReactNative.faceExtractAndEncode(image);
}

export async function faceAuth(capturedImage: string, vcImage: string): Promise<boolean> {
  try {
    const template1 = await faceExtractAndEncode(capturedImage);
    const template2 = await faceExtractAndEncode(vcImage);
    return await BiometricSdkReactNative.faceCompare(template1, template2);
  } catch (e) {
    console.error('faceAuth auth failed', e);
    return false;
  }
}
