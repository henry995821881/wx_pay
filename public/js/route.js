/**
 * Created by pmcc on 16/10/10.
 */
//配置ip
var serverIP = "http://59.110.41.70/";

var routeApp = angular.module('routeApp',['ngRoute','ngStorage']);
    routeApp.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
        $routeProvider.when('/',{templateUrl:'views/main.html',controller:'mainApp'})
            .when('/products',{templateUrl:'views/products.html',controller:'productsCtrl'})
            .when('/product1/details',{templateUrl:'views/details1.html',controller:'details1Ctrl'})
            .when('/product2/details',{templateUrl:'views/details2.html',controller:'details1Ctrl'})
            .when('/product3/details',{templateUrl:'views/details3.html',controller:'details1Ctrl'})
            .when('/product1/buy:productId',{templateUrl:'views/buy1.html',controller:'buyCtrl'})
            .when('/product2/buy:productId',{templateUrl:'views/buy2.html',controller:'buyCtrl'})
            .when('/product3/buy:productId',{templateUrl:'views/buy3.html',controller:'buyCtrl'})
            .when('/product/pay',{templateUrl:'views/pay.html',controller:'payCtrl'})
            .when('/product/topay',{templateUrl:'views/topay.html',controller:'topayCtrl'})
            .when('/about',{templateUrl:'views/about.html'})
            .otherwise({redirectTo:'/'});
    }]);
