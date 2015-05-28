'use strict';

angular.module('buffalo')
    .controller('CommentCtrl', function($scope, $stateParams, $ionicPlatform, $state,
                                               $ionicViewSwitcher, $cordovaFile, $cordovaFileTransfer, InterfaceAPI){

        $ionicPlatform.ready(function() {
            $scope.image_uri = $stateParams.imageURI;
            $scope.lat = $stateParams.latitude;
            $scope.long = $stateParams.longitude;
            $scope.user_id = $stateParams.user_id;
        });


        $scope.retourMain = function(){
            $ionicViewSwitcher.nextDirection('back');
            $state.go("main");
        };

        $scope.envoyerPhoto = function(){

            console.log("Envoyer photo");

            var uploadOptions = {
                params : { 'upload_preset': "hfrgicap"}
            };

            $cordovaFileTransfer
                .upload("https://api.cloudinary.com/v1_1/dbqbmbcvg/image/upload", $scope.image_uri, uploadOptions)
                    .then(function(result) {
                        var comment = document.getElementById('form-comment').value;
                        var response = JSON.parse(result.response);
                        var url = response.secure_url;

                        InterfaceAPI.uploadPhoto($scope.user_id, $scope.lat, $scope.long, url, comment)
                            .then(function(data){
                                console.log("photo envoyée");
                            }, function(data){
                                console.log("erreur envois photo api");
                        });
                    }, function(err) {
                        console.log(err);
                    });

            $scope.go("main");
        };
    });

