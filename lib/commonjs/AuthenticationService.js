"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authenticateFace;

function authenticateFace(capturedImage, vcImage) {
  var _capturedImage$base;

  console.log('captured image = ' + (capturedImage === null || capturedImage === void 0 ? void 0 : (_capturedImage$base = capturedImage.base64) === null || _capturedImage$base === void 0 ? void 0 : _capturedImage$base.valueOf));
  console.log('received vc image = ' + vcImage);
  return false;
}
//# sourceMappingURL=AuthenticationService.js.map