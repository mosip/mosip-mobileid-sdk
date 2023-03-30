import { faceAuth, init } from 'mosip-inji-face-sdk';
import * as React from 'react';
import RNFS from 'react-native-fs';




import { StyleSheet, View, Text, PermissionsAndroid, Button } from 'react-native';

const requestStoragePermission = async () => {
  console.log('inside requestStoragePermission');
  try {
    const granted = await PermissionsAndroid.request('android.permission.READ_EXTERNAL_STORAGE'
      ,
      {
        title: "Needs permission of storage",
        message:
          "Needs permission of storage to validate photos",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the storage");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};



export default function App() {
  let capturedImage: string = '';
  let vcImage: string = '';

  console.log(RNFS.DownloadDirectoryPath);

  // change the first image location here
  RNFS.readFile('/storage/emulated/0/Download/jana1.jpg', "base64").then(data => {
    capturedImage = data;
    // console.log('captured image loaded' + capturedImage)
  });
  // change the second image location here
  RNFS.readFile('/storage/emulated/0/Download/Janardhan_004.jpg', "base64").then(data => {
    vcImage = data;
    // console.log('vc image loaded' + vcImage)
  });
  // vcImage = vcImage.split(',')[1]?.toString;
  const [result, setResult] = React.useState<boolean | string>(false);
  console.log(result);

  const performAuth = async () => {
    var initRes = await downloadModel();
    console.log('init result is = ' + initRes)
    const date = new Date();
    console.log('perform auth is called, waiting for result');
    console.log('=====> start time : ' + date);

    await faceAuth(capturedImage, vcImage)
      .then(setResult).catch(setResult);
    await faceAuth(capturedImage, vcImage)
      .then(setResult);

    console.log('after calling faceauth result is = ' + result);
    const finalDate = new Date();
    var time = finalDate.getTime() - date.getTime();
    console.log('=====> end time : ' + finalDate);
    console.log('difference : ' + time / 1000);
  }

  // React.useEffect(() => {
  //   faceAuth('/sdcard/Download/Janardhan_004.jpg', '/sdcard/Download/Janardhan_005.jpg')
  //   .then(setResult);
  //   console.log('after calling faceauth '+result);
  // }, []);

  return (
    <View style={styles.container}>
      <Button title="Request storage permissions" onPress={requestStoragePermission} />
      <Button title="Perform Auth" onPress={performAuth} />
      {(result === true) ? (<Text style={{ color: 'green', fontSize: 40 }}>Result is true</Text>) : (<Text style={{ color: 'red', fontSize: 40 }}>Result is false</Text>)}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    flex: 5,
    marginVertical: 20,
  },
});

async function downloadModel(): Promise<boolean> {
  var result:boolean = false;
  try {
    const maxRetry = 10;
    const resp: string = 'https://api.dev.mosip.net/inji'
    if (resp != null) {
      result = await init(resp, false);
      console.log('model download result is = ' + result)
      if (!result) {
        for (let counter = 0; counter < maxRetry; counter++) {
          console.log('trying for - ' + counter)
          result = await init(resp, false);
          console.log('model redownload result is = ' + result)
          if (result) {
            break;
          }
        }
      }
      return Promise.resolve(result);
    }
  } catch (error) {
    console.log(error);
  }
  return Promise.resolve(result)
}
