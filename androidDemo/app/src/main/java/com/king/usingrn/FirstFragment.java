package com.king.usingrn;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.dropthought.app.sdk.Dropthought;

public class FirstFragment extends Fragment {

    @Override
    public View onCreateView(
            LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_first, container, false);
    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        view.findViewById(R.id.button_first).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View btnView) {
                System.out.println("Button Clicked");
                EditText surveyIdText = (EditText) getView().findViewById(R.id.surveyId);

                Dropthought.startSurveyActivityForResult(
                        getActivity(),
                        MainActivity.SM_REQUEST_CODE,
                        surveyIdText.getText().toString()
                );
            }
        });
    }
}
