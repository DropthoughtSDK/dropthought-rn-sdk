package com.dropthought.app.sdk;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class SurveyBridgeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public SurveyBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Survey";
    }

    @ReactMethod
    public void dismiss() {
        // close current activity
        reactContext.getCurrentActivity().finish();
    }
}
