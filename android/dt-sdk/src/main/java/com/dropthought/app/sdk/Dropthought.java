package com.dropthought.app.sdk;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;

public class Dropthought {
    private static String mAPIKey;

    public static void init(Application application, String apiKey) {
        ReactInstanceManager reactInstanceManager = ReactInstanceSingleton.getReactInstanceManager(application);
        mAPIKey = apiKey;

        // create a dummy react root view,
        // so later activity would be started faster
        ReactRootView reactView = new ReactRootView(application.getApplicationContext());
        reactView.startReactApplication(reactInstanceManager, "dropthought-sdk");
    }

    public static void startSurveyActivity(Context context, String apiKey, String surveyId) {
        Intent intent = new Intent(context, SurveyModuleActivity.class);
        Bundle b = new Bundle();
        b.putString("surveyId", surveyId);
        b.putString("apiKey", apiKey);
        intent.putExtras(b);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

    public static void startSurveyActivity(Context context, String surveyId) {
        startSurveyActivity(context, mAPIKey, surveyId);
    }
}
