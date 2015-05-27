'use strict';

angular.module('buffalo')

    .controller('MainCtrl', function($scope, $ionicPlatform, $rootScope, $cordovaDevice, $http, $state, $window, $cordovaCamera, InterfaceAPI, ngDialog, $ionicSideMenuDelegate){

        $ionicPlatform.ready(function() {
            //Vérification si l'utilisateur a déjà utilisé l'app
            //Si oui alors l'id de l'utilisateur doit être stocké dans l'app
            login();
            geoLoc();
            $scope.cards=[];
            });

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
            InterfaceAPI.login($cordovaDevice.getUUID().toString(),$cordovaDevice.getPlatform().toString())
                .then(function(data){
                    $scope.user_score = data.score;
                    $scope.user_photos_size = data.photo_size;
                });
        };

        $scope.cardSwipedLeft = function(index,card_id) {


            $scope.cards.splice(index, 1);

            //InterfaceAPI.swipeNope(7,card_id)
            InterfaceAPI.swipeNope($scope.user_id,card_id)
                .then( function() {
                    if($scope.cards.length<=2)
                    {
                        $scope.refreshPhotos();
                    }
            });
        };

        $scope.cardSwipedRight = function(index,card_id) {

            $scope.cards.splice(index, 1);

            //InterfaceAPI.swipeLike(7,card_id)
            InterfaceAPI.swipeLike($scope.user_id,card_id)
                .then( function() {
                    if($scope.cards.length<=2)
                    {
                        $scope.refreshPhotos();
                    }

                });
        };

        $scope.redirectToGallery = function(){
            $state.go('/photos/gallery');
        };

        $scope.takePicture = function(){
            $cordovaCamera.getPicture().then(function(imageURI){
                console.log(imageURI);
                $scope.image_url = imageURI;
                $state.go("comment", {imageURI: imageURI, user_id: $scope.user_id, latitude: $scope.lat, longitude: $scope.long});
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
                //geoLoc();
            }
            else {
                InterfaceAPI.getPhotos($scope.user_id,$scope.lat,$scope.long) // test avec l'user ID
                //InterfaceAPI.getPhotos(7, $scope.lat, $scope.long) // test avec un user ID en dur
                    .then(function (data) {

    //                console.log("GETPHOTOS :   " + JSON.stringify(data, null, 4));

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
                                //console.log("NEWCARD :   " + JSON.stringify(newcard, null, 4));
                                $scope.cards.push(newCard);

                            });
                            //console.log("SCOPE.CARDS :   " + JSON.stringify($scope.cards, null, 4));
                            $scope.cards = $scope.cards.sort(function (a, b) {
                                return b.id - a.id;
                            });
                            //console.log("SCOPE.CARDS :   " + JSON.stringify($scope.cards, null, 4));

                        }
                        else {

                        }
                    });
            }
        };

        $scope.uploadPhotos = function(){
            InterfaceAPI.uploadPhoto($scope.user_id,$scope.lat, $scope.long,'http://i.imgur.com/mheXQuK.jpg?1','')
                .then( function(data) {
                    console.log("uploadPHOTOS :   "+JSON.stringify(data, null, 4));

                });
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

            }, function(data)        {
                console.log(data);
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
                //$scope.uploadPhotos();
                $scope.refreshPhotos();
            }

            function error(err) {
                console.warn('ERROR(' + err.code + '): ' + err.message);
                $scope.modalGPS();
            }

            navigator.geolocation.getCurrentPosition(success, error, options);

        }

        $scope.modalGPS = function () {


            console.log("called");


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
