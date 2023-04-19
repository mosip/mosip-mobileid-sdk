import Foundation
import BiometricSdk

@objc(MosipMobileidSdk)
class MosipMobileidSdk: NSObject {

    @objc
        func configure(_ configuration: NSDictionary,
                       resolve:  @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) -> Void {
            NSLog("Initializing Biometric SDK with config: %@", dump(configuration))
            var builder = BiometricSdkConfigBuilder()
            if (configuration.value(forKey: "withFace") != nil) {
                let faceTfliteModelPath = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.tfliteModelPath") as! String
                let faceTfliteModelChecksum = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.tfliteModelChecksum") as! Int32
                let faceTfliteModelinputWidth = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.inputWidth") as! Int32
                let faceTfliteModelinputHeight = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.inputHeight") as! Int32
                let faceTfliteModeloutputLenghth = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.outputLength") as! Int32
                let faceMatcherThreshold = configuration.value(forKeyPath: "withFace.matcher.threshold") as! Double
                builder = builder
                    .withFace(extractor: FaceExtractProperties(),
                              encoder: FaceEncodeProperties(faceNetModel:
                                                                FaceNetModelConfiguration(
                                                                    tfliteModelPath: faceTfliteModelPath,
                                                                    modelChecksum: faceTfliteModelChecksum,
                                                                    inputWidth:       faceTfliteModelinputWidth,
                                                                    inputHeight:      faceTfliteModelinputHeight,
                                                                    outputLength:                faceTfliteModeloutputLenghth
                                                                )
                                                           ),
                              matcher: FaceMatchProperties(threshold: faceMatcherThreshold))
            }
            do {
                try BiometricSdkFactory.shared.configure(config: builder.build())
            } catch {
                reject("BIOMETRIC_SDK_CONFIGURATION_ERROR", error.localizedDescription, error)
            }
            resolve(nil)
        }

        @objc
        func faceExtractAndEncode(_ b64Img: NSString,
                                  resolve:  @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) -> Void {
            let instance = BiometricSdkFactory.shared.getInstance()
            let imageData = Data(base64Encoded: b64Img as String)!
            let img = UIImage(data: imageData)!
            let cgImagePtr = UnsafeMutableRawPointer(Unmanaged.passRetained(img.cgImage!).toOpaque())
            let template = instance.face().encoder().extractAndEncode(nativeImage: cgImagePtr)
            let templateStr =   template.base64EncodedString() as NSString
            resolve(templateStr)
        }

        @objc
        func faceCompare(_ b64Template1: NSString,
                         b64Template2: NSString,
                         resolve:  @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock) -> Void {
            let instance = BiometricSdkFactory.shared.getInstance()
            let sample1 = Data(base64Encoded: b64Template1 as String)!
            let sample2 = Data(base64Encoded: b64Template2 as String)!
            resolve(instance.face().matcher().matches(sample1: sample1, sample2: sample2))
        }
}
