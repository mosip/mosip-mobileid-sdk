import Foundation
import TensorFlowLite
import MLKit
import Accelerate

@objc(MosipInjiFaceSdk)
class MosipInjiFaceSdk: NSObject {
    
    var faceMap = [String : Any]()

  @objc(faceAuth:withB:withResolver:withRejecter:)
  func faceAuth(capturedImage: String, vcImage: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    do {
            faceMap.removeAll()
            let fd = createFaceDetector();
            if let img1 = getImageFromDir(capturedImage){
                detectFace(faceDetector: fd, uiImage: img1,facekey:"capturedImage")
            };
            if let img2 = getImageFromDir(vcImage){
                detectFace(faceDetector: fd, uiImage: img2,facekey:"vcImage")
            };
        } catch let error {
            faceMap.removeAll()
            reject(error)
        }
  }


  // creating face detector
    func createFaceDetector()->FaceDetector{
        let options = FaceDetectorOptions()
        options.performanceMode = .fast
        options.landmarkMode = .none
        options.classificationMode = .none
        let faceDetector = FaceDetector.faceDetector(options: options)
        return faceDetector;
    }
    // get image from DIR(from the document folder of device)(how images are stored for this POC "/res/Name of person/image")
    func getImageFromDir(_ image: String) -> UIImage? {
        
        guard let data = Data(base64Encoded: image) else { return nil }
        return UIImage(data: data)
    }
    // store model also in emulator(How model stored for this POC "/res/model.tfliteƒ")
    func getModelPath(_ modelName: String) -> String? {
        
        if let cacheUrl = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first {
            let fileURL = cacheUrl.appendingPathComponent("/"+modelName)
            return fileURL.path
        }
        return nil
    }
    //detect the face
    func detectFace(faceDetector:FaceDetector,uiImage:UIImage,facekey:String){
        let visionImage = VisionImage(image: uiImage)
        visionImage.orientation = uiImage.imageOrientation
        //weak var weakSelf = self
        faceDetector.process(visionImage) { faces, error in
            //          guard let strongSelf = weakSelf else {
            //            print("Self is nil!")
            //            return
            //          }
            guard error == nil, let faces = faces, !faces.isEmpty else {
                print("face not detected")
                return
            }
            // crop the face from image
            var croppedImage = CIImage(cgImage: uiImage.cgImage!).cropped(to: faces[0].frame)
        
            // resize image to 160*160
            croppedImage = self.resizeImage(sourceImage: croppedImage);
            let croppedUiImage = UIImage(ciImage: croppedImage)
            //convert image to CVBUffer
            let buf = self.buffer(from: croppedUiImage)
            //convert buffer to float32 input array
            let data = self.rgbDataFromBuffer(buf!)
            
            //            var arr2 = Array<Float32>(repeating: 0, count: data!.count/MemoryLayout<Float32>.stride)
            //            _ = arr2.withUnsafeMutableBytes { data!.copyBytes(to: $0) }
            //
            //            print(arr2)
            //            print("done")
            
            // load interpreter(TODO : should be done only once)
            
            var options = Interpreter.Options()
            options.threadCount = 1
            do{
                let outputTensor: Tensor
                //load model
                let interpreter  = try Interpreter(modelPath:self.getModelPath("model.tflite")!, options: options)
                // Allocate memory for the input tensor
                try interpreter.allocateTensors()
                // Data to Tensor.
                try interpreter.copy(data!, toInputAt: 0)
                // inferencr
                try interpreter.invoke()
                
                // output tensor shape(1:512)
                outputTensor = try interpreter.output(at: 0)
                self.faceMap[facekey] = [Float32](unsafeData: outputTensor.data)
                print(self.faceMap)
                if(self.faceMap.count==2){
                    self.calculateDiff();
                }
            }
            catch let error {
                print("Failed to invoke the interpreter with error: \(error.localizedDescription)") ; 
                reject(error)
            }
            
            
            
        
        }
    }
    
    func calculateDiff(){
        self.compareEnbeddingsL2Norm(em1: faceMap["capturedImage"] as! [Float32] , em2: faceMap["vcImage"] as! [Float32])
    }
    
    // compare embeddings using L2 Norm
    func compareEnbeddingsL2Norm(em1:[Float32], em2:[Float32]) -> Bool{
        var sse = 0.0
        var i = 0
        while(i<em1.count){
            let diff = em1[i] - em2[i]
            sse += Double(diff * diff)
            i+=1
        }
        resolve(sqrt(sse) < 1);
    }
    
    
    //TODO find a method to resize with Bilinear interpolation
    func resizeImage(sourceImage:CIImage)-> CIImage{
        let resizeFilter = CIFilter(name:"CILanczosScaleTransform")!
        
        // Desired output size
        let targetSize = CGSize(width:159, height:159)
        
        // Compute scale and corrective aspect ratio
        let scale = targetSize.height / (sourceImage.extent.height)
        let aspectRatio = targetSize.width/((sourceImage.extent.width) * scale)
        
        // Apply resizing
        resizeFilter.setValue(sourceImage, forKey: kCIInputImageKey)
        resizeFilter.setValue(scale, forKey: kCIInputScaleKey)
        resizeFilter.setValue(aspectRatio, forKey: kCIInputAspectRatioKey)
        return resizeFilter.outputImage!
    }
    
    // convert Ui Image to CV Buffer
    func buffer(from image: UIImage) -> CVPixelBuffer? {
        let attrs = [kCVPixelBufferCGImageCompatibilityKey: kCFBooleanTrue, kCVPixelBufferCGBitmapContextCompatibilityKey: kCFBooleanTrue] as CFDictionary
        var pixelBuffer : CVPixelBuffer?
        let status = CVPixelBufferCreate(kCFAllocatorDefault, Int(image.size.width), Int(image.size.height), kCVPixelFormatType_32ARGB, attrs, &pixelBuffer)
        guard (status == kCVReturnSuccess) else {
            return nil
        }
        
        CVPixelBufferLockBaseAddress(pixelBuffer!, CVPixelBufferLockFlags(rawValue: 0))
        let pixelData = CVPixelBufferGetBaseAddress(pixelBuffer!)
        
        let rgbColorSpace = CGColorSpaceCreateDeviceRGB()
        let context = CGContext(data: pixelData, width: Int(image.size.width), height: Int(image.size.height), bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pixelBuffer!), space: rgbColorSpace, bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)
        
        context?.translateBy(x: 0, y: image.size.height)
        context?.scaleBy(x: 1.0, y: -1.0)
        
        UIGraphicsPushContext(context!)
        image.draw(in: CGRect(x: 0, y: 0, width: image.size.width, height: image.size.height))
        UIGraphicsPopContext()
        CVPixelBufferUnlockBaseAddress(pixelBuffer!, CVPixelBufferLockFlags(rawValue: 0))
        
        return pixelBuffer
    }
    
    // convert Cv Buffer to Float32 array
    private func rgbDataFromBuffer(
        _ buffer: CVPixelBuffer
    ) -> Data? {
        CVPixelBufferLockBaseAddress(buffer, .readOnly)
        defer {
            CVPixelBufferUnlockBaseAddress(buffer, .readOnly)
        }
        guard let sourceData = CVPixelBufferGetBaseAddress(buffer) else {
            return nil
        }
        
        let width = CVPixelBufferGetWidth(buffer)
        let height = CVPixelBufferGetHeight(buffer)
        let sourceBytesPerRow = CVPixelBufferGetBytesPerRow(buffer)
        let destinationChannelCount = 3
        let destinationBytesPerRow = destinationChannelCount * width
        
        var sourceBuffer = vImage_Buffer(data: sourceData,
                                         height: vImagePixelCount(height),
                                         width: vImagePixelCount(width),
                                         rowBytes: sourceBytesPerRow)
        
        guard let destinationData = malloc(height * destinationBytesPerRow) else {
            print("Error: out of memory")
            return nil
        }
        
        defer {
            free(destinationData)
        }
        
        var destinationBuffer = vImage_Buffer(data: destinationData,
                                              height: vImagePixelCount(height),
                                              width: vImagePixelCount(width),
                                              rowBytes: destinationBytesPerRow)
        
        let pixelBufferFormat = CVPixelBufferGetPixelFormatType(buffer)
        
        switch (pixelBufferFormat) {
        case kCVPixelFormatType_32BGRA:
            vImageConvert_BGRA8888toRGB888(&sourceBuffer, &destinationBuffer, UInt32(kvImageNoFlags))
        case kCVPixelFormatType_32ARGB:
            vImageConvert_ARGB8888toRGB888(&sourceBuffer, &destinationBuffer, UInt32(kvImageNoFlags))
        case kCVPixelFormatType_32RGBA:
            vImageConvert_RGBA8888toRGB888(&sourceBuffer, &destinationBuffer, UInt32(kvImageNoFlags))
        default:
            // Unknown pixel format.
            return nil
        }
        
        let byteData = Data(bytes: destinationBuffer.data, count: destinationBuffer.rowBytes * height)
        
        
        // Not quantized, convert to floats
        // Not quantized, convert to floats
        let bytes = Array<UInt8>(unsafeData: byteData)!
        var floats = [Float32]()
        for i in 0..<bytes.count {
            floats.append((Float32(bytes[i])) / 255.0)
            //floats.append((Float32(bytes[i])))
        }
        
        //return Data(copyingBufferOf: self.normalise(em:floats))
        return Data(copyingBufferOf: floats)
    }
    
    // normalise the image
    func normalise(em:[Float32])-> [Float32]{
        let sum = em.reduce(0, +)
        let mean = sum/Float32(em.count)
        let v = em.reduce(0, { $0 + ($1-mean)*($1-mean) })
        let stddev = sqrt(v / Float32(em.count - 1))
        var i = 0
        var floats = [Float32]()
        while(i<em.count){
            floats.append((em[i]-mean)/stddev)
            i+=1
        }
        return floats
    }
    
    
    
    
    
    
}
extension Data {
    /// Creates a new buffer by copying the buffer pointer of the given array.
    ///
    /// - Warning: The given array's element type `T` must be trivial in that it can be copied bit
    /// for bit with no indirection or reference-counting operations; otherwise, reinterpreting
    /// data from the resulting buffer has undefined behavior.
    /// - Parameter array: An array with elements of type `T`.
    init<T>(copyingBufferOf array: [T]) {
        self = array.withUnsafeBufferPointer(Data.init)
    }
}

extension Array {
    /// Creates a new array from the bytes of the given unsafe data.
    ///
    /// - Warning: The array's `Element` type must be trivial in that it can be copied bit for bit
    /// with no indirection or reference-counting operations; otherwise, copying the raw bytes in
    /// the `unsafeData`'s buffer to a new array returns an unsafe copy.
    /// - Note: Returns `nil` if `unsafeData.count` is not a multiple of
    /// `MemoryLayout<Element>.stride`.
    /// - Parameter unsafeData: The data containing the bytes to turn into an array.
    init?(unsafeData: Data) {
        guard unsafeData.count % MemoryLayout<Element>.stride == 0 else { return nil }
#if swift(>=5.0)
        self = unsafeData.withUnsafeBytes { .init($0.bindMemory(to: Element.self)) }
#else
        self = unsafeData.withUnsafeBytes {
            .init(UnsafeBufferPointer<Element>(
                start: $0,
                count: unsafeData.count / MemoryLayout<Element>.stride
            ))
        }
#endif // swift(>=5.0)
    }
}
