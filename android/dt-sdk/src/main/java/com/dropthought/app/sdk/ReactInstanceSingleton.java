package com.dropthought.app.sdk;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.List;

class ReactInstanceSingleton {
    private static volatile ReactInstanceManager mReactInstanceManager;

    public static synchronized ReactInstanceManager getReactInstanceManager(
            Application application) {
        if (mReactInstanceManager == null) {
            List<ReactPackage> packages = new PackageList(application).getPackages();
            mReactInstanceManager = ReactInstanceManager.builder()
                    .setApplication(application)
                    .setBundleAssetName("index.android.bundle")
                    .setJSMainModulePath("index")
                    .addPackages(packages)
                    .addPackage(new SurveyBridgePackage())
                    .setInitialLifecycleState(LifecycleState.BEFORE_RESUME)
                    .build();

            mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener(){
                public void onReactContextInitialized(ReactContext reactContext){
                    //Use valid Context here
                    Log.d("ReactInstanceSingleton","onReactContextInitialized");
                    WritableMap params = Arguments.createMap();
                    params.putString("apiKey", Dropthought.getAPIKey());

                    reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("onSessionConnect", params);
                }
            });
        }
        return mReactInstanceManager;
    }
}
