"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.faceAuth = faceAuth;
exports.init = init;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package 'mosip-inji-face-sdk' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const MosipInjiFaceSdk = _reactNative.NativeModules.MosipInjiFaceSdk ? _reactNative.NativeModules.MosipInjiFaceSdk : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
function faceAuth(capturedImage, vcImage) {
  return MosipInjiFaceSdk.faceAuth(capturedImage, vcImage);
}
async function init(url, overrideCache) {
  if (overrideCache) {
    console.log('inside init');
    await RNFS.downloadFile({
      fromUrl: url,
      toFile: `${RNFS.CachesDirectoryPath}/model.tflite`
    }).promise.then(r => console.log('Model loaded from url : ' + url));
    // RNFS.readDir(`${RNFS.CachesDirectoryPath}`).then(consold7e  7777777777777777777777777777     .log).catch(console.log);
  }
}
//# sourceMappingURL=index.js.map