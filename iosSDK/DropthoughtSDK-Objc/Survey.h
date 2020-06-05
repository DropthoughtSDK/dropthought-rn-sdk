//
//  Survey.h
//  DropthoughtSDK-Objc
//
//  Created by BCT-Barney on 2020/6/4.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface Survey : NSObject <RCTBridgeModule>
+ (void)present:(UIViewController *)from apiKey:(NSString *)apiKey surveyId:(NSString *)surveyId;
@end

NS_ASSUME_NONNULL_END
