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