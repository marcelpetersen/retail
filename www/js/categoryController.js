retailApp

.controller('categoryCtrl', function($rootScope, $state, $scope, $ionicHistory, store,$http , $stateParams) {
  console.log("calling categories controller");

   if(localStorage.businessId){
     var businessID = localStorage.getItem('businessId');
     console.log("businessID:",businessID);
     var business_id = { business_id: businessID };
  }
  
  $scope.business_id = business_id;
  $scope.imageURL=imageURL;

  
  $scope.categories = function() {
    $http.get(baseURL + 'categoriesbybusinessid/' + business_id.business_id).success(function(res) {
        $scope.Categories = res;
    }).error(function(error) {
        console.log("Error getting category for business", error);
    });
  };

  $scope.items = function() {
    $http.get(baseURL + 'itemsbusinessid/' + business_id.business_id).success(function(res) {
        $scope.Items = res;
    }).error(function(error) {
        console.log("Error getting item for business", error);
    });
  };

  $scope.Categoriesdetails = $stateParams.categorydata;

});
