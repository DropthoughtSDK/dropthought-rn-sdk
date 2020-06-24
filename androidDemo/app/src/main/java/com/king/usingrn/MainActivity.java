package com.king.usingrn;

import android.content.Intent;
import android.os.Bundle;

import com.dropthought.app.sdk.Dropthought;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;


public class MainActivity extends AppCompatActivity {
    public static final int SM_REQUEST_CODE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Dropthought.init(
                this,
                "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjYXJvbC5rdW9AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyMzM5NTI0MywiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.pNGSqCuWdO6d3l7nuX66vkzZ8CupaljIaz97zbL93BnyzKN_JBJ3WLRrMsS8kNpuDEmIBlxqKppzTnnktI4Z0A",
                "e5573da3-aacf-4f1c-b9a5-bef854131d49"
        );

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                takeSurvey();
            }
        });

        Button button = findViewById(R.id.upload);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                uploadFeedbacks();
            }
        });
    }

    public void takeSurvey() {
        // This is how you display a survey for the user to take
        // Remember: you must supply the activity (e.g. this), your own request code (to differentiate from other activities),
        Dropthought.startSurveyActivityForResult(
                this,
                SM_REQUEST_CODE
        );

    }

    public void uploadFeedbacks() {
        Dropthought.uploadOfflineFeedbacks();
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
