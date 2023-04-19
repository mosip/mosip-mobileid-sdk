#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MosipMobileidSdk, NSObject)

RCT_EXTERN_METHOD(configure:
                  (NSDictionary*) configuration
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(faceExtractAndEncode:
                  (NSString*)b64Img
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(faceCompare:
                  (NSString*)b64Template1
                  b64Template2:(NSString*)b64Template2
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(resize:
                  (NSString*)b64Img
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
