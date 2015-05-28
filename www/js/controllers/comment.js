'use strict';

angular.module('buffalo')
    .controller('CommentCtrl', function($scope, $stateParams, $ionicPlatform, $state,
                                               $ionicViewSwitcher, $cordovaFile, $cordovaFileTransfer, InterfaceAPI){

        $ionicPlatform.ready(function() {
            $scope.image_uri = $stateParams.imageURI;
            $scope.lat = $stateParams.latitude;
            $scope.long = $stateParams.longitude;
            $scope.user_id = $stateParams.user_id;

            console.log("Image Uri : " + $scope.image_uri);
        });


    $scope.retourMain = function(){
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };

    $scope.envoyerPhoto = function(){
        InterfaceAPI.uploadPhoto($scope.user_id, $scope.lat, $scope.long, $scope.image_uri, '')
            .then(function(data){
                console.log("photo envoyée");
                $state.go("main");
            }, function(data){
                console.log("erreur envois photo api");
                $state.go("main");
            });

    };

});

