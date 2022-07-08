import {StatusBar} from 'expo-status-bar'
import React, { Props, useEffect, useState } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image, Route} from 'react-native'
import {Camera, CameraCapturedPicture, CameraType} from 'expo-camera'
import authenticateFace from "./AuthenticationService"
import * as FaceDetector from 'expo-face-detector';

export default function FaceAuth<T extends Route>(props: TakePhotoProps) {
    let camera: Camera;
  const [authentication, setAuthentication] = useState<boolean|null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture|null>(null)
  const [cameraType, setCameraType] = useState(CameraType.front)
  
  useEffect(() => {
    if (authentication) {
      props.onValidationSuccess();
    }
  }, [authentication]);

  useEffect(() => {
    if (previewVisible) {
        setCapturedImage(capturedImage);
        setPreviewVisible(true);
    }
  }, [previewVisible]);

  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
  }
  
  const __switchCamera = () => {
    setCameraType(cameraType === 'back' ? CameraType.front : CameraType.back)
  }

  const authenticatePhoto = async () => {
    const photo:CameraCapturedPicture = await camera.takePictureAsync()
    setCapturedImage(photo)
    setPreviewVisible(true)

    const result:boolean = authenticateFace(capturedImage, props.data);
    setAuthentication(result);

    console.log('result ----- ' + result);
  }

  const CameraPreview = ({photo, retakePicture}: any) => {
    return (
        
      <View style={{backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%'}}>
        <ImageBackground source={{uri: photo.uri}} style={{flex: 1}}>
          <View style={styles.imgBackground}>
            <View style={{flexDirection: 'column'}}>
              {authentication === true ? 
                    (<Text style={{borderRadius: 4, backgroundColor: '#fff',
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 40, color: 'green',fontSize: 20, alignContent: 'center'}}>Authentication Successful</Text>) : 
                    (<TouchableOpacity onPress={retakePicture} style={{borderRadius: 4, backgroundColor: '#14274e',
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 40}}>
                    <Text style={{ color: 'red', fontSize: 20}}>Authentication failed, Try again</Text>
                  </TouchableOpacity>)}
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1,width: '100%'}}>
          {previewVisible ? (
            <CameraPreview photo={capturedImage} retakePicture={__retakePicture} />
          ) : (
            <Camera type={cameraType} style={{flex: 1}} ref={(r:Camera) => { camera = r }}
            faceDetectorSettings={{mode: FaceDetector.FaceDetectorMode.fast, detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
              runClassifications: FaceDetector.FaceDetectorClassifications.all, minDetectionInterval: 100, tracking: true}}>
              <View style={{flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row'}}>
                <View style={{position: 'absolute', bottom: 30, flex: 1, right: '5%',  flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TouchableOpacity onPress={__switchCamera}>
                    <Text style={{backgroundColor: '#14274e',
                    alignItems: 'center',fontSize: 20,color: '#fff', fontWeight:'bold'}}>Switch Camera</Text>
                  </TouchableOpacity>
                </View>
                <View style={{position: 'absolute', bottom: 0,flexDirection: 'row',flex: 1,width: '100%',padding: 20,justifyContent: 'space-between'}}>
                  <View style={{alignSelf: 'center', flex: 1,alignItems: 'center'}}>
                    <TouchableOpacity onPress={authenticatePhoto} style={{width: 70,height: 70,bottom: 0,borderRadius: 50, backgroundColor: '#fff'}}/>
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      <StatusBar style="auto" />
    </View>
  )
}



export interface TakePhotoProps {
    data:string;
    onValidationSuccess: () => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgBackground: {
    flex: 1,flexDirection: 'column',padding: 15,justifyContent: 'flex-end'
  }
})