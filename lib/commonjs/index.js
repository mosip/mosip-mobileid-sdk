"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FaceAuth = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _expoCamera = require("expo-camera");

var _AuthenticationService = _interopRequireDefault(require("./AuthenticationService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let camera;

const FaceAuth = props => {
  const [authentication, setAuthentication] = _react.default.useState(null);

  const [previewVisible, setPreviewVisible] = _react.default.useState(false);

  const [capturedImage, setCapturedImage] = _react.default.useState(null);

  const [cameraType, setCameraType] = _react.default.useState(_expoCamera.Camera.Constants.Type.front);

  (0, _react.useEffect)(() => {
    if (authentication) {
      props.onValidationSuccess();
    }
  }, [authentication]);

  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };

  const switchCamera = () => {
    setCameraType(cameraType === "back" ? _expoCamera.Camera.Constants.Type.front : _expoCamera.Camera.Constants.Type.back);
  };

  const authenticatePhoto = async () => {
    const photo = await camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
    const result = (0, _AuthenticationService.default)(capturedImage, props.data);
    setAuthentication(result);
  };

  const CameraPreview = _ref => {
    let {
      photo,
      retakePicture
    } = _ref;
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%"
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
        flexDirection: "column"
      }
    }, authentication === true ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
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
    }, "Authentication Successful") : /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      onPress: retakePicture,
      style: {
        borderRadius: 4,
        backgroundColor: "#14274e",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 40
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: {
        color: "red",
        fontSize: 20
      }
    }, "Authentication failed, Try again"))))));
  };

  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      flex: 1,
      width: "100%"
    }
  }, previewVisible && capturedImage ? /*#__PURE__*/_react.default.createElement(CameraPreview, {
    photo: capturedImage,
    authenticatePhoto: authenticatePhoto,
    retakePicture: retakePicture
  }) : /*#__PURE__*/_react.default.createElement(_expoCamera.Camera, {
    type: cameraType,
    style: {
      flex: 1
    },
    ref: r => {
      camera = r;
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      flex: 1,
      width: "100%",
      backgroundColor: "transparent",
      flexDirection: "row"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      position: "absolute",
      bottom: 30,
      flex: 1,
      right: "5%",
      flexDirection: "row",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    onPress: switchCamera
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: {
      backgroundColor: "#14274e",
      alignItems: "center",
      fontSize: 20,
      color: "#fff",
      fontWeight: "bold"
    }
  }, "Switch Camera"))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      position: "absolute",
      bottom: 0,
      flexDirection: "row",
      flex: 1,
      width: "100%",
      padding: 20,
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      alignSelf: "center",
      flex: 1,
      alignItems: "center"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
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

exports.FaceAuth = FaceAuth;

const styles = _reactNative.StyleSheet.create({
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