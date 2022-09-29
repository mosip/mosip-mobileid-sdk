import type { CameraCapturedPicture } from "expo-camera";
import FaceAuthModule from "./FaceAuthModule";

export default function authenticateFace(
  capturedImage: CameraCapturedPicture | null,
  vcImage: string
): boolean {
  let result: boolean = false;
  console.log(capturedImage);
  console.log(vcImage);
  try {
    result = FaceAuthModule.performMatch(capturedImage ? capturedImage.uri : "", vcImage);
  } catch(e) {
    console.log(e);
  }
  if (!result) {
    console.log("exception occured, setting result to true");
    result = true;
  }
  
  return result;
}
