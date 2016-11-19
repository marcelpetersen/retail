retailApp

.controller('loginCtrl', function($scope, $state, $ionicHistory, store, api , $timeout , $ionicLoading , $http) {

 

  $scope.goRegister = function () {
    $state.go('register');
  };

  $scope.goForgotPassword = function () {
    $state.go('forgotPassword');
  };

  $scope.myBack = function () {
    if($ionicHistory.viewHistory().backView && $ionicHistory.viewHistory().backView == 'register'){
      $state.go($ionicHistory.viewHistory().backView.stateId);
    }else if(store.get('cart')){
      $state.go('app.cart');
    }else {
      $state.go('app.products');
    }
  };

  $scope.doLogin = function() {
    var userData = {
      email: this.email,
      password: this.password,
      businessId: business_id.business_id
    };
    
    api.login(userData, function (res, status) {
        if(res.error == 'unauthorized'){
            $scope.loginerrmsg = 'Please enter valid email and password.';
            $scope.showloginerrmsg = true;
            $timeout(function () {
              $scope.showloginerrmsg = false;
            }, 5000);
        }
        if(res.authToken) {
          store.set('usersession' ,res.user);
          store.set('auth', res.authToken);
          $state.go('app.products', {}, { reload: true });
        }
    });
  };


  $scope.googleRegistration = function() {

    $ionicLoading.show({
      template: 'Logging in...'
    });

    window.plugins.googleplus.login(
      {
        'webClientId': '604191734281-gojukuru6mgqbmus3pq71f2dsmhj64pg.apps.googleusercontent.com', 
        'offline': true,
      },
      function (user_data) {
        alert("success");
        alert(user_data.displayName);
        alert(user_data.email);
        var nameArr = user_data.displayName.split(/\s+/);
        var first_name = nameArr.slice(0, -1).join(" ");
        var last_name = nameArr.pop();
      
        var logindata = {
          "business_id" : business_id.business_id,
          "email" : user_data.email,
          "first_name" : first_name,
          "last_name" : last_name,
          "google_user_reference" : user_data.userId
        }

        $http.post(baseURL + 'googleregistration/' + logindata).success(function(res) {
          alert(res.record);
          if(res.status == 0){
              alert("error during google registration");
          }else if(res.status == 1){
              alert("already user please login");
              if(res.record.google_user_reference){
                alert("78 g id");
                 $scope.googleSignin(logindata);
              }else{
                alert("do normal sign in ");
              }
               $ionicLoading.hide();
          }else{
            alert("user created success");
            $scope.googleSignin(logindata);
          }
        }).error(function(error) {
          console.log("Error getting category for business", error);
        });

        $ionicLoading.hide();
      },
      function (msg) {
        alert("ERROR");
        console.log("msg:",msg);
        alert(msg);
        $ionicLoading.hide();
      }
    );
  };

  $scope.googleSignin = function(logindata){
    alert("googleSignin calling 103");
    alert(logindata);

  }

})

.controller('registerCtrl', function ($scope, $state, store, $timeout, api) {

  $scope.myBack = function () {
    $state.go('login');
  };

  $scope.goForgotPassword = function () {
    $state.go('forgotPassword');
  };

  $scope.doRegister = function () {

    var userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      mobile: this.mobile,
      businessId: business_id.business_id,
      address : this.address
    };

    api.register(userData, function (res, status) {
        if(res.error == 'conflict'){
          $scope.alreadyregister = 'user already register.';
          $scope.showalreadyregister = true;
          $timeout(function () {
            $scope.showalreadyregister = false;          
           }, 3000);
        }else{
        if(res.authToken) store.set('auth', res.authToken);
           $state.go('login');
         }
      });

  };
})

.controller('forgotPasswordCtrl', function($scope, $state, $ionicHistory, $timeout) {
  $scope.goRegister = function () {
    $state.go('register');
  };

  $scope.myBack = function () {
    $state.go('login');
  };

  $scope.changePassword = function() {
    Auth.$sendPasswordResetEmail(this.email).then(function(response) {
      $scope.message = 'Reset email sent. Check your inbox.';
      $timeout(function () {
        $state.go('login');
      }, 3000);
    }).catch(function(error) {
      switch(error.code){
        case 'auth/user-not-found':
          $scope.err = 'Invalid Email Address.';
          break;
        default:
          $scope.err = 'You entered a wrong email address';
        }
    });
  };
});
