"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authenticateFace;

var _FaceAuthModule = _interopRequireDefault(require("./FaceAuthModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function authenticateFace(capturedImage, vcImage) {
  console.log(capturedImage);
  console.log(vcImage);

  const result = _FaceAuthModule.default.performMatch(capturedImage ? capturedImage.uri : "", vcImage);

  return result;
}
//# sourceMappingURL=AuthenticationService.js.map