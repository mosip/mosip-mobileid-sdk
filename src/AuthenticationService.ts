import { CameraCapturedPicture } from "expo-camera";

export default function authenticateFace(capturedImage: CameraCapturedPicture|null, vcImage:string): boolean {
    console.log('captured image = ' + capturedImage?.base64?.valueOf);
    console.log('received vc image = ' + vcImage);
    return false;
}