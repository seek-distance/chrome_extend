var app=angular.module('app', ['ui.router']);

app.config(['$httpProvider', function($httpProvider,$injector) {
  	$httpProvider.defaults.withCredentials = true;
}])

app.controller('index', function($scope,log,$state){	
	log.vail().success(function(data){
		if (!data.hasLogin && !sessionStorage.getItem('username')) {
			$state.go('login');
		}
	})
})

app.controller('homeCtr', function($scope,log,$state){
	log.vail().success(function(data){
		if (data.hasLogin) {
			$scope.username=data.name;
		}		
	})
	$scope.exit=function(){
		log.out().success(function(){
			sessionStorage.removeItem("username");
			$state.go('login');
		})		
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

app.controller('loginCtr',function($scope,$state,log,$stateParams){
	$scope.success=true;
	if($stateParams.update=="update"){
		$scope.update=true;
	}else{
		$scope.update=false;
	}

	$scope.updatePwd=function(){
		var data={newPwd:$scope.newPwd,oldPwd:$scope.oldPwd};
		log.update(data).success(function(data){
			$state.go('home');
		}).error(function(){
			console.log(1)
			alert("原密码错误")
		})
	}

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
		}).error(function(){
			$scope.success=false;
		})
	}
})
app.controller('userManCtr',function($scope,user){
	$scope.user=[];
	user.get().success(function(data){
		$scope.user=data;
	})

	$scope.del=function(index){
		var isdel=confirm("是否删除该用户");		
		if(isdel){
			var data={name:$scope.user[index].name};
			user.del(data).success(function(){
				user.get().success(function(data){
					$scope.user=data;
				})
			})			
		}
	}

	$scope.add=function(){
		var data={name:$scope.newUser};
		if($scope.isadmin)	data.role='admin'
		user.add(data).success(function(){
			user.get().success(function(data){
				$scope.user=data;
			})
			$scope.newUser="";
		});		
	}

})

app.controller('classifyManCtr',function($scope,classify){
	$scope.method="update";
	$scope.classify=[];
	$scope.inClass=[];
	$scope.showAlert=false;
	classify.get().success(function(data){
		$scope.classify=data;
	})
	$scope.update=function(index){
		$scope.method="update";
		$scope.showAlert=true;
		$scope.class=$scope.classify[index].name;
		$scope.inClass=$scope.classify[index].words.slice(0);		
	}
	$scope.del=function(index){
		var data={name:$scope.classify[index].name};
		classify.del(data).success(function(){
			classify.get().success(function(data){
				$scope.classify=data;
			})
		});
	}
	$scope.delInClass=function(index){
		$scope.inClass.splice(index,1);
	}
	$scope.addItem=function(){
		$scope.inClass.push('');
	}
	$scope.cancel=function(){
		$scope.showAlert=false;
		classify.get().success(function(data){
			$scope.classify=data;
		})
	}
	$scope.updateConfirm=function(){
		$scope.showAlert=false;
		var data={name:$scope.class,words:$scope.inClass};		
		console.log(data);
		classify.update(data).success(function(){
			classify.get().success(function(data){
				$scope.classify=data;
			})
		})
	}
	$scope.addClass=function(){
		$scope.method="add";
		$scope.showAlert=true;
		$scope.class='';
		$scope.inClass=[''];
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



app.factory('log', function($http){
	return {
		in:function(data){
			return $http({
				method:'post',
				url:'http://tm.jymao.com/ds/login',
				data:data
			})
		},
		out:function(){
			return $http({
				method:'post',
				url:'http://tm.jymao.com/ds/logout'
			})
		},
		vail:function(){
			return $http({
				method:'get',
				url:'http://tm.jymao.com/ds/has-login'
			})
		},
		update:function(data){
			return $http({
				method:'post',
				url:'http://tm.jymao.com/ds/user/new-password',
				data:data
			})
		}
	};
})

app.factory('user', function($http){
	return{
		get:function(){
			return $http({
				method:'get',
				url:'http://tm.jymao.com/ds/g/User'
			})
		},
		del:function(data){
			return $http({
				method:'DELETE',
				url:'http://tm.jymao.com/ds/user',
				data:data
			})
		},
		add:function(data){
			return $http({
				method:'post',
				url:'http://tm.jymao.com/ds/user',
				data:data
			})
		},
		put:function(data){
			return $http({
				method:'PUT',
				url:'http://tm.jymao.com/ds/user/new-password',
				data:data
			})
		}
	}
})

app.factory('classify', function($http){
	var url='http://tm.jymao.com/ds/category';
	return {
		get:function(){
			return $http({
				method:'get',
				url:'http://tm.jymao.com/ds/g/Category'
			})
		},
		update:function(data){
			return $http({
				method:'post',
				url:url,
				data:data
			})
		},
		del:function(data){
			return $http({
				method:'DELETE',
				url:url,
				data:data
			})
		}
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
修改分类: post /ds/category  data:  name:****, words:["***", "***"]
删除分类: DELETE /ds/category data: name:****

分类更改后, 大致上1个小时左右, 后台会把分类应用到已有的数据上. 

用户管理 ,主要是 添加用户, 删除用户, 生成初始密码    
分类管理, 主要是 添加/删除分类,  每个分类, 下面有特征词, 可以添加/删除特征词  
(后台会在商品标题里查找分类的特征词, 找到后, 就把该商品归到该分类里)
*/