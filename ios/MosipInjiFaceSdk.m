#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MosipInjiFaceSdk, NSObject)

RCT_EXTERN_METHOD(faceAuth:(NSString *)a withB:(NSString *)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
