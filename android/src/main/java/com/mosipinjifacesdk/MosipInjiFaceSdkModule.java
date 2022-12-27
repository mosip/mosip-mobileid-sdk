package com.mosipinjifacesdk;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Rect;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.face.Face;
import com.google.mlkit.vision.face.FaceDetection;
import com.google.mlkit.vision.face.FaceDetector;
import com.google.mlkit.vision.face.FaceDetectorOptions;

import org.tensorflow.lite.Interpreter;
import org.tensorflow.lite.support.common.FileUtil;
import org.tensorflow.lite.support.common.ops.NormalizeOp;
import org.tensorflow.lite.support.image.ImageProcessor;
import org.tensorflow.lite.support.image.TensorImage;
import org.tensorflow.lite.support.image.ops.ResizeOp;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.MappedByteBuffer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ReactModule(name = MosipInjiFaceSdkModule.NAME)
public class MosipInjiFaceSdkModule extends ReactContextBaseJavaModule {
    public static final String NAME = "MosipInjiFaceSdk";

    private FaceDetector faceDetector;

    public MosipInjiFaceSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
        FaceDetectorOptions options =
        new FaceDetectorOptions.Builder()
            .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
            .setContourMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
            .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
            .build();
        FaceDetector detector = FaceDetection.getClient(options);
        faceDetector = detector;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    @ReactMethod
  public void faceAuth(String capturedImage, String vcImage, Promise promise) {

    Log.d(NAME, "Inside faceAuth...");

    Map<String, Bitmap> faceMap = new HashMap<>();
    try {
      detectFace("capturedImage", capturedImage, faceMap, promise);
      detectFace("vcImage", vcImage, faceMap, promise);
    } catch (Exception e) {
      faceMap.clear();
      Log.e(NAME, "Exception occured - ", e);
      promise.resolve(false);
    }
  }

  private Interpreter getInterpreter() throws IOException {
    Log.d(NAME, "loding model start");
    File file = new File(getReactApplicationContext().getCacheDir()+"/model.tflite");
    Log.d(NAME, file.toString());
    Interpreter interpreter = new Interpreter(file);
    Log.d(NAME, "loding model end");
    return interpreter;
  }

  private synchronized void detectFace(String name, String image, Map<String, Bitmap> faceMap,
                                      Promise promise) throws IOException {
    Log.d(NAME, "Inside detext face" + name);
    byte[] decodedString = Base64.decode(image, Base64.DEFAULT);
    InputStream inputStream = new ByteArrayInputStream(decodedString);
    Bitmap bmp = BitmapFactory.decodeStream(inputStream);
    Log.d(NAME, "bmp : " + bmp + " for name : " + name);
    InputImage inputImage = InputImage.fromBitmap(bmp, 0);
    Task<List<Face>> task = faceDetector.process(inputImage);
    task.addOnSuccessListener(new OnSuccessListener<List<Face>>() {
      @Override
      public void onSuccess(List<Face> faces) {
        Log.d(NAME, "no of face detected :: " + faces.size());
        //crop image
        Face face = faces.get(0);

        Rect bounds = face.getBoundingBox();
        Bitmap croppedImage = Bitmap.createBitmap(inputImage.getBitmapInternal(), bounds.left, bounds.top, bounds.width(), bounds.height());
        faceMap.put(name, croppedImage);
        Log.d(NAME, "faceMap size : " + faceMap.size());
        if (faceMap.size() == 2) {
          try {
            Log.d(NAME, "Inside result calculator");
            Interpreter interpreter = getInterpreter();
            resultsCalculator(interpreter, faceMap, promise);
          } catch (IOException e) {
            faceMap.clear();
            Log.e(NAME, "Exception occurred - ", e);
            promise.resolve(false);
          }
        }
      }
    });
  }

  private void resultsCalculator(Interpreter interpreter, Map<String, Bitmap> faceMap, Promise promise) throws IOException {

    Map<String, float[]> embeddingsMap = new HashMap<>();

    Log.d(NAME, "inside resultsCalculator, faceMap size = " + faceMap.size());

    for (Map.Entry<String, Bitmap> face : faceMap.entrySet()) {
      TensorImage tensorCroppedImage = getTensorImage(face.getValue());
      embeddingsMap.put(face.getKey(), getEmbeddings(interpreter, tensorCroppedImage));
    }
    Log.d(NAME, "inside resultsCalculator, embeddingsMap size = " + embeddingsMap.size());
    compareAndMatch(embeddingsMap.get(faceMap.keySet().toArray()[0]), embeddingsMap.get(faceMap.keySet().toArray()[1]), promise);
  }

  private TensorImage getTensorImage(Bitmap croppedImage) {
    Log.d(NAME, "inside getTensorImage, start ");
    ImageProcessor.Builder imageProcessorBuilder = new ImageProcessor.Builder();
    ImageProcessor imageProcessor = imageProcessorBuilder.add(new ResizeOp(160, 160, ResizeOp.ResizeMethod.BILINEAR))
      .add(new NormalizeOp(127.5f, 127.5f))
      .build();
    TensorImage tensorCroppedImage = imageProcessor.process(TensorImage.fromBitmap(croppedImage));
    Log.d(NAME, "inside getTensorImage, end ");
    return tensorCroppedImage;
  }

  private void compareAndMatch(float[] em1, float[] em2, Promise promise) {
    Log.d(NAME, "inside compareAndMatch ");
    assert em1.length == em2.length;
    double sse = 0;
    for (int i = 0; i < em1.length; i++) {
      float diff = em1[i] - em2[i];
      sse += diff * diff;
    }
    Log.d(NAME, "final result > " + Math.sqrt(sse));
    boolean result = Math.sqrt(sse) < 1;
    Log.d(NAME, "final result > " + result);
    promise.resolve(result);
  }

  private float[] getEmbeddings(Interpreter interpreter, TensorImage tensorCroppedImage) {
    Log.d(NAME, "inside getEmbeddings, start ");
    float[][] output = new float[1][512];
    interpreter.run(tensorCroppedImage.getTensorBuffer().getBuffer(), output);
    Log.d(NAME, "inside getEmbeddings, start ");
    return output[0];
  }

}
