package com.dropthought.app.sdk;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;

public class Dropthought {
    private static String mAPIKey;
    private static String mSurveyId;

    public static void init(Application application) {
        ReactInstanceManager reactInstanceManager = ReactInstanceSingleton.getReactInstanceManager(application);

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
        ReactRootView reactView = new ReactRootView(application.getApplicationContext());
        reactView.startReactApplication(reactInstanceManager, "dropthought-sdk", initialProps);
    }

    public static void init(Application application, String apiKey) {
        mAPIKey = apiKey;
        init(application);
    }

    public static void init(Application application, String apiKey, String surveyId) {
        mAPIKey = apiKey;
        mSurveyId = surveyId;
        init(application);
    }

    public static void startSurveyActivity(Context context, String apiKey, String surveyId) {
        Intent intent = new Intent(context, SurveyModuleActivity.class);
        Bundle initialProps = new Bundle();
        initialProps.putString("surveyId", surveyId);
        initialProps.putString("apiKey", apiKey);
        intent.putExtras(initialProps);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

    public static void startSurveyActivity(Context context, String surveyId) {
        startSurveyActivity(context, mAPIKey, surveyId);
    }

    public static void startSurveyActivity(Context context) {
        startSurveyActivity(context, mAPIKey, mSurveyId);
    }
}