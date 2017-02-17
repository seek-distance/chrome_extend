app.config(function( $stateProvider , $urlRouterProvider ) {
	$urlRouterProvider.otherwise('/home');
	$stateProvider.state('home',{
		url:'/home',
		views:{
			'':{
				templateUrl:'dist/tpls/home.html',
				controller:'homeCtr'
			},
			'nav@home':{
				templateUrl:'dist/tpls/nav.html',
				controller:'navCtr'
			},
			'content@home':{
				templateUrl:'dist/tpls/userMan.html',
				controller:'userManCtr'
			}
		}
	})
	.state('home.classifyMan',{
		url:'/classifyMan',
		views:{
			'content@home':{
				templateUrl:'dist/tpls/classifyMan.html',
				controller:'classifyManCtr'
			}
		}
	})
	.state('login',{
		url:'/login/:update',
		templateUrl:'dist/tpls/login.html',
		controller:'loginCtr'
	})
})


