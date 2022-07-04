import { VC } from './vc';

export function authenticateReceiverFace(photo: string): boolean {
    return true;
  }
  
  export function authenticateSenderFace(photo: string): boolean {
    return true;
  }
  
  export default { authenticateReceiverFace, authenticateSenderFace };