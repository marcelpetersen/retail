#!/bin/bash
version=$1
build=$2
projectname=Siliger
python cordova-version-bump.py $version $build
ionic build ios
#xcodebuild clean -project platforms/ios/$projectname.xcodeproj -configuration Release -alltargets
xcodebuild archive -project platforms/ios/$projectname.xcodeproj -scheme $projectname -archivePath platforms/ios/$projectname.xcarchive
xcodebuild -exportArchive -archivePath platforms/ios/$projectname.xcarchive -exportPath platforms/ios/$projectname-$1-$2 -exportFormat ipa -exportProvisioningProfile "Siliger"
mv platforms/ios/$projectname-$1-$2.ipa ../../output/Siliger-ios.ipa
ionic build android
mv platforms/android/build/outputs/apk/android-debug.apk ../../output/Siliger-android.apk
gulp --gulpfile hockeyapp.js
