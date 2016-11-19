retailApp
.controller('settingCtrl', function($rootScope, $state, $scope, $ionicHistory, store, $http) {
   $rootScope.usersession = store.get('usersession');

    $scope.gotoAddress = function() {
      $state.go('app.defaultaddress');
    };

    //function for update default address
    $scope.updateaddress = function(EditAddressForm){
      if(EditAddressForm.$valid){
        $http.post(baseURL + 'UpdateDefaultAddress' , $scope.usersession).success(function(res){
          if(res.status == 1){
            store.set('usersession',$scope.usersession);
            $state.go('app.defaultaddress');
          }else{
            console.log("default address not updated");
          }
        }).error(function(error){
          console.log("please check the internate")
        });  
      }
    }
    
    $scope.gotoeditaddress = function(){
      $state.go('app.editdefaultaddress');
    }
});
