//
//  ViewController.m
//  iosDemoObjc
//
//  Created by BCT-Barney on 2020/6/4.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

#import "ViewController.h"
#import <Dropthought.h>
#import "AppDelegate.h"
#import <React/RCTRootView.h>

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *surveyIdTF;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (IBAction)openSurvey:(id)sender {
    NSString *surveyId = self.surveyIdTF.text;
    [[Dropthought instance] present:self surveyId:surveyId];

}

- (IBAction)uploadClicked:(id)sender {
    [[Dropthought instance] uploadOfflineFeedbacks];
}


@end
