'use strict';

angular.module('buffalo')
    .controller('CommentCtrl', function($scope, $stateParams, $ionicPlatform, $state,
                                               $ionicViewSwitcher, $cordovaFile, $cordovaFileTransfer, InterfaceAPI){

        $ionicPlatform.ready(function() {
            $scope.image_uri = $stateParams.imageURI;
            $scope.lat = $stateParams.latitude;
            $scope.long = $stateParams.longitude;
            $scope.user_id = $stateParams.user_id;
            $scope.images = [];


            console.log('URL' +$scope.image_uri);
        });



        onImageSuccess($scope.image_uri);

        $scope.urlForImage = function(imageName) {
            var name = imageName.substr(imageName.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;
            return trueOrigin;
        }

                function onImageSuccess(fileURI) {
                    createFileEntry(fileURI);
                }

                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }

                // 5
                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;

                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                            fileEntry.copyTo(
                                fileSystem2,
                                newName,
                                onCopySuccess,
                                fail
                            );
                        },
                        fail);
                }

                // 6
                function onCopySuccess(entry) {
                    $scope.$apply(function () {
                        $scope.images.push(entry.nativeURL);
                    });
                }

                function fail(error) {
                    console.log("fail: " + error.code);
                }

                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i=0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }

            };























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
// TODO V2                        var comment = document.getElementById('form-comment').value;
                        var response = JSON.parse(result.response);
                        var url = response.secure_url;

                        InterfaceAPI.uploadPhoto($scope.user_id, $scope.lat, $scope.long, url, '')
                        //TODO V2 InterfaceAPI.uploadPhoto($scope.user_id, $scope.lat, $scope.long, url, comment)
                            .then(function(data){
                                console.log("photo envoyée");
                            }, function(data){
                                console.log("erreur envois photo api");
                        });
                    }, function(err) {
                        console.log(err);
                    });

            //$scope.go("main");
        };
    });

