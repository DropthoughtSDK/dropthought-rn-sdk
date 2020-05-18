//
//  Survey.swift
//  RNSDK DemoApp
//
//  Created by BCT-Barney on 2020/5/7.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

import UIKit
import React

public class Survey: NSObject {
    public static func present(_ from: UIViewController, programId: String, surveyId: String) {
        let bundle = Bundle(identifier: "com.bct.tpe.DropthoughtSDK")!
        let jsBundleLocation = bundle.url(forResource: "main", withExtension: "jsbundle", subdirectory: nil)!
        let data = ["programId": programId, "surveyId": surveyId]
        let rootView = RCTRootView(bundleURL: jsBundleLocation, moduleName: "dropthought-sdk", initialProperties: nil, launchOptions: nil)
        
        let viewController = UIViewController()
        rootView.frame = UIScreen.main.bounds
        viewController.view.addSubview(rootView)
        from.present(viewController, animated: true, completion: nil)
    }
}
