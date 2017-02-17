var app=angular.module('app', ['ui.router']);

app.controller('homeCtr', function($scope,log,$state){
	$scope.username=sessionStorage.getItem('username');
	/*log.vail().success(function(data){
		if (!data.haslogin || !$scope.username) {
			$state.go('login');
		}
	})*/
	
	$scope.exit=function(){
		log.out();
		sessionStorage.removeItem("username");
	}
	$scope.updatePwd=function(){

	}
})

app.controller('navCtr', function($scope,$location){	
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

app.controller('loginCtr',function($scope,$state,log){
	$scope.success=true;
	$scope.submit=function(){
		$scope.data={name:$scope.username,password:$scope.password};		
		log.in($scope.data).success(function(data){
			if(data.msg=="login ok"){
				sessionStorage.setItem("username",$scope.username);
				$scope.success=true;
				$state.go('home');
			}else{
				$scope.success=false;
			}
		})
	}	
})
app.controller('userManCtr',function($scope,user){
	$scope.user=[];
	$scope.getUser=function(){
		user.get().success(function(data){
			$scope.user=data;
		})
	}

	$scope.getUser();
	$scope.del=function(index){
		var isdel=confirm("是否删除该用户");		
		if(isdel){
			var data={name:$scope.user[index].name}
			user.del(data)
		}
	}
	
	$scope.add=function(){
		var name=prompt("输入用户名","");
		var isManager=confirm("是否为管理员");
		var data={name:name};
		if(isManager)	data.role='admin'
		user.add(data);
		$scope.getUser();
	}

})

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
				controller:function($rootScope){
					
				}
			}
		}
	})
	.state('login',{
		url:'/login',
		templateUrl:'dist/tpls/login.html',
		controller:'loginCtr'
	})
})



app.factory('log', function($http){
	return {
		in:function(data){
			return $http({
				method:'post',
				url:'http://www.jymao.com/ds/login',
				data:data
			})
		},
		out:function(){
			$http({
				method:'post',
				url:'http://www.jymao.com/ds/logout'
			})
		},
		vail:function(){
			return $http({
				method:'get',
				url:'http://www.jymao.com/ds/has-login'
			})
		}
	};
})

app.factory('user', function($http){
	return{
		get:function(){
			return $http({
				method:'get',
				url:'http://www.jymao.com/ds/g/User'
			})
		},
		del:function(data){
			return $http({
				method:'post',
				url:'http://www.jymao.com/ds/user',
				data:data
			})
		},
		add:function(data){
			return $http({
				method:'post',
				url:'http://www.jymao.com/ds/user',
				data:data
			})
		}
	}
})

app.factory('classify', function($http){
	var url='http://www.jymao.com/ds/g/Category';
	return function(data){
		return $http({
			method:'post',
			url:url,
			data:data
		})
	}
})



/*
管理员账号:  admin   密码: 154146

接口: 
登录: POST /ds/login        data: name:****, password:******
登出: POST /ds/logout

管理员权限下
获取用户：/ds/g/User
添加新用户: POST /ds/user  data:   name:****, role:admin(不填表示普通用户)
修改密码: PUT /ds/user/new-password       data:      newPwd:****
删除用户: DELETE /ds/user 	data: name:*****

分类接口:
得到分类: GET /ds/g/Category 一个category    {name:***, words:['***','****']}
修改分类: PUT /ds/category  data:  name:****, words:["***", "***"]
删除分类: DELETE /ds/category data: name:****

分类更改后, 大致上1个小时左右, 后台会把分类应用到已有的数据上. 

用户管理 ,主要是 添加用户, 删除用户, 生成初始密码    
分类管理, 主要是 添加/删除分类,  每个分类, 下面有特征词, 可以添加/删除特征词  
(后台会在商品标题里查找分类的特征词, 找到后, 就把该商品归到该分类里)
*/