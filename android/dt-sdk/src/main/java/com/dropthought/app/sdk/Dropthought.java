package com.dropthought.app.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;

public class Dropthought {
    private static String mAPIKey;
    private static String mSurveyId;

    public static String getAPIKey() {
        return mAPIKey;
    }

    public static String getSurveyId() {
        return mSurveyId;
    }

    public static void init(Activity activity) {
        ReactInstanceManager reactInstanceManager = ReactInstanceSingleton.getReactInstanceManager(activity);

        // set up initial props
        Bundle initialProps = new Bundle();
        if (mAPIKey != null) {
            initialProps.putString("apiKey", mAPIKey);
        }
        if(mSurveyId != null) {
            initialProps.putString("surveyId", mSurveyId);
        }

        // create a dummy react root view,
        // so later activity would be started faster
        ReactRootView reactView = new ReactRootView(activity);
        reactView.startReactApplication(reactInstanceManager, "dropthought-sdk", initialProps);
    }

    public static void init(Activity activity, String apiKey) {
        mAPIKey = apiKey;
        init(activity);
    }

    public static void init(Activity activity, String apiKey, String surveyId) {
        mAPIKey = apiKey;
        mSurveyId = surveyId;
        init(activity);
    }

    private static Intent getIntent(Context context, String apiKey, String surveyId) {
        Intent intent = new Intent(context, SurveyModuleActivity.class);
        Bundle initialProps = new Bundle();
        initialProps.putString("surveyId", surveyId);
        initialProps.putString("apiKey", apiKey);
        intent.putExtras(initialProps);
        return intent;
    }

    public static void startSurveyActivityForResult(Activity context, int requestCode, String apiKey, String surveyId) {
        Intent intent = getIntent(context, apiKey, surveyId);
        context.startActivityForResult(intent, requestCode);
    }

    public static void startSurveyActivityForResult(Activity context, int requestCode, String surveyId) {
        startSurveyActivityForResult(context, requestCode, mAPIKey, surveyId);
    }

    public static void startSurveyActivityForResult(Activity context, int requestCode) {
        startSurveyActivityForResult(context, requestCode, mAPIKey, mSurveyId);
    }

    public static void startSurveyActivity(Activity context, String apiKey, String surveyId) {
        Intent intent = getIntent(context, apiKey, surveyId);
        context.startActivity(intent);
    }

    public static void startSurveyActivity(Activity context, String surveyId) {
        startSurveyActivity(context, mAPIKey, surveyId);
    }

    public static void startSurveyActivity(Activity context) {
        startSurveyActivity(context, mAPIKey, mSurveyId);
    }

    public static void uploadOfflineFeedbacks() {
        ReactInstanceSingleton.uploadQueuedFeedback();
    }
}
