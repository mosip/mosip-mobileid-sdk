import { NativeModules } from 'react-native';
const { FaceAuthModule } = NativeModules;

interface FaceAuthInterface {
  performMatch: (capturedImageUri: string, vcImageUri: string) => boolean;
}

export default FaceAuthModule as FaceAuthInterface;