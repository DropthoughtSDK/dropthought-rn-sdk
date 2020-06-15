package com.king.usingrn;

import android.app.Application;

import com.facebook.soloader.SoLoader;
import com.dropthought.app.sdk.Dropthought;


public class MainApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        Dropthought.init(
                this,
                "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjYXJvbC5rdW9AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyMzM5NTI0MywiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.pNGSqCuWdO6d3l7nuX66vkzZ8CupaljIaz97zbL93BnyzKN_JBJ3WLRrMsS8kNpuDEmIBlxqKppzTnnktI4Z0A",
                "e5573da3-aacf-4f1c-b9a5-bef854131d49"
        );
    }
}
