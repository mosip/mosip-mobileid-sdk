import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { FaceAuth } from 'mosip-mobileid-sdk';

export default function App() {
  return (
    <View style={styles.container}>
      <FaceAuth data={'data'} onValidationSuccess={function (): void {
        console.log('successs');
      } }></FaceAuth>
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
});
