retailApp

.factory('api', function ($http,$state) {

  function register(data, callback) {
    $http.post(baseURL + 'v1/register', data).success(function (res, req) {
      return callback(res, req);
    }).error(function (err) {
      return callback(err);
    });
  }

  function login(data, callback) {
    $http.post(baseURL + 'v1/login', data).success(function (res, req) {
      return callback(res, req);
    }).error(function (err) {
      return callback(err);
    });
  }

  return {
    register: register,
    login: login
  };
});
