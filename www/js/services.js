angular.module('starter.services', [])

.factory('Business', function($http) {
    return {
      allbusinesslist: function() {
        console.log("allbusinesslist service");
        return $http.get(baseURL + 'getallBusinessList');
      }
    };
  });
