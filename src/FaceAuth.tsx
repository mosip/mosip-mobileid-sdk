import React, { Props, useEffect, useState } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image, Route} from 'react-native'
import {Camera, CameraCapturedPicture, CameraType} from 'expo-camera'
import authenticateFace from "./AuthenticationService"
import * as FaceDetector from 'expo-face-detector';

let camera:Camera;

export interface FaceAuthProps {
  data:string;
  onValidationSuccess: () => void;
};

type State = {
  authentication: boolean;
  previewVisible: boolean;
  capturedImage: CameraCapturedPicture|null;
  cameraType: CameraType;

};

export default class FaceAuth extends React.Component<FaceAuthProps, State> {


  constructor(props: FaceAuthProps) {
    super(props);

    if (props.data === null) {
      throw new Error('Please send VC face image');
    }

    this.state = {
      authentication: false,
      previewVisible: false,
      capturedImage: null,
      cameraType: CameraType.front
    };
  }

  __retakePicture = () => {
    this.setState({
      capturedImage: null,
      previewVisible: false
    });
    
  }
  
  __switchCamera = () => {
    this.setState({cameraType: (this.state.cameraType === 'back' ? CameraType.front : CameraType.back)});
  }

  authenticatePhoto = async () => {
    const photo:CameraCapturedPicture = await camera.takePictureAsync();
    this.setState({capturedImage: photo, previewVisible: true});

    const result:boolean = authenticateFace(this.state.capturedImage, this.props.data);
    this.setState({authentication: result});
    if (result) {
      this.props.onValidationSuccess();
    }
  }

  CameraPreview = ({photo, retakePicture}: any) => {
    return (
        
      <View style={{backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%'}}>
        <ImageBackground source={{uri: photo.uri}} style={{flex: 1}}>
          <View style={styles.imgBackground}>
            <View style={{flexDirection: 'column'}}>
              {this.state.authentication === true ? 
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

  render() {
    return (
      <View style={styles.container}>
      <View style={{flex: 1,width: '100%'}}>
          {this.state.previewVisible ? (
            <this.CameraPreview photo={this.state.capturedImage} retakePicture={this.__retakePicture} />
          ) : (
            <Camera type={this.state.cameraType} style={{flex: 1}} ref={(r:Camera) => { camera = r }}
            faceDetectorSettings={{mode: FaceDetector.FaceDetectorMode.fast, detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
              runClassifications: FaceDetector.FaceDetectorClassifications.all, minDetectionInterval: 100, tracking: true}}>
              <View style={{flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row'}}>
                <View style={{position: 'absolute', bottom: 30, flex: 1, right: '5%',  flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TouchableOpacity onPress={this.__switchCamera}>
                    <Text style={{backgroundColor: '#14274e',
                    alignItems: 'center',fontSize: 20,color: '#fff', fontWeight:'bold'}}>Switch Camera</Text>
                  </TouchableOpacity>
                </View>
                <View style={{position: 'absolute', bottom: 0,flexDirection: 'row',flex: 1,width: '100%',padding: 20,justifyContent: 'space-between'}}>
                  <View style={{alignSelf: 'center', flex: 1,alignItems: 'center'}}>
                    <TouchableOpacity onPress={this.authenticatePhoto} style={{width: 70,height: 70,bottom: 0,borderRadius: 50, backgroundColor: '#fff'}}/>
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
    </View>
    )
}
}

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

function render() {
    throw new Error('Function not implemented.');
}
