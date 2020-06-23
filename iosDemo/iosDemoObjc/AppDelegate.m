//
//  AppDelegate.m
//  iosDemoObjc
//
//  Created by BCT-Barney on 2020/6/4.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

#import "AppDelegate.h"
#import "Dropthought.h"

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.

    [[Dropthought instance] init:launchOptions apiKey:@"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW5nLmNoZW5AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyMjYyMDQ1MCwiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.Ol9kxpzakhaYAssDnZvfR2Zxj_ei2ewnldcIr4zh4dXXT9Xp3qY_VES0lvqOM2IXxyI0sz06hMQ6N1QeCRXsVg"];

    return YES;
}
@end
