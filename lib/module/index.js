function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { Camera, CameraType } from "expo-camera";
import authenticateFace from "./AuthenticationService";
import * as FaceDetector from "expo-face-detector";
let camera;
export default class FaceAuth extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "__retakePicture", () => {
      this.setState({
        capturedImage: null,
        previewVisible: false
      });
    });

    _defineProperty(this, "__switchCamera", () => {
      this.setState({
        cameraType: this.state.cameraType === "back" ? CameraType.front : CameraType.back
      });
    });

    _defineProperty(this, "authenticatePhoto", async () => {
      const photo = await camera.takePictureAsync();
      this.setState({
        capturedImage: photo,
        previewVisible: true
      });
      const result = authenticateFace(this.state.capturedImage, this.props.data);
      this.setState({
        authentication: result
      });

      if (result) {
        this.props.onValidationSuccess();
      }
    });

    _defineProperty(this, "CameraPreview", _ref => {
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
      }, this.state.authentication === true ? /*#__PURE__*/React.createElement(Text, {
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
    });

    if (props.data === null) {
      throw new Error("Please send VC face image");
    }

    this.state = {
      authentication: false,
      previewVisible: false,
      capturedImage: null,
      cameraType: CameraType.front
    };
  }

  render() {
    return /*#__PURE__*/React.createElement(View, {
      style: styles.container
    }, /*#__PURE__*/React.createElement(View, {
      style: {
        flex: 1,
        width: "100%"
      }
    }, this.state.previewVisible ? /*#__PURE__*/React.createElement(this.CameraPreview, {
      photo: this.state.capturedImage,
      retakePicture: this.__retakePicture
    }) : /*#__PURE__*/React.createElement(Camera, {
      type: this.state.cameraType,
      style: {
        flex: 1
      },
      ref: r => {
        camera = r;
      },
      faceDetectorSettings: {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 100,
        tracking: true
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
      onPress: this.__switchCamera
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
      onPress: this.authenticatePhoto,
      style: {
        width: 70,
        height: 70,
        bottom: 0,
        borderRadius: 50,
        backgroundColor: "#fff"
      }
    })))))));
  }

}
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