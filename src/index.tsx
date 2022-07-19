import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { CameraType } from "expo-camera/build/Camera.types";
import authenticateFace from "./AuthenticationService";

let camera: Camera;

export const FaceAuth: React.FC<FaceAuthProps> = (props: FaceAuthProps) => {
  const [authentication, setAuthentication] = React.useState<boolean | null>(
    null
  );
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] =
    React.useState<CameraCapturedPicture | null>(null);
  const [cameraType, setCameraType] = React.useState(CameraType.front);

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
    setCameraType(cameraType === "back" ? CameraType.front : CameraType.back);
  };

  const authenticatePhoto = async () => {
    const photo: CameraCapturedPicture = await camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
    const result: boolean = authenticateFace(capturedImage, props.data);
    setAuthentication(result);
  };

  const CameraPreview = ({ photo, retakePicture, authenticatePhoto }: any) => {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <ImageBackground source={{ uri: photo.uri }} style={{ flex: 1 }}>
          <View style={styles.imgBackground}>
            <View style={{ flexDirection: "column" }}>
              {authentication === true ? (
                <Text
                  style={{
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    color: "green",
                    fontSize: 20,
                    alignContent: "center",
                  }}
                >
                  Authentication Successful
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={retakePicture}
                  style={{
                    borderRadius: 4,
                    backgroundColor: "#14274e",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                  }}
                >
                  <Text style={{ color: "red", fontSize: 20 }}>
                    Authentication failed, Try again
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: "100%" }}>
        {previewVisible && capturedImage ? (
          <CameraPreview
            photo={capturedImage}
            authenticatePhoto={authenticatePhoto}
            retakePicture={retakePicture}
          />
        ) : (
          <Camera
            type={cameraType}
            style={{ flex: 1 }}
            ref={(r: Camera) => {
              camera = r;
            }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                backgroundColor: "transparent",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  bottom: 30,
                  flex: 1,
                  right: "5%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={switchCamera}>
                  <Text
                    style={{
                      backgroundColor: "#14274e",
                      alignItems: "center",
                      fontSize: 20,
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Switch Camera
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  flexDirection: "row",
                  flex: 1,
                  width: "100%",
                  padding: 20,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ alignSelf: "center", flex: 1, alignItems: "center" }}
                >
                  <TouchableOpacity
                    onPress={authenticatePhoto}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: "#fff",
                    }}
                  />
                </View>
              </View>
            </View>
          </Camera>
        )}
      </View>
    </View>
  );
};

export interface FaceAuthProps {
  data: string;
  onValidationSuccess: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imgBackground: {
    flex: 1,
    flexDirection: "column",
    padding: 15,
    justifyContent: "flex-end",
  },
});
