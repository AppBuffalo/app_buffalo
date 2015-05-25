controllers.controller('MainCtrl', function($scope, $ionicPlatform, $rootScope, $cordovaDevice,
                                            $http, $state, $window, $cordovaCamera, InterfaceAPI){

    $ionicPlatform.ready(function() {
        //Vérification si l'utilisateur a déjà utilisé l'app
        //Si oui alors l'id de l'utilisateur doit être stocké dans l'app
        login();
        geoLoc();
        setTimeout(function(){
            document.getElementById("score-1").innerHTML = 56456464;
        }, 1000);
    });

    $scope.cards = [
        {id: 1, url: "http://www.hapshack.com/images/DibjY.jpg", comment: "Sarek Zamel", score: 125},
        {id: 2, url: "http://www.hapshack.com/images/k5yns.jpg", comment: "Dédicace à tous les arabes", score: 69}
    ];

    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
    };

    $scope.cardSwipedLeft = function(card_id) {
        InterfaceAPI.swipeNope($rootScope.user_id,card_id)
            .then( function() {


                console.log('NOPE');


        });

    };

    $scope.cardSwipedRight = function(card_id) {
        InterfaceAPI.swipeLike($rootScope.user_id,card_id)
            .then( function() {

                console.log('LIKE');

            });


    };

    $scope.redirectToGallery = function(){
        $state.go('/photos/gallery');
    };

    $scope.takePicture = function(){
       console.log("take a picture and sell it to his parents")
    };


    function login(){

        InterfaceAPI.login($cordovaDevice.getUUID().toString(),$cordovaDevice.getPlatform().toString())
        .then( function(data) {

                if(data['id'] === null){
                sendRegistration();

            }else{
                $rootScope.user_id = data['id'];
            }

        });
    }

    function sendRegistration(){

        console.log("register");

        InterfaceAPI.register($cordovaDevice.getUUID().toString(),$cordovaDevice.getPlatform().toString())
            .then(function(data){
                $rootScope.user_id = data['id'];
            window.localStorage['user_id'] = data['id'];

        }, function(data)        {
            console.log(data);
            $rootScope.user_id = "";
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
