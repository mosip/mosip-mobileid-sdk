## Mosip inji face sdk
- This is a react native component library created to perform face match in inji app.  
- The library takes 2 images as base64 encoded string and returns boolean match or no match 
- This library supports only *ANDROID* currently. *IOS* is not supported.


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

### 1. Init
Init function is used for loading the model. It accepts the secure url of the model, download it and saves it locally.

Signature 

```
export async function init(url: string, overrideCache: boolean) {
  // logic here
}
```

#### Parameters
Name | Description | Type
-----|-------------|--------------
url | Secure url of the model | Secure url
overrideCache | boolean indicator to override existing model | boolean

#### Standard Return Codes(match or no match)
response | Status
-----|---------
throws error | Error


### 2. Face Matching
The face matching is used to match 2 faces. It returns boolean true or false in case of match or no match.

Signature 

```
export function faceAuth(
      capturedImage: string,
      vcImage: string
    ): Promise<boolean> {
  // logic here
}
```

#### Parameters
Name | Description | Type
-----|-------------|--------------
capturedImage | The image that is captured by the camera | base64 encoded string
vcImage | The face image received in VC | base64 encoded string

#### Standard Return Codes(match or no match)
response | Status
-----|---------
true | Matched
false | Not Matched
error message | Error

