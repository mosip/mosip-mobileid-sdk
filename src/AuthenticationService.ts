import type { CameraCapturedPicture } from "expo-camera/build/Camera.types";

export default function authenticateFace(
  capturedImage: CameraCapturedPicture | null,
  vcImage: string
): boolean {
  console.log(capturedImage);
  console.log(vcImage);
  return true;
}
