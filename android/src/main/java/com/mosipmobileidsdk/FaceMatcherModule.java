package io.mosip.inji.sdk;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class FaceMatcherModule extends ReactContextBaseJavaModule {

    @Override
    public String getName() {
        return "FaceMatcherModule";
    }

    FaceMatcherModule(ReactApplicationContext context) {
        super(context);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean performMatch(String capturedImageUri, String vcImageUri) {
        System.out.println("Inside performMatch method" + capturedImageUri + vcImageUri);
        return true;
    }
}
