//
//  Survey.h
//  DropthoughtSDK-Objc
//
//  Created by BCT-Barney on 2020/6/4.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface Survey : NSObject <RCTBridgeModule>
+ (instancetype) sharedInstance;
- (void)initSurvey:(NSDictionary *)launchOptions;
- (void)present:(UIViewController *)from apiKey:(NSString *)apiKey surveyId:(NSString *)surveyId;
@end
