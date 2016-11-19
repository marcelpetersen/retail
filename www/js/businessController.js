retailApp
.controller('businessCtrl', function($rootScope, $state, $scope, $ionicHistory, store, $http , Business) {
   $rootScope.usersession = store.get('usersession');

   //getting all Business list
  Business.allbusinesslist().success(function(businesslist) {
   $scope.allbusiness = businesslist;

  });

  $scope.UpdateSession = function(businessId, businessName) {
    	localStorage.setItem("businessId",businessId);
    	localStorage.setItem("businessName",businessName);
    	$state.go('app.products');
  };

});
