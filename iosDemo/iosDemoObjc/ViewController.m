//
//  ViewController.m
//  iosDemoObjc
//
//  Created by BCT-Barney on 2020/6/4.
//  Copyright © 2020 bct.tpe. All rights reserved.
//

#import "ViewController.h"
#import <Survey.h>

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *apiKeyTF;
@property (weak, nonatomic) IBOutlet UITextField *surveyIdTF;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    self.apiKeyTF.text = @"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW5nLmNoZW5AYmFod2FuY3liZXJ0ZWsuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MTYyMjYyMDQ1MCwiaXNzIjoiRHJvcFRob3VnaHQsIEluYyJ9.Ol9kxpzakhaYAssDnZvfR2Zxj_ei2ewnldcIr4zh4dXXT9Xp3qY_VES0lvqOM2IXxyI0sz06hMQ6N1QeCRXsVg";
    self.surveyIdTF.text = @"23856ed5-5805-4146-b67e-5ff9aace0362";
}

- (IBAction)openSurvey:(id)sender {
    [Survey present:self apiKey:self.apiKeyTF.text surveyId:self.surveyIdTF.text];
}



@end
