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
#import "SurveyApplication.h"
#import "SurveyEmitter.h"

@interface Survey()
@property (nonatomic, strong) UIViewController *from;
@property (nonatomic, strong) SurveyApplication *app;
@property (nonatomic, strong) NSString *apiKey;
@end

@implementation Survey

RCT_EXPORT_MODULE();

+ (instancetype)sharedInstance {
    static Survey *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[Survey alloc] init];
    });
    return instance;
}

- (void)initSurvey:(NSDictionary *)launchOptions apiKey:(NSString *)apiKey {
    self.app = [[SurveyApplication alloc] init];
    [self.app setupBridge:launchOptions];
    self.apiKey = apiKey;
}

- (void)setupAPIKey:(NSString *)apiKey {
    self.apiKey = apiKey;
}

- (void)present:(UIViewController *)from surveyId:(NSString *)surveyId {
    self.from = from;

    NSDictionary *initialProperties = @{ @"apiKey" : self.apiKey, @"surveyId": surveyId };
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:self.app.bridge moduleName:@"dropthought-sdk" initialProperties:initialProperties];
    rootView.frame = [UIScreen mainScreen].bounds;

    UIViewController *vc = [[UIViewController alloc] init];
    vc.view = rootView;
    vc.modalPresentationStyle = UIModalPresentationFullScreen;

    [self.from presentViewController:vc animated:YES completion:NULL];
}

- (void)sendUploadOfflineFeedbacksEvent {
    [self.app.bridge enqueueJSCall:@"RCTDeviceEventEmitter" method:@"emit" args:@[@"onSessionConnect", @{@"apiKey": self.apiKey}] completion:NULL];
}


RCT_EXPORT_METHOD(dismiss)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[[Survey sharedInstance] from] dismissViewControllerAnimated:YES completion:nil];
    });
}
@end
