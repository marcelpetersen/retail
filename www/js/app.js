// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var retailApp = angular.module('retail', ['ionic', 'tabSlideBox', 'starter.services', 'angular-storage', 'firebase', 'ngMessages' , 'angularPayments']);

retailApp

.run(function($ionicPlatform, $rootScope, firebase, store) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });

  $rootScope.business_id = 18;
  
  //stateChange event
  $rootScope.$on( '$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
    $rootScope.currentState = toState.name;
    var loggedIn = false;
    var userDetails = null;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $rootScope.loggedIn = true;
        $rootScope.userDetails = user;
      } else {
        $rootScope.loggedIn = loggedIn;
        $rootScope.userDetails = userDetails;
      }
    });
    function add(a, b) { return a + b; }
    if(store.get('cart')){
      var cartPrice = store.get('cart').map(function (i) {
        return parseFloat(i.item_price) * i.quantity;
      });
      $rootScope.cartValue = cartPrice.reduce(add, 0);
    }else {
      $rootScope.cartValue = 0;
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
  $ionicConfigProvider.views.forwardCache(false);

  $stateProvider

  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'registerCtrl'
  })

  .state('forgotPassword', {
    url: '/forgotPassword',
    templateUrl: 'templates/forgotPassword.html',
    controller: 'forgotPasswordCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'appCtrl'
  })

  .state('app.cart', {
    url: '/cart',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/cart.html',
        controller: 'cartCtrl'
      }
    }
  })
  .state('app.products', {
    url: '/products',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/products.html',
        controller: 'productsCtrl'
      }
    }
  })
  .state('app.detail', {
    url: '/detail',
    cache: false,
     params: {
            data: null,
     },
    views: {
      'menuContent': {
        templateUrl: 'templates/detail.html',
        controller: 'productsCtrl'
      }
    }
  })
  .state('app.category', {
    url: '/category',
    views: {
      'menuContent': {
        templateUrl: 'templates/category.html',
        controller: 'categoryCtrl'
      }
    }
  })
  .state('app.categorydescription', {
    url: '/categorydescription',
    cache: false,
     params: {
            categorydata: null,
     },
    views: {
      'menuContent': {
        templateUrl: 'templates/categorydescription.html',
        controller: 'categoryCtrl'
      }
    }
  })
  .state('app.item', {
    url: '/item',
    views: {
      'menuContent': {
        templateUrl: 'templates/item.html',
        controller: 'categoryCtrl'
      }
    }
  })

  .state('checkout', {
    url: '/checkout',
    cache: false,
    templateUrl: 'templates/checkout.html',
    controller: 'checkoutCtrl'
  })


  .state('app.payment', {
    url: '/payment',
    views: {
      'menuContent': {
        templateUrl: 'templates/payment.html',
        controller: 'checkoutCtrl'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('app.shipping', {
    url: '/shipping',
    views: {
      'menuContent': {
        templateUrl: 'templates/shipping.html',
        controller: 'shippingCtrl'
      }
    }
  })

  

  .state('app.aboutus', {
    url: '/aboutus',
    views: {
      'menuContent': {
        templateUrl: 'templates/aboutus.html'
      }
    }
  })

  .state('app.setting', {
    url: '/setting',
    views: {
      'menuContent': {
        templateUrl: 'templates/setting.html',
        controller : 'settingCtrl'
      }
    }
  })

  .state('app.defaultaddress', {
    url: '/defaultaddress',
    views: {
      'menuContent': {
        templateUrl: 'templates/defaultaddress.html',
        controller : 'settingCtrl'
      }
    }
  })

  .state('app.editdefaultaddress', {
    url: '/editdefaultaddress',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit_address.html',
        controller : 'settingCtrl'
      }
    }
  })

  .state('businesslist', {
    url: '/businesslist',
    cache: false,
    templateUrl: 'templates/businesslist.html',
    controller : 'businessCtrl'
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/businesslist');
  $httpProvider.interceptors.push('APIInterceptor');
})

.service('APIInterceptor', function($rootScope, $injector, store) {
  var service = this;

  service.request = function(config) {
    $injector.get("$ionicLoading").show({
      template:'Loading....'
    });
    return config;
  };

  service.response = function(response) {
    $injector.get("$ionicLoading").hide();
    return response;
  };

  service.responseError = function(response) {
    $injector.get("$ionicLoading").hide();
    return response;
  };
})

.directive('rgCacheView', function ($cacheFactory, $rgScopeUtils) {
  return {
    restrict: "E",
    priority: 10000,
    transclude: true,
    compile: function(element, attrs, transcludeFn){
      var childScope;
      var cacheView = $cacheFactory.get('rgCacheView');
      if(!cacheView) cacheView = $cacheFactory('rgCacheView');
      var cacheName = attrs.name;
      var cache = cacheView.get(cacheName);
      return function(scope, element, attrs){
        if(cache){
          childScope = cache.scope;
          childScope.$broadcast('$outCacheStart', childScope);
          $rgScopeUtils.add(childScope, scope);
          element.append(cache.element.contents());
          childScope.$broadcast('$outCacheEnd', childScope);
        }else{
          childScope = scope.$new();
          transcludeFn(childScope, function(clone){
            element.append(clone);
          })
        }
        scope.$on('$destroy', function(e){
          childScope.$broadcast('$inCacheStart', childScope);
          $rgScopeUtils.remove(childScope);
        })
        element.on('$destroy', function(e){
          cacheView.put(cacheName, {
            element: angular.element('<div></div>').append(element.contents()),
            scope: childScope
          })
          childScope.$broadcast('$inCacheEnd', childScope);
        })
      }
    }
  }
});
