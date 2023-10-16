import {faceAuth, faceScore, init} from 'mosip-mobileid-sdk';
import * as React from 'react';
import {useEffect, useRef} from 'react';
import {Camera, ImageType} from 'expo-camera';


import {Button, Image, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import RNFS from 'react-native-fs';

export default function App() {
  const [image1, setImage1] = React.useState<{ path: string; data: string }>();
  const [image2, setImage2] = React.useState<{ path: string; data: string }>();
  const [showCam1, setShowCam1] = React.useState<boolean>(false);
  const [showCam2, setShowCam2] = React.useState<boolean>(false);
  const [permissionsGranted, setPermissionsGranted] = React.useState<boolean>(false);
  const [type, setType] = React.useState(Camera.Constants.Type.front);
  const camera1 = useRef<Camera>();
  const camera2 = useRef<Camera>();
  const [result, setResult] = React.useState<string>('')
  const [score, setScore] = React.useState<string>('')
  // load async
  useEffect(() => {
    init("https://github.com/biometric-technologies/tensorflow-facenet-model-test/raw/master/model.tflite")
      .catch(e => console.log(`Error: ${e}`))
      .then(res => {
        console.log(`========> sdk ready to use?: ${res}`);
      });
    Camera.requestCameraPermissionsAsync()
      .catch(e => console.log(`Camera Error: ${e}`))
      .then((status) => {
        console.log(JSON.stringify(status));
        const granted = status?.status === 'granted';
        setPermissionsGranted(granted);
      });
  }, []);

  const loadImage = async (
    index: number
  ): Promise<{ path: string; data: string }> => {
    if (Platform.OS === 'ios') {
      const path = `${RNFS.MainBundlePath}/assets/images/img${index}.jpg`;
      return {
        path: path,
        data: await RNFS.readFile(path, 'base64'),
      };
    } else if (Platform.OS === 'android') {
      const path = `images/img${index}.jpg`;
      return {
        path: `asset:/${path}`,
        data: await RNFS.readFileAssets(path, 'base64'),
      };
    } else {
      return {path: '', data: ''};
    }
  };
  const loadRandom1 = async () => {
    setShowCam1(false)
    const image1Dat = await loadImage(Math.floor(Math.random() * 6) + 1);
    setImage1(image1Dat);
  };

  const loadRandom2 = async () => {
    setShowCam2(false)
    const image2Dat = await loadImage(Math.floor(Math.random() * 6) + 1);
    setImage2(image2Dat);
  };

  const compareImages = async () => {
    if (image1 === undefined || image2 === undefined) {
      return;
    }
    setResult('Calculating ... Please wait')
    setScore('Score: -')
    const score = await faceScore(image1.data, image2.data);
    const result = await faceAuth(image1.data, image2.data);
    let matchResult: string;
    if (result) {
      matchResult = 'Images matched';
    } else {
      matchResult = 'Images not matched';
    }
    setResult(`Score: ${matchResult}`)
    setScore(score.toString(4))
  };

  const takeImg1 = async () => {
    const data = await camera1.current?.takePictureAsync({base64: true, imageType: ImageType.png, /*skipProcessing: true*/});
    if (data?.base64) {
      setImage1({
        data: data.base64,
        path: `data:image/png;base64,${data.base64}`
      });
      setShowCam1(false)
    }
  }
  const toggleType = async () => {
    if (type === Camera.Constants.Type.front) {
      setType(Camera.Constants.Type.back);
    } else {
      setType(Camera.Constants.Type.front);
    }
  }
  const takeImg2 = async () => {
    const data = await camera2.current?.takePictureAsync({base64: true, imageType: ImageType.png, /*skipProcessing: true*/});
    if (data?.base64) {
      setImage2({
        data: data.base64,
        path: `data:image/png;base64,${data.base64}`
      });
      setShowCam2(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Button title={'Toggle Camera Side'} onPress={toggleType}/>
      <View style={styles.vseparator}/>
      <Text style={styles.text}>Picture 1</Text>
      {(showCam1 && permissionsGranted) ?
        <Camera ref={camera1} type={type} style={styles.img1}>
        </Camera> :
        <Image style={styles.img1} source={{uri: image1?.path}}></Image>}
      <View style={styles.row}>
        <View style={styles.col}>
          <Button title="Enable camera" onPress={() => setShowCam1(true)}/>
          <Button title={'Take picture'} onPress={takeImg1}/>
        </View>
        <View style={styles.separator}/>
        <Button title="Load random" onPress={loadRandom1}/>
      </View>
      <Text style={styles.text}>Picture 2</Text>
      {(showCam2 && permissionsGranted) ?
        <Camera ref={camera2} type={type} style={styles.img2}>
        </Camera> :
        <Image style={styles.img2} source={{uri: image2?.path}}></Image>}
      <View style={styles.row}>
        <View style={styles.col}>
          <Button title="Enable camera" onPress={() => setShowCam2(true)}/>
          <Button title={'Take picture'} onPress={takeImg2}/>
        </View>
        <View style={styles.separator}/>
        <Button title="Load random" onPress={loadRandom2}/>
      </View>
      <View style={styles.vseparator}/>
      <Button title={'Compare'} onPress={compareImages}/>
      <Text style={styles.text}>{score}</Text>
      <Text style={styles.text}>{result}</Text>
      <View style={styles.vseparator}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#ffffff',
    alignSelf: 'center'
  },
  col: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    width: 10,
  },
  vseparator: {
    height: 25,
  },
  container: {
    backgroundColor: "black",
    marginStart: 10,
    marginEnd: 10,
    marginTop: 25,
    marginBottom: 25
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  img1: {
    justifyContent: 'center',
    alignSelf: 'center',
    aspectRatio: 1,
    width: 320,
    height: 240,
    margin: 5,
  },
  img2: {
    justifyContent: 'center',
    alignSelf: 'center',
    aspectRatio: 1,
    width: 320,
    height: 240,
    margin: 5,
  },
});
