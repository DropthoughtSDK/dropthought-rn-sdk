package com.dropthought.app.sdk.rnsample;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "dropthought-sdk";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected Bundle getLaunchOptions() {
        Bundle bundle = new Bundle();

        // these data are from stage server, not production
        // bundle.putString("surveyId", "9d74ce7e-c69a-4c13-a028-68baa889c394");
        bundle.putString("surveyId", "ac684093-359f-4932-b032-5e3949d52f89");
        bundle.putString("apiKey", "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW5nLmNoZW5AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyMjU5OTEzMywiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.le13ity-FDDT7Nm8nk4wmWnQ2PrdGZNzmG4pFT4pz0gwl8IwWms_8yRRPL0ClQsa8a59E2oFiCdt2vpns1G7-A");
        return bundle;
      }
    };
  }
}
