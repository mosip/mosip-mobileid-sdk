import React from 'react';
import { CameraCapturedPicture, CameraType } from 'expo-camera';
export interface FaceAuthProps {
    data: string;
    onValidationSuccess: () => void;
}
declare type State = {
    authentication: boolean;
    previewVisible: boolean;
    capturedImage: CameraCapturedPicture | null;
    cameraType: CameraType;
};
export default class FaceAuth extends React.Component<FaceAuthProps, State> {
    constructor(props: FaceAuthProps);
    __retakePicture: () => void;
    __switchCamera: () => void;
    authenticatePhoto: () => Promise<void>;
    CameraPreview: ({ photo, retakePicture }: any) => JSX.Element;
    render(): JSX.Element;
}
export {};
