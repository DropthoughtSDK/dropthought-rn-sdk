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

    @IBOutlet weak var apikeyTF: UITextField!
    @IBOutlet weak var surveyIdTF: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func openSurveyClick(_ sender: Any) {
        guard let apiKey = apikeyTF.text,
            let surveyId = surveyIdTF.text else {
                return
        }
        Survey.present(self, apiKey: apiKey, surveyId: surveyId)
    }
}

