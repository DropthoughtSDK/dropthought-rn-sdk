Pod::Spec.new do |s|

s.platform = :ios
s.ios.deployment_target = '12.0'
s.name = "DropthoughtSDK-Objc"
s.summary = "Dropthought Objc iOS SDK."
s.requires_arc = true
s.static_framework = true
s.version = "0.1.0"
s.author = { "BCT-Barney" => "barney.chen@bahwancybertek.com" }
s.homepage = "https://github.com/BCT-Barney"
s.source = { :git => "../DropthoughtSDK/" }

s.source_files = ['DropthoughtSDK-Objc/*.{m,h}']
s.resource_bundles = {
    'main' => ['assets/*']
}

s.dependency "React"

end
