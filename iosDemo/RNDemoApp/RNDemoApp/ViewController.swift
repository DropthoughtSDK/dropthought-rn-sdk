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
        Survey.present(self, programId: "9876-5432-0000", surveyId: "1234-5678-0000")
    }

}

