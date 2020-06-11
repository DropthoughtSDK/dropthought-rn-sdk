//
//  SurveyEmitter.m
//  DropthoughtSDK-Objc
//
//  Created by BCT-Barney on 2020/6/10.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

#import "SurveyEmitter.h"

@implementation SurveyEmitter

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[@"UploadQueuedFeedback"];
}

- (void)sendSelectItem:(NSDictionary *)obj {
    [self sendEventWithName:@"UploadQueuedFeedback" body:obj];
}

+ (instancetype)sharedInstance {
    static SurveyEmitter *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[SurveyEmitter alloc] init];
    });
    return instance;
}
@end
