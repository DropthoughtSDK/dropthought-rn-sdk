//
//  ViewController.m
//  iosDemoObjc
//
//  Created by BCT-Barney on 2020/6/4.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

#import "ViewController.h"
#import <Survey.h>
#import "AppDelegate.h"
#import <React/RCTRootView.h>

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *apiKeyTF;
@property (weak, nonatomic) IBOutlet UITextField *surveyIdTF;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (IBAction)openSurvey:(id)sender {
    [[Survey sharedInstance] setupAPIKey:self.apiKeyTF.text];
    NSString *surveyId = self.surveyIdTF.text;
    [[Survey sharedInstance] present:self surveyId:surveyId];

}

- (IBAction)uploadClicked:(id)sender {
    [[Survey sharedInstance] setupAPIKey:self.apiKeyTF.text];
    [[Survey sharedInstance] sendUploadOfflineFeedbacksEvent];
}


@end
