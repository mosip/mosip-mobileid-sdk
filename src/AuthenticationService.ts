import type { CameraCapturedPicture } from "expo-camera";
import FaceAuthModule from "./FaceAuthModule";

export default function authenticateFace(
  capturedImage: CameraCapturedPicture | null,
  vcImage: string
): boolean {
  console.log(capturedImage);
  console.log(vcImage);
  const result: boolean = FaceAuthModule.performMatch(capturedImage ? capturedImage.uri : "", vcImage);
  return result;
}
