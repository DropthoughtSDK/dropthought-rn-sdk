//
//  Survey.m
//  DropthoughtSDK-Objc
//
//  Created by BCT-Barney on 2020/6/4.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "Survey.h"

@implementation Survey

RCT_EXPORT_MODULE();

static UIViewController *fromVC;

+ (void)present:(UIViewController *)from apiKey:(NSString *)apiKey surveyId:(NSString *)surveyId {
    fromVC = from;

    NSBundle *bundle = [NSBundle bundleForClass:[Survey class]];
    NSURL *bundleURL = [bundle URLForResource:@"main" withExtension:@"bundle"];
    NSURL *jsbundleLocation = [[NSBundle bundleWithURL:bundleURL] URLForResource:@"main" withExtension:@"jsbundle"];

    NSDictionary *initialProperties = @{
      @"apiKey" : apiKey,
      @"surveyId": surveyId
    };

    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsbundleLocation moduleName:@"dropthought-sdk" initialProperties:initialProperties launchOptions:nil];

    rootView.frame = [UIScreen mainScreen].bounds;
    UIViewController *vc = [[UIViewController alloc] init];
    [vc.view addSubview:rootView];
    vc.modalPresentationStyle = UIModalPresentationFullScreen;
    [from presentViewController:vc animated:YES completion:nil];
}

RCT_EXPORT_METHOD(dismiss)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [fromVC dismissViewControllerAnimated:YES completion:nil];
    });
}
@end
