package com.mosipmobileidsdk

import android.graphics.BitmapFactory
import android.util.Base64
import com.facebook.react.bridge.*
import net.iriscan.sdk.BiometricSdkConfigBuilder
import net.iriscan.sdk.BiometricSdkFactory
import net.iriscan.sdk.face.FaceEncodeProperties
import net.iriscan.sdk.face.FaceExtractProperties
import net.iriscan.sdk.face.FaceMatchProperties
import net.iriscan.sdk.face.FaceNetModelConfiguration

class MosipMobileidSdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun configure(config: ReadableMap, promise: Promise) {
    var configBuilder = BiometricSdkConfigBuilder(reactApplicationContext)
    if (config.hasKey("withFace")) {
      val encoderFaceNetConfig = config.getMap("withFace")!!.getMap("encoder")!!.getMap("faceNetModel")!!
      val matcherConfig = config.getMap("withFace")!!.getMap("matcher")!!
      configBuilder = configBuilder
        .withFace(
          extractor = FaceExtractProperties(),
          encoder = FaceEncodeProperties(
            faceNetModel = FaceNetModelConfiguration(
              tfliteModelPath = encoderFaceNetConfig.getString("tfliteModelPath")!!,
              modelChecksum = encoderFaceNetConfig.getInt("tfliteModelChecksum"),
              inputHeight = encoderFaceNetConfig.getInt("inputHeight"),
              inputWidth = encoderFaceNetConfig.getInt("inputWidth"),
              outputLength = encoderFaceNetConfig.getInt("outputLength")
            )
          ),
          matcher = FaceMatchProperties(threshold = matcherConfig.getDouble("threshold"))
        )
    }
    try {
      BiometricSdkFactory.configure(config = configBuilder.build())
    } catch (ex: Exception) {
      promise.reject(ex)
    }
    promise.resolve(null)
  }

  @ReactMethod
  fun faceExtractAndEncode(b64Img: String, promise: Promise) {
    val instance = BiometricSdkFactory.getInstance()
    val imageData = Base64.decode(b64Img, Base64.DEFAULT)
    val bitmap = BitmapFactory.decodeByteArray(imageData, 0, imageData.size)
    val template = instance.face().encoder().extractAndEncode(bitmap)
    val templateStr = Base64.encodeToString(template, Base64.DEFAULT)
    promise.resolve(templateStr)
  }

  @ReactMethod
  fun faceCompare(b64Template1: String, b64Template2: String, promise: Promise) {
    val instance = BiometricSdkFactory.getInstance()
    val template1 = Base64.decode(b64Template1, Base64.DEFAULT)
    val template2 = Base64.decode(b64Template2, Base64.DEFAULT)
    val match = instance.face().matcher().matches(template1, template2)
    promise.resolve(match)
  }

  companion object {
    const val NAME = "MosipMobileidSdk"
  }
}
