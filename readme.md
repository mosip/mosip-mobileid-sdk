## Mosip inji face sdk
- This is a react native component library created to perform face match in inji app.  
- The library takes 2 images as base64 encoded string and returns boolean match or no match 
- This library supports only *ANDROID* currently. *IOS* is not supported.
```
export function faceAuth(capturedImage: string, vcImage: string): Promise<boolean | string> {
  return IoMosipInjiFaceSdk.faceAuth(capturedImage, vcImage);
}
```

## INstallation
- Using npm -
```
npm install mosip-inji-face-sdk
```
- Using yarn -
```
yarn add mosip-inji-face-sdk
```

## Usage

```js
import { faceAuth } from "mosip-inji-face-sdk";

## refer to /example/src/Auth.tsx for usage.
```


### Latest stable version
```
"0.1.1"
```

### API SPEC
The sdk will be used by INJI app for biometric authentication. An SDK system that integrates with MOSIP should support the following operations. 
* [Face Matching](#FaceMatching)

### Parameters
Name | Description | Type
-----|-------------|--------------
capturedImage | The image that is captured by the camera | base64 encoded string
vcImage | The face image received in VC | base64 encoded string

### Standard Return Codes(match or no match)
response | Status
-----|---------
true | Matched
false | Not Matched
error message | Error
