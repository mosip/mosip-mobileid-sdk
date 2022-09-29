import FaceAuthModule from "./FaceAuthModule";
export default function authenticateFace(capturedImage, vcImage) {
  console.log(capturedImage);
  console.log(vcImage);
  const result = FaceAuthModule.performMatch(capturedImage ? capturedImage.uri : "", vcImage);
  return result;
}
//# sourceMappingURL=AuthenticationService.js.map