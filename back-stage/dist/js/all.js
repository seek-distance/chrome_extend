var app=angular.module('app', ['ui.router']);

app.controller('navCtl', function($scope,$location){	
	$scope.nav=[
		{
			sref:'home',
			on:true,
			class:'fa-user',
			content:'用户管理'
		},
		{
			sref:'home.classifyMan',
			on:false,
			class:'fa-tasks',
			content:'分类管理'
		}
	];
	if($location.$$url.indexOf('/classifyMan')==-1){
		$scope.nav[0].on=true;
		$scope.nav[1].on=false;
	}else{
		$scope.nav[0].on=false;
		$scope.nav[1].on=true;
	}

	$scope.setOn=function(index){
		if ($scope.nav[index].on == true) return;
		for (var i = 0; i < $scope.nav.length; i++) {
			$scope.nav[i].on=false;
		}
		$scope.nav[index].on=true;
	}
})


app.config(function( $stateProvider , $urlRouterProvider ) {
	$urlRouterProvider.otherwise('/home');
	$stateProvider.state('home',{
		url:'/home',
		views:{
			'':{
				templateUrl:'dist/tpls/home.html'
			},
			'nav@home':{
				templateUrl:'dist/tpls/nav.html',
				controller:'navCtl'
			},
			'content@home':{
				templateUrl:'dist/tpls/userMan.html'
			}
		}
	})
	.state('home.classifyMan',{
		url:'/classifyMan',
		views:{
			'content@home':{
				templateUrl:'dist/tpls/classifyMan.html',
				controller:function($rootScope){
					
				}
			}
		}
	})
	.state('login',{
		url:'/login',
		templateUrl:'dist/tpls/login.html'
	})
})