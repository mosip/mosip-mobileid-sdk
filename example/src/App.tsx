import {faceAuth, init} from 'mosip-mobileid-sdk';
import * as React from 'react';

import { Alert, Button, Image, Platform, StyleSheet, View } from 'react-native';
import RNFS from 'react-native-fs';
import {useEffect} from "react";

export default function App() {
  const [image1, setImage1] = React.useState<{ path: string; data: string }>();
  const [image2, setImage2] = React.useState<{ path: string; data: string }>();

  // load async
  useEffect( ()  => {
    init()
      .catch(e => console.log(`Error: ${e}`))
      .then(res => {
        console.log(`========> sdk ready to use?: ${res}`);
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
      return { path: '', data: '' };
    }
  };
  const loadRandomImages = async () => {
    const image1Dat = await loadImage(Math.floor(Math.random() * 6) + 1);
    const image2Dat = await loadImage(Math.floor(Math.random() * 6) + 1);
    setImage1(image1Dat);
    setImage2(image2Dat);
  };

  const compareImages = async () => {
    if (image1 === undefined || image2 === undefined) {
      return;
    }
    const result = await faceAuth(image1.data, image2.data);
    let matchResult: string;
    if (result) {
      matchResult = 'Images matched';
    } else {
      matchResult = 'Images not matched';
    }
    Alert.alert('Compare result', matchResult);
  };

  return (
    <View style={styles.container}>
      <Button title={'Load images'} onPress={loadRandomImages} />
      <Image style={styles.img1} source={{ uri: image1?.path }} />
      <Image style={styles.img2} source={{ uri: image2?.path }} />
      <Button title={'Compare'} onPress={compareImages} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  img1: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    width: 320,
    height: 240,
    margin: 5,
  },
  img2: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    width: 320,
    height: 240,
    margin: 5,
  },
});
