retailApp
.controller('appCtrl', function($rootScope, $state, $scope, $ionicHistory, store, $http) {
   $rootScope.usersession = store.get('usersession');
  
  $scope.goCart = function() {
    $state.go('app.cart', {
      reload: true
    });
  };

  $scope.gotobusiness = function(){
    $state.go('businesslist');
  }

  $scope.goCategory = function() {
    $state.go('app.category');
  };

  $scope.gotosetting = function(){
     $state.go('app.setting');
  }
  
  $scope.goItem = function() {
    $state.go('app.item');
  };

  $scope.gotocontactus = function() {
    $state.go('app.contactus');
  };

  $scope.gotoaboutus = function() {
    $state.go('app.aboutus');
  };
  
  var auth = store.get('auth');
  // Open the login modal
  $scope.login = function() {
    if (auth) {
      $rootScope.loggedIn = true;
      $state.go('app.products');
    } else {
      $state.go('login', {
        reload: true
      });
    }
  };

  $scope.logout = function() {
    //Auth.$signOut();
    store.remove('usersession');
    store.remove('auth');
    store.remove('cart');
    store.remove('address');
    $state.go('app.products', {}, { reload: true });
    $rootScope.loggedIn = false;
    //$rootScope.userDetails = null;
  };

    $scope.logoname = {};

    $scope.getuserdetails = function(){

       $http.get(baseURL + 'getuserdetails/'+  $rootScope.usersession.id).success(function(res) {
                if(res.status == true){
                  console.log(res.record[0]);
                  store.set('usersession',res.record[0]);
                  $rootScope.usersession = store.get('usersession');
                }else{
                  console.log("error in upload user profile pic");
                }
                

    }).error(function() {
        console.log("Please check your internet connection or data source..");
    });

    }
   /* if($rootScope.usersession != null){
      $scope.getuserdetails();  
    }*/
    

    $scope.uploadprofilelogo = function() {
        var oFReader = new FileReader();
        console.log("oFReader:",oFReader);
        $scope.logoname = document.getElementById("profilelogo").files[0].name;
        console.log("$scope.userdetails:",$scope.logoname);
        oFReader.readAsDataURL(document.getElementById("profilelogo").files[0]);
        console.log("oFReader:",oFReader);
        oFReader.onload = function(oFREvent) {
            //console.log(oFREvent);
            document.getElementById("proflogo").src = oFREvent.target.result;
            var file = $scope.myFile;

            $scope.imageData = {
                id: $rootScope.usersession.id,
                attachmentname: $scope.logoname,
                attachment: oFReader.result,
                business_id : $rootScope.usersession.businessId
            };

            $http.post(baseURL + 'updateUserProfilePic', $scope.imageData).success(function(res) {
                if(res.status == true){
                  console.log("res:",res);
                  $scope.profileimage = res.fileName;
                  //var  
                  //$scope.getuserdetails() ;
                }else{
                  console.log("error in upload user profile pic");
                }
                

            }).error(function() {
                console.log("Please check your internet connection or data source..");
            });

        };
    };


})

.controller('productsCtrl', function($rootScope, $scope, store, $http, $timeout , $stateParams) {
    if(localStorage.businessId){
     var businessID = localStorage.getItem('businessId');
     console.log("businessID:",businessID);
     var business_id = { business_id: businessID };
  }
  
   $rootScope.usersession = store.get('usersession');

  $scope.business_id = business_id;
  $scope.imageURL = imageURL;
  $scope.allitembyBusinessId = function() {
    $http.get(baseURL + 'itemsbusinessid/' + business_id.business_id).success(function(res) {
      $scope.items = res;
    }).error(function(error) {
      console.log("Error getting item for business", error);
    });
  };
  $scope.category = '';
  $scope.filterByCategory = function(category_id) {
    $scope.category = category_id;
  };

  $scope.allcategorybyBusinessId = function() {
    $http.get(baseURL + 'categoriesbybusinessid/' + business_id.business_id).success(function(res) {
      $scope.Category = res;
    }).error(function(error) {
      console.log("Error getting category for business", error);
    });
  };

  $scope.allcategorybyBusinessId();
  $scope.allitembyBusinessId();

  function checkCart(product) {
    for (var i = 0; i < $scope.cart.length; i++) {
      if ($scope.cart[i].item_id === product.item_id) return i;
    }
  }

  function updateCart() {
    if ($scope.cart && $scope.cart.length > 0) {
      $scope.items.map(function(i) {
        for (var k = 0; k < $scope.cart.length; k++) {
          if ($scope.cart[k].item_id === i.item_id) i.quantity = $scope.cart[k].quantity;
        }
      });
    }
  }

  $scope.addToCart = function(product) {
    if ($scope.cart) {
      var i = checkCart(product);
      if (i >= 0) {
        $scope.cart[i].quantity = $scope.cart[i].quantity + 1;
        $rootScope.cartValue = $rootScope.cartValue + parseFloat(product.item_price);
        store.set('cart', $scope.cart);
      } else {
        product.quantity = 1;
        $scope.cart.push(product);
        $rootScope.cartValue = $rootScope.cartValue + parseFloat(product.item_price);
        store.set('cart', $scope.cart);
      }
    } else {
      $scope.cart = [];
      product.quantity = 1;
      $scope.cart.push(product);
      $rootScope.cartValue = $rootScope.cartValue + parseFloat(product.item_price);
      store.set('cart', $scope.cart);
    }
    console.log($scope.cart);
  };

  $scope.removeFromCart = function(product) {
    if (product.quantity) {
      var i = checkCart(product);
      if (i >= 0) {
        if ($scope.cart[i].quantity === 1) {
          $scope.cart.splice(i, 1);
          product.quantity = 0;

          $rootScope.cartValue = $rootScope.cartValue - parseFloat(product.item_price);
        } else if ($scope.cart.length > 0 && $scope.cart[i] && $scope.cart[i].quantity > 1) {
          $scope.cart[i].quantity = $scope.cart[i].quantity - 1;
          product.quantity = $scope.cart[i].quantity;
          $rootScope.cartValue = $rootScope.cartValue - parseFloat(product.item_price);
        }
        store.set('cart', $scope.cart);
      }
    }
  };

  $scope.beers = [{
      'item_id': 1,
      'product_name': 'BEER - 1',
      'item_price': 'R60',
      'product_quanity': 'Samsung-32GB',
      'product_image': 'img/beer_1.jpg',
    }, {
      'item_id': 2,
      'product_name': 'BEER - 2',
      'item_price': 'R60',
      'product_quanity': 'Samsung-16GB',
      'product_image': 'img/beer_2.jpg',
    }, {
      'item_id': 3,
      'product_name': 'BEER - 3',
      'item_price': 'R50',
      'product_quanity': 'Samsung-8GB',
      'product_image': 'img/beer_3.jpg',
    }, {
      'item_id': 4,
      'product_name': 'BEER - 4',
      'item_price': 'R70',
      'product_quanity': 'Samsung-4GB',
      'product_image': 'img/beer_4.jpg',
    }

  ];

  $scope.cart = store.get('cart');

  $timeout(function() {
    updateCart();
  }, 4000);



  $scope.productdetails  =  function() {
    $scope.productdetails = $stateParams.data;
  };

  if($stateParams.data){
    $scope.productdetails();
  }

})

.controller('cartCtrl', function($rootScope, $scope, $state, $timeout, store, $http) {
  $timeout(function() {
    $scope.userDetail = $rootScope.userDetails;
  }, 1000);

  $scope.doCancel = function() {
    store.remove('cart');
    $state.go('app.products');
  };

  $scope.orderNow = function() {
    if ($scope.cart && $scope.cart.length > 0) {
       var productdetails = store.get('cart');
        localStorage.setItem('productdetails', JSON.stringify(productdetails));
        var auth = store.get('auth');
      if (auth) {
        
        $rootScope.loggedIn = true;
         $state.go('app.shipping');
      } else {
        $state.go('login');
      }
    }
  };

  $scope.cart = store.get('cart');
  $rootScope.cartValue > 0 ? $scope.deliveryCharges = 15 : $scope.deliveryCharges = 0;
  //$scope.address = store.get('location').building && store.get('location').building.length > 0 ? store.get('location').building + ', ' : '' + store.get('location').address;
})

.controller('checkoutCtrl', function($rootScope, $scope, $state, store, $timeout , $http) {

  $scope.deliveryCharges = 15 ;
  console.log("deliveryCharges:",$scope.deliveryCharges);

  $scope.goBack = function() {
    $state.go('app.products');
  };

  var init = function() {
    store.remove('cart');
    $rootScope.usersession = store.get('usersession') || {};

  };

  init();

  $scope.gotothankpage = function(){
    $state.go('checkout');
  }

  $scope.pdetails = localStorage.getItem('productdetails');
  $scope.pdetails = JSON.parse($scope.pdetails);

    if($scope.pdetails){
        var cartPrice = $scope.pdetails.map(function (i) {
            return parseFloat(i.item_price) * i.quantity;
          });

       function add(a, b) { return a + b; }
       $rootScope.cartValue = cartPrice.reduce(add, 0);
       $rootScope.cartValue > 0 ? $scope.deliveryCharges = 15 : $scope.deliveryCharges = 0;
   }

   $scope.handleStripe = function(status, response){
      console.log("response:",response);
      var shippingid = localStorage.getItem('shippingid');
    if(response.error) {
      // there was an error. Fix it.
      $scope.error = true;
      $scope.errorMessage = response.error.message;
      var params = {};
      params = $rootScope.usersession;
      params.userid = $rootScope.usersession.id;
      params.status = 0;
      //store.remove('80scart');
      var token = response.id;
    } else {      // got stripe token, now charge it or smt
      var params = {};
      //params = $scope.consultPayInfo;
      params.userid =  $rootScope.usersession.id;
      params.business_fk = $rootScope.usersession.businessId;
      params.status = 1;
      params.token = response.id;
      params.created_on = response.created;
      params.cartPrice = $rootScope.cartValue + $scope.deliveryCharges;
      params.name =  response.card.name;
      params.order_shipping_id = shippingid;
      
      //params.used = response.used;
      
      var token = response.id;

        $http.post(baseURL + 'paybill', params).success(function(res, req) {
          var items = $scope.pdetails.map(function (i) {
            return parseFloat(i.item_price) * i.quantity;
          });
         
          if (res.status == 200) {
              var orderdata = {
                'payment_id' : res.payment_id,
                'user_id' : $rootScope.usersession.id,
                'business_id' : $rootScope.usersession.businessId,
                'items' : $scope.pdetails,
                'email' : $rootScope.usersession.email,
                'firstName' : $rootScope.usersession.firstName,
                'lastName' : $rootScope.usersession.lastName,
                'totalPrice' : $rootScope.cartValue + $scope.deliveryCharges,
                'deliveryCharges' : $scope.deliveryCharges,
                'appname' : 'levoeu'
              }

               $http.post(baseURL + 'adduserorder', orderdata).success(function(res, req) {
                  if(res.status == 1){
                      store.remove('cart');
                      $scope.verifypasssuccessmsg = 'Payment successfully Done.';
                      $scope.showverifypasssuccessmsg = true;
                      $timeout(function() {
                          $scope.showverifypasssuccessmsg = false;
                          $state.go('checkout');
                      }, 3000);

                      $http.post(baseURL + 'sendOrdermail', orderdata).success(function(res, req) {
                        localStorage.removeItem('productdetails');
                        localStorage.removeItem('shippingid');
                      }).error(function() {
                        console.log("Something is sendordermail api....");
                      });

                  }else{
                    console.log("order not placed");
                  }

                }).error(function() {
                    console.log("Something is wrong....");
                });
             
          } else {
              $scope.errorMessage = 'Payment failed';
              $scope.error = true; 
              $timeout(function() {
                  $scope.error = false;
              }, 3000);
          }
      }).error(function() {
          console.log("Something is wrong....");
      });

    }
  }

})

.controller('shippingCtrl', function($rootScope, $scope, $state, $timeout, store, $http) {
  $rootScope.usersession = store.get('usersession');
   $scope.deliveryCharges = 15 ;

  $scope.shipping ={};

  $scope.saveShippingdetails =  function(ShippingForm){
    $scope.shipping.customer_id = $rootScope.usersession.id;
    if(ShippingForm.$valid){
      $http.post(baseURL + 'addshippingaddress', $scope.shipping).success(function(res, req) {
        console.log("res in shping:",res);
        if(res.status == true){
            localStorage.setItem('shippingid', res.record.insertId);
            $scope.shipsuccMsg = 'Shipping address added';
            $scope.showshipsuccMsg = true;
            $timeout(function() {
                $scope.showshipsuccMsg = false;
                $state.go('app.payment');
            }, 3000);
                     
        }else{
            $scope.shipErrMsg = 'Shipping address failed to add';
            $scope.showshipErrMsg = true;
            $timeout(function() {
                $scope.showshipErrMsg = false;
            }, 3000);
        }

      }).error(function() {
          console.log("Something is wrong....");
      });
    }
  }

});
