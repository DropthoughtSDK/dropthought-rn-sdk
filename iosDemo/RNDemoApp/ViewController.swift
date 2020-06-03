//
//  ViewController.swift
//  RNDemoApp
//
//  Created by BCT-Barney on 2020/5/12.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

import UIKit
import DropthoughtSDK

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func openSurveyClick(_ sender: Any) {
        let apiKey = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW5nLmNoZW5AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyMjYyMDQ1MCwiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.Ol9kxpzakhaYAssDnZvfR2Zxj_ei2ewnldcIr4zh4dXXT9Xp3qY_VES0lvqOM2IXxyI0sz06hMQ6N1QeCRXsVg"
        let surveyId = "23856ed5-5805-4146-b67e-5ff9aace0362"
        Survey.present(self, apiKey: apiKey, surveyId: surveyId)

    }

}

