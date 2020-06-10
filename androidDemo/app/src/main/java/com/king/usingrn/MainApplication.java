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
                "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW5nLmNoZW5AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyMjYyMDQ1MCwiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.Ol9kxpzakhaYAssDnZvfR2Zxj_ei2ewnldcIr4zh4dXXT9Xp3qY_VES0lvqOM2IXxyI0sz06hMQ6N1QeCRXsVg"
        );
    }
}
