'use strict';


angular.module('buffalo')

    .controller('MainCtrl', function($scope, $ionicPlatform, $rootScope, $cordovaDevice, $http, $state, $window,
                                     $cordovaCamera, InterfaceAPI, ngDialog, $cordovaFile,
                                     $cordovaFileTransfer, $ionicSideMenuDelegate){

        $ionicPlatform.ready(function() {
            //Vérification si l'utilisateur a déjà utilisé l'app
            //Si oui alors l'id de l'utilisateur doit être stocké dans l'app
            login();
            geoLoc();
            $scope.cards=[];
            $scope.refresh_image='img/buffalo_refresh.png';
            });

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
            InterfaceAPI.login($cordovaDevice.getUUID().toString(),$cordovaDevice.getPlatform().toString())
                .then(function(data){
                    $scope.user_score = data.score;
                    $scope.user_photos_size = data.photo_size;
                });
        };

        $scope.redirectToGallery = function(){
            $state.go('/photos/gallery');
        };

        $scope.takePicture = function(){

            var uploadOptions = {
                params : { 'upload_preset': "hfrgicap"}
            };

            $cordovaCamera.getPicture()
                .then(function(imageURI){
                    $scope.image_url = imageURI;

                    $cordovaFileTransfer
                        .upload("https://api.cloudinary.com/v1_1/dbqbmbcvg/image/upload", $scope.image_url, uploadOptions)
                            .then(function(result) {
                                var response = JSON.parse(result.response);
                                var url = response.secure_url;

                                $state.go("comment", {imageURI: url, user_id: $scope.user_id, latitude: $scope.lat, longitude: $scope.long});
                            }, function(err) {
                                console.log(err);
                            });

            }, function(err){
                console.log(err);
            }, {
                quality: 75,
                saveToPhotoAlbum: true
            });
        };

        $scope.refreshPhotos = function(){

            if ($scope.lat===undefined || $scope.long===undefined)
            {
                geoLoc();
            }
            else {
                $scope.refresh_image='img/logo_refresh.gif';
                InterfaceAPI.getPhotos($scope.user_id,$scope.lat,$scope.long) // test avec l'user ID
                    .then(function (data) {

                        if (data.length > 0) {
                            $scope.cards = [];
                            var newCard = {id: '', url: '', comment: '', score: 0};
                            angular.forEach(data, function (card) {

                                if (card.comment === null) {
                                    card.comment = '';
                                }

                                newCard = {
                                    id: card.id.toString(),
                                    url: card.s3_url.toString(),
                                    comment: card.comment.toString(),
                                    score: card.score
                                };
                                $scope.cards.push(newCard);

                            });
                            $scope.cards = $scope.cards.sort(function (a, b) {
                                return b.id - a.id;
                            });

                        }
                        else {
                            $scope.refresh_image='img/buffalo_refresh.png';
                        }
                    }, function() {

                        $scope.refresh_image='img/buffalo_refresh.png';

                    });
            }
        };

        $scope.buttonTakePhotoPressed = function(){
            document.getElementById("iconTakePhoto").src = "img/buttonCameraPressed.png";
        };

        $scope.buttonTakePhotoReleased = function(){
            document.getElementById("iconTakePhoto").src = "img/takePhoto.png";
        };

        $scope.buttonNopePressed = function(index,card_id){
            document.getElementById("iconNope").src = "img/nopeButtonPressed.png";
            $scope.cards.splice(index, 1);
            InterfaceAPI.swipeNope($scope.user_id, card_id)
                .then(function () {
                    if ($scope.cards.length <= 2) {
                        $scope.refreshPhotos();
                    }
                });
        };

        $scope.buttonNopeReleased = function(){
            document.getElementById("iconNope").src = "img/nopeButton.png";
        };

        $scope.buttonLikePressed = function(index,card_id){
            document.getElementById("iconLike").src = "img/buttonLikePressed.png";
            $scope.cards.splice(index, 1);

            InterfaceAPI.swipeNope($scope.user_id, card_id)
                .then(function () {
                    if ($scope.cards.length <= 2) {
                        $scope.refreshPhotos();
                    }
                });
        };

        $scope.buttonLikeReleased = function(){
            document.getElementById("iconLike").src = "img/likeButton.png";
        };



        function login(){

            InterfaceAPI.login($cordovaDevice.getUUID().toString(),$cordovaDevice.getPlatform().toString())
            .then( function(data) {

                    if(data.id === null){
                    sendRegistration();

                }else{
                    $scope.user_id = data.id;
                }

            });
        }

        function sendRegistration(){

            InterfaceAPI.register($cordovaDevice.getUUID().toString(),$cordovaDevice.getPlatform().toString())
                .then(function(data){
                    $scope.user_id = data.id;
                window.localStorage.user_id = data.id;

            }, function()        {
                $scope.user_id = "";
            });

        }

        function geoLoc(){


            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            function success(pos) {
                var crd = pos.coords;
                $scope.lat = crd.latitude;
                $scope.long = crd.longitude;
                $scope.refreshPhotos();
            }

            function error(err) {
                $scope.modalGPS();
            }

            navigator.geolocation.getCurrentPosition(success, error, options);

        }

        $scope.modalGPS = function () {


            ngDialog.openConfirm({
                template: 'gpsDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom'
            })
            .then(function () {
                    geoLoc();
            }, function () {
                    geoLoc();
            });

        };

});
