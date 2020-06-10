package com.king.usingrn;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import com.dropthought.app.sdk.Dropthought;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;


public class MainActivity extends AppCompatActivity {
    public static final int SM_REQUEST_CODE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                takeSurvey();
            }
        });
    }

    public void takeSurvey() {
        // This is how you display a survey for the user to take
        // Remember: you must supply the activity (e.g. this), your own request code (to differentiate from other activities),
        Dropthought.startSurveyActivityForResult(
                this,
                SM_REQUEST_CODE,
                "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW5nLmNoZW5AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyMjYyMDQ1MCwiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.Ol9kxpzakhaYAssDnZvfR2Zxj_ei2ewnldcIr4zh4dXXT9Xp3qY_VES0lvqOM2IXxyI0sz06hMQ6N1QeCRXsVg",
                "23856ed5-5805-4146-b67e-5ff9aace0362"
        );
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.d("MainActivity demo", "onActivityResult: " + resultCode + " " + requestCode);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
