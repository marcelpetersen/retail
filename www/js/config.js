var env = 'local';
if(env === 'local'){
  var baseURL = 'http://localhost:2000/api/';
  var imageURL = 'http://www.createmobileshop.com/assets/';
}else if(env === 'dev'){
  var baseURL= "http://www.createmobileshop.com/api/";
  var imageURL = "http://www.createmobileshop.com/assets/";
}
