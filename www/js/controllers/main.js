controllers.controller('MainCtrl', function($scope, $ionicPlatform, $rootScope, $cordovaDevice,
                                            $http, $state, $window, $cordovaCamera, InterfaceAPI){

    $ionicPlatform.ready(function() {
        //Vérification si l'utilisateur a déjà utilisé l'app
        //Si oui alors l'id de l'utilisateur doit être stocké dans l'app
        login();
        geoLoc();
        $scope.refreshPhotos();





        setTimeout(function(){
            document.getElementById("score-1").innerHTML = 56456464;
        }, 1000);

    });

    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
    };

    $scope.cardSwipedLeft = function(card_id) {

        InterfaceAPI.swipeNope($scope.user_id,card_id)
            .then( function() {


                console.log('NOPE');


        });

    };

    $scope.cardSwipedRight = function(card_id) {

        InterfaceAPI.swipeLike($scope.user_id,card_id)
            .then( function() {

                console.log('LIKE');

            });


    };

    $scope.redirectToGallery = function(){
        $state.go('/photos/gallery');
    };

    $scope.takePicture = function(){
        $cordovaCamera.getPicture().then(function(imageURI){
            console.log(imageURI);
            $scope.image_url = imageURI;
            $state.go("comment", {imageURI: imageURI})
        }, function(err){
            console.log(err);
        }, {
            quality: 75,
            saveToPhotoAlbum: true
        })
    };


    $scope.refreshPhotos = function(){
        InterfaceAPI.getPhotos($scope.user_id,5,4.5) // test avec l'user ID
        //InterfaceAPI.getPhotos(1,5,4.5) // test avec un user ID en dur
            .then( function(data) {

                console.log("GETPHOTOS :   " + JSON.stringify(data, null, 4));

                if (data.length>0) {
                    console.log("dataNONnull");

                    $scope.cards = [];
                    var newCard = {id: '', url: '', comment: '', score: 0};
                    angular.forEach(data, function (card) {

                        newcard = {id: card.id.toString(), url: card.s3_url.toString(), comment: 'test', score: 0};
                        console.log("NEWCARD :   " + JSON.stringify(newcard, null, 4));
                        $scope.cards.push(newcard);
                        //console.log( card2.comment.toString());
                        //console.log( card2.score.toString());
                    });
                    console.log("SCOPE.CARDS :   " + JSON.stringify($scope.cards, null, 4));

                }
                else
                {
                    console.log("datanull");
                    $scope.cards = [
                        {id: 1, url: "http://www.hapshack.com/images/DibjY.jpg", comment: "Sarek Zamel", score: 125},
                        {id: 2, url: "http://www.hapshack.com/images/k5yns.jpg", comment: "Dédicace à tous les arabes", score: 69}
                    ];
                }






            });
    };

    $scope.uploadPhotos = function(){
        InterfaceAPI.uploadPhoto($scope.user_id,5,4.5,'http://i.imgur.com/mheXQuK.jpg?1')
            .then( function(data) {
                console.log("uploadPHOTOS :   "+JSON.stringify(data, null, 4));

            });
    };


    function login(){

        InterfaceAPI.login($cordovaDevice.getUUID().toString(),$cordovaDevice.getPlatform().toString())
        .then( function(data) {

                if(data['id'] === null){
                sendRegistration();

            }else{
                $scope.user_id = data['id'];
            }

        });
    }

    function sendRegistration(){

        console.log("register");

        InterfaceAPI.register($cordovaDevice.getUUID().toString(),$cordovaDevice.getPlatform().toString())
            .then(function(data){
                $scope.user_id = data['id'];
            window.localStorage['user_id'] = data['id'];

        }, function(data)        {
            console.log(data);
            $scope.user_id = "";
        });

    }

    function geoLoc(){
        $window.navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function() {
                $scope.lat = position.coords.latitude;
                $scope.long = position.coords.longitude;
            });
        });
    }


});
