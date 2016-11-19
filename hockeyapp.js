var gulp = require('gulp');
var gutil = require('gulp-util');
var hockeyApp = require('gulp-hockeyapp');

//var var_notes = process.argv[4];
//console.log(version);
//var buildname = "./releases/"+version+".ipa" ;
//console.log(buildname);


gulp.task('hockeyappios', function(done) {
    var options = {
        id: '686558a9faa34a918254b541ce330c1c',
        apiToken: '4e17f85bf2e7421182079101bee47434',
        inputFile: '../../output/Siliger-ios.ipa' ,
        notify: 1,
        status: 2,
        teams:79327,
        notes: "UAT Release"
    };

    hockeyApp.upload(options).then(
        function(response) {
            // All is ok, build was uploaded
            done();
        },
        function(err) {
          console.log(err);
        }
    );
});

gulp.task('hockeyappandroid', function(done) {
    var options = {
        id: 'ec0c98db9d47437c86c24b63549079d8',
        apiToken: '4e17f85bf2e7421182079101bee47434',
        inputFile: '../../output/Siliger-android.apk' ,
        notify: 1,
        status: 2,
        teams:79327,
        notes: "UAT Release Android "
    };

    hockeyApp.upload(options).then(
        function(response) {
            // All is ok, build was uploaded
            done();
        },
        function(err) {
          console.log(err);
        }
    );
});

gulp.task('default', ['hockeyappios','hockeyappandroid']);
