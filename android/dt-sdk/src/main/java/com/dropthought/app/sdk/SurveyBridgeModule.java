package com.dropthought.app.sdk;

import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;

public class SurveyBridgeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public SurveyBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Dropthought";
    }

    @ReactMethod
    public void dismiss() {
        // close current activity
        reactContext.getCurrentActivity().finish();
    }

    @ReactMethod
    public void toast(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    @ReactMethod
    public void onFeedbackResult(ReadableMap surveyFeedback, int errorCode ) {
//        Log.d("SurveyBridgeModule", "onFeedbackResult: " + errorCode + " " + " "
//                + reactContext.getCurrentActivity().getLocalClassName() + " " + surveyFeedback.getString("surveyId"));
        Intent intent = new Intent();
        reactContext.getCurrentActivity().setResult(errorCode, intent);
    }
}
