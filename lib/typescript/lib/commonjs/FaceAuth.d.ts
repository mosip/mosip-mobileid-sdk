export var __esModule: boolean;
export default FaceAuth;
declare const FaceAuth_base: any;
declare class FaceAuth extends FaceAuth_base {
    [x: string]: any;
    constructor(props: any);
    state: {
        authentication: boolean;
        previewVisible: boolean;
        capturedImage: any;
        cameraType: _expoCamera.CameraType;
    };
    render(): any;
}
import _expoCamera = require("expo-camera");
