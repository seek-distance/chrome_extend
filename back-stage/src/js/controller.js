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
