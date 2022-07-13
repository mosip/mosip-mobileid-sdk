## Mosip Mobileid sdk
- This is a react native component library created to perform authentication in inji app.  
- The library uses FaceAuthProps which takes data as input and provides onValidationSuccess() function which can be called after validation is successful.  
- It opens camera and captures face image. It compares face image with the input data and on successful match it triggers onValidationSuccess() function.
- To find match it uses AuthenticationService.ts file. (The matching function is mocked right now) 
```
export interface FaceAuthProps {
  data:string;
  onValidationSuccess: () => void;
};
```
- Refer to the example folder to check usage of the library.

## USAGE
- Using npm -
```
npm install mosip-mobileid-sdk
```
- Using yarn -
```
yarn add mosip-mobileid-sdk
```

### Latest stable version
```
"1.0.7"
```
