package com.dropthought.app.sdk;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

public class SurveyModuleActivity extends Activity implements DefaultHardwareBackBtnHandler {
    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    private static Intent getIntent(Context context, String apiKey, String surveyId) {
        Intent intent = new Intent(context, SurveyModuleActivity.class);
        Bundle initialProps = new Bundle();
        initialProps.putString("surveyId", surveyId);
        initialProps.putString("apiKey", apiKey);
        intent.putExtras(initialProps);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return intent;
    }

    public static void startSurveyActivityForResult(Activity context, int requestCode, String apiKey, String surveyId) {
        Intent intent = getIntent(context, apiKey, surveyId);
        context.startActivityForResult(intent, requestCode);
    }

//    public static void startSurveyActivityForResult(Activity context, int requestCode, String surveyId) {
//        startSurveyActivityForResult(context, requestCode, mAPIKey, surveyId);
//    }
//
//    public static void startSurveyActivityForResult(Activity context, int requestCode) {
//        startSurveyActivityForResult(context, requestCode, mAPIKey, mSurveyId);
//    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mReactRootView = new ReactRootView(this);

        // get react instance manager from singleton
        mReactInstanceManager = ReactInstanceSingleton.getReactInstanceManager(getApplication());

        // The string here (e.g. "dropthought-sdk") has to match
        // the string in AppRegistry.registerComponent() in index.js
        mReactRootView.startReactApplication(mReactInstanceManager, "dropthought-sdk", getIntent().getExtras());

        setContentView(mReactRootView);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
        if (mReactRootView != null) {
            mReactRootView.unmountReactApplication();
        }
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d("SurveyModuleActivity", "onActivityResult: " + resultCode + " " + requestCode);
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onActivityResult(this, requestCode, resultCode, data);
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }


    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }
}