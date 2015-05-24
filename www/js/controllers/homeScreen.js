controllers.controller('HomeScreenCtrl', function($scope, $state){
    $scope.redirectToLogin = function(){
    	console.log("redirect login");
        $state.go('login');
    };

    $scope.redirectToRegister = function(){
    	console.log("redirect register");
        $state.go('register');
    };
});
