"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _expoCamera = require("expo-camera");

var _AuthenticationService = _interopRequireDefault(require("./AuthenticationService"));

var FaceDetector = _interopRequireWildcard(require("expo-face-detector"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let camera;
;

class FaceAuth extends _react.default.Component {
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
        cameraType: this.state.cameraType === 'back' ? _expoCamera.CameraType.front : _expoCamera.CameraType.back
      });
    });

    _defineProperty(this, "authenticatePhoto", async () => {
      const photo = await camera.takePictureAsync();
      this.setState({
        capturedImage: photo,
        previewVisible: true
      });
      const result = (0, _AuthenticationService.default)(this.state.capturedImage, this.props.data);
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
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: {
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%'
        }
      }, /*#__PURE__*/_react.default.createElement(_reactNative.ImageBackground, {
        source: {
          uri: photo.uri
        },
        style: {
          flex: 1
        }
      }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: styles.imgBackground
      }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: {
          flexDirection: 'column'
        }
      }, this.state.authentication === true ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: {
          borderRadius: 4,
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          color: 'green',
          fontSize: 20,
          alignContent: 'center'
        }
      }, "Authentication Successful") : /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
        onPress: retakePicture,
        style: {
          borderRadius: 4,
          backgroundColor: '#14274e',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40
        }
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: {
          color: 'red',
          fontSize: 20
        }
      }, "Authentication failed, Try again"))))));
    });

    if (props.data === null) {
      throw new Error('Please send VC face image');
    }

    this.state = {
      authentication: false,
      previewVisible: false,
      capturedImage: null,
      cameraType: _expoCamera.CameraType.front
    };
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.container
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        flex: 1,
        width: '100%'
      }
    }, this.state.previewVisible ? /*#__PURE__*/_react.default.createElement(this.CameraPreview, {
      photo: this.state.capturedImage,
      retakePicture: this.__retakePicture
    }) : /*#__PURE__*/_react.default.createElement(_expoCamera.Camera, {
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
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        flex: 1,
        width: '100%',
        backgroundColor: 'transparent',
        flexDirection: 'row'
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        position: 'absolute',
        bottom: 30,
        flex: 1,
        right: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      onPress: this.__switchCamera
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: {
        backgroundColor: '#14274e',
        alignItems: 'center',
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold'
      }
    }, "Switch Camera"))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        padding: 20,
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        alignSelf: 'center',
        flex: 1,
        alignItems: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      onPress: this.authenticatePhoto,
      style: {
        width: 70,
        height: 70,
        bottom: 0,
        borderRadius: 50,
        backgroundColor: '#fff'
      }
    })))))));
  }

}

exports.default = FaceAuth;

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgBackground: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    justifyContent: 'flex-end'
  }
});

function render() {
  throw new Error('Function not implemented.');
}
//# sourceMappingURL=FaceAuth.js.map