import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { Camera } from "expo-camera";
import authenticateFace from "./AuthenticationService";
let camera;
export const FaceAuth = props => {
  const [authentication, setAuthentication] = React.useState(null);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.front);
  useEffect(() => {
    if (authentication) {
      props.onValidationSuccess();
    }
  }, [authentication]);

  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };

  const switchCamera = () => {
    setCameraType(cameraType === "back" ? Camera.Constants.Type.front : Camera.Constants.Type.back);
  };

  const authenticatePhoto = async () => {
    const photo = await camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
    const result = authenticateFace(capturedImage, props.data);
    setAuthentication(result);
  };

  const CameraPreview = _ref => {
    let {
      photo,
      retakePicture
    } = _ref;
    return /*#__PURE__*/React.createElement(View, {
      style: {
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%"
      }
    }, /*#__PURE__*/React.createElement(ImageBackground, {
      source: {
        uri: photo.uri
      },
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(View, {
      style: styles.imgBackground
    }, /*#__PURE__*/React.createElement(View, {
      style: {
        flexDirection: "column"
      }
    }, authentication === true ? /*#__PURE__*/React.createElement(Text, {
      style: {
        borderRadius: 4,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        color: "green",
        fontSize: 20,
        alignContent: "center"
      }
    }, "Authentication Successful") : /*#__PURE__*/React.createElement(TouchableOpacity, {
      onPress: retakePicture,
      style: {
        borderRadius: 4,
        backgroundColor: "#14274e",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 40
      }
    }, /*#__PURE__*/React.createElement(Text, {
      style: {
        color: "red",
        fontSize: 20
      }
    }, "Authentication failed, Try again"))))));
  };

  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flex: 1,
      width: "100%"
    }
  }, previewVisible && capturedImage ? /*#__PURE__*/React.createElement(CameraPreview, {
    photo: capturedImage,
    authenticatePhoto: authenticatePhoto,
    retakePicture: retakePicture
  }) : /*#__PURE__*/React.createElement(Camera, {
    type: cameraType,
    style: {
      flex: 1
    },
    ref: r => {
      camera = r;
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flex: 1,
      width: "100%",
      backgroundColor: "transparent",
      flexDirection: "row"
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      position: "absolute",
      bottom: 30,
      flex: 1,
      right: "5%",
      flexDirection: "row",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: switchCamera
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      backgroundColor: "#14274e",
      alignItems: "center",
      fontSize: 20,
      color: "#fff",
      fontWeight: "bold"
    }
  }, "Switch Camera"))), /*#__PURE__*/React.createElement(View, {
    style: {
      position: "absolute",
      bottom: 0,
      flexDirection: "row",
      flex: 1,
      width: "100%",
      padding: 20,
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      alignSelf: "center",
      flex: 1,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: authenticatePhoto,
    style: {
      width: 70,
      height: 70,
      bottom: 0,
      borderRadius: 50,
      backgroundColor: "#fff"
    }
  })))))));
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  imgBackground: {
    flex: 1,
    flexDirection: "column",
    padding: 15,
    justifyContent: "flex-end"
  }
});
//# sourceMappingURL=index.js.map