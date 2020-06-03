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
    public static func present(_ from: UIViewController, apiKey: String, surveyId: String) {
        printBundles()

        guard let bundleURL = Bundle(for: Survey.self).url(forResource: "main", withExtension: "bundle"),
            let jsBundleLocation = Bundle(url: bundleURL)?.url(forResource: "main", withExtension: "jsbundle") else {
            return
        }
        let data = ["apiKey": apiKey, "surveyId": surveyId]
        let rootView = RCTRootView(bundleURL: jsBundleLocation, moduleName: "dropthought-sdk", initialProperties: data, launchOptions: nil)
        
        let viewController = UIViewController()
        rootView.frame = UIScreen.main.bounds
        viewController.view.addSubview(rootView)
        viewController.modalPresentationStyle = .fullScreen
        from.present(viewController, animated: true, completion: nil)
    }

    static func printBundles() {
        let docsPath = Bundle(for: Survey.self).resourcePath!
        let fileManager = FileManager.default

        do {
            let docsArray = try fileManager.contentsOfDirectory(atPath: docsPath)
            print(docsArray)
        } catch {
            print(error)
        }
    }
}
