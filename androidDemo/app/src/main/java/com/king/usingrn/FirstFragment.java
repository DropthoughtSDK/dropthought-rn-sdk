package com.king.usingrn;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;

//import com.dropthought.app.sdk.RNModuleActivity;
//import com.king.rnsdk.RNModuleActivity;

import com.dropthought.app.sdk.SurveyModuleActivity;

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
            public void onClick(View view) {
                System.out.println("Button Clicked");
                Intent intent = new Intent(getActivity().getApplicationContext(), SurveyModuleActivity.class);
                Bundle b = new Bundle();
                b.putString("surveyId", "some-id-1");
                b.putString("surveyName", "Survey name");
                intent.putExtras(b);
                startActivity(intent);
//                NavHostFragment.findNavController(FirstFragment.this)
//                        .navigate(R.id.action_FirstFragment_to_SecondFragment);
            }
        });
    }
}
