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
            let faceModelPath = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.path") as! String
            let faceModelChecksum = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.modelChecksum") as? String
            let faceModelinputWidth = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.inputWidth") as! Int32
            let faceModelinputHeight = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.inputHeight") as! Int32
            let faceModeloutputLenghth = configuration.value(forKeyPath: "withFace.encoder.faceNetModel.outputLength") as! Int32
            let faceMatcherThreshold = configuration.value(forKeyPath: "withFace.matcher.threshold") as! Double
            builder = builder
                .withFace(extractor: FaceExtractProperties(),
                          encoder: FaceEncodeProperties(faceNetModel:
                                                            FaceNetModelConfiguration(
                                                                path: faceModelPath,
                                                                inputWidth:  faceModelinputWidth,
                                                                inputHeight: faceModelinputHeight,
                                                                outputLength: faceModeloutputLenghth,
                                                                modelChecksum: faceModelChecksum,
                                                                modelChecksumMethod: faceModelChecksum != nil ? HashMethod.sha256 : nil,
                                                                overrideCacheOnWrongChecksum: faceModelChecksum != nil ? true : nil
                                                            )
                                                       ),
                          matcher: FaceMatchProperties(threshold: faceMatcherThreshold))
        }
        do {
            try BiometricSdkFactory.shared.initialize(config: builder.build())
        } catch {
            reject("CONFIGURATION_ERROR", error.localizedDescription, error)
        }
        resolve(nil)
    }
    
    @objc
    func faceExtractAndEncode(_ b64Img: NSString,
                              resolve:  @escaping RCTPromiseResolveBlock,
                              reject: @escaping RCTPromiseRejectBlock) -> Void {
        let instance = BiometricSdkFactory.shared.getInstance()!
        let imageData = Data(base64Encoded: b64Img as String)!
        let img = UIImage(data: imageData)!
        let cgImagePtr = UnsafeMutableRawPointer(Unmanaged.passRetained(img.cgImage!).toOpaque())
        let template = instance.face().encoder().extractAndEncode(nativeImage: cgImagePtr)
        if (template != nil) {
            let templateStr = template!.base64EncodedString() as NSString
            resolve(templateStr)
        } else {
            reject("FACE_EXTRACT_ERROR", "No biometrics were found on image", nil)
        }
    }
    
    @objc
    func faceCompare(_ b64Template1: NSString,
                     b64Template2: NSString,
                     resolve:  @escaping RCTPromiseResolveBlock,
                     reject: @escaping RCTPromiseRejectBlock) -> Void {
        let instance = BiometricSdkFactory.shared.getInstance()!
        let sample1 = Data(base64Encoded: b64Template1 as String)!
        let sample2 = Data(base64Encoded: b64Template2 as String)!
        resolve(instance.face().matcher().matches(sample1: sample1, sample2: sample2))
    }
    
    @objc
    func faceScore(_ b64Template1: NSString,
                   b64Template2: NSString,
                   resolve:  @escaping RCTPromiseResolveBlock,
                   reject: @escaping RCTPromiseRejectBlock) -> Void {
      let instance = BiometricSdkFactory.shared.getInstance()!
      let sample1 = Data(base64Encoded: b64Template1 as String)!
      let sample2 = Data(base64Encoded: b64Template2 as String)!
      resolve(instance.face().matcher().matchScore(sample1: sample1, sample2: sample2))
  }
    
}
