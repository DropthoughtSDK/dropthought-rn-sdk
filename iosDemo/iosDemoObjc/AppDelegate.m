//
//  AppDelegate.m
//  iosDemoObjc
//
//  Created by BCT-Barney on 2020/6/4.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

#import "AppDelegate.h"
#import "Survey.h"

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.

    [[Survey sharedInstance] initSurvey:launchOptions apiKey:@""];

    return YES;
}
@end
