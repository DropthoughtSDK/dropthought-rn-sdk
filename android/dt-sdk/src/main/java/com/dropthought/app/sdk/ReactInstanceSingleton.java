package com.dropthought.app.sdk;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.common.LifecycleState;

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
                    .setInitialLifecycleState(LifecycleState.BEFORE_RESUME)
                    .build();
        }
        return mReactInstanceManager;
    }
}
