controllers.controller('MainCtrl', function($scope, $ionicPlatform, $rootScope, $cordovaDevice,
                                            $http, $state, $window, $cordovaCamera){

    $ionicPlatform.ready(function() {
        //Vérification si l'utilisateur a déjà utilisé l'app
        //Si oui alors l'id de l'utilisateur doit être stocké dans l'app
        //login();
        //geoLoc();
    });

    $scope.cards = [
        {id: 1, url: "http://www.hapshack.com/images/DibjY.jpg", comment: "Sarek Zamel", score: 125},
        {id: 2, url: "http://www.hapshack.com/images/k5yns.jpg", comment: "Dédicace à tous les arabes", score: 69}
    ];

    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
    };

    $scope.cardSwiped = function(index) {
        var newCard = // new card data
        $scope.cards.push(newCard);
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


    function login(){
        //Récupération de l'id dans le localStorage
        $rootScope.user_id = window.localStorage['user_id'] || "";

        //Vérification de la corresponde entre l'id et les informations du téléphone (device_id et device_type)
        $http({
            url: "http://92.222.82.233/users",
            method: "GET",
            params: {device_id: $cordovaDevice.getUUID().toString(), device_type: $cordovaDevice.getPlatform().toString()}
        }).error(function(data){
            console.log(data);
        }).success(function(data){
            if(data['id'] === $rootScope.user_id){
                $rootScope.user_id = data['id'];
                console.log("User loggé")
            }else{
                //L'utilisateur n'existe pas ou ses infos sont incorrects
                //Dans ce cas on enregistre un nouvel utilisateur
                sendRegistration();
            }
        });
    }

    function sendRegistration(){
        $http({
            url: "http://92.222.82.233/users",
            method: "POST",
            params: {device_id: $cordovaDevice.getUUID().toString(), device_type: $cordovaDevice.getPlatform().toString()}
        }).error(function(data){
            console.log(data);
            $rootScope.user_id = "";
        }).success(function(data){
            $rootScope.user_id = data['id'];
            window.localStorage['user_id'] = data['id'];
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
