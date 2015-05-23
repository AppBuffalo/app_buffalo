controllers.controller('HomeScreenCtrl', function($scope, $state){
    $scope.redirectToLogin = function(){
        $state.go('login');
    }
});
