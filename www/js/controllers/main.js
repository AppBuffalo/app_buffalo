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
        {id: 2, url: "http://www.hapshack.com/images/k5yns.jpg", comment: "Dédicace à tous les arabes", score: 69},
        {id: 3, url: "http://www.hapshack.com/images/DibjY.jpg", comment: "Sarek Zamel", score: 125},
        {id: 4, url: "http://www.hapshack.com/images/k5yns.jpg", comment: "Dédicace à tous les arabes", score: 69},
        {id: 5, url: "http://www.hapshack.com/images/DibjY.jpg", comment: "Sarek Zamel", score: 125},


    ];

    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
    };

    $scope.cardSwiped = function(index) {
        var newCard = // new card data
        $scope.cards.push(newCard);
        console.log("INDEX:"+index);
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
