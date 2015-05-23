controllers.controller('MainCtrl', function($scope, $ionicPlatform, $cordovaDevice, $cordovaKeychain, $http, $state){

    $ionicPlatform.ready(function() {
        //Vérification si l'utilisateur a déjà utilisé l'app
        //Si oui alors les identifiants de l'utilisateur (email et password) doivent être stocké dans l'app
        login();
    });

    $scope.cards = [
        {name: "test", url: "http://www.menucool.com/slider/prod/image-slider-2.jpg"},
        {name: "test2", url: "http://blog.jimdo.com/wp-content/uploads/2014/01/tree-247122.jpg"}
    ];

    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
    };

    $scope.cardSwiped = function(index) {
        var newCard = // new card data
        $scope.cards.push(newCard);
    };



    function login(){
        $scope.email = "";
        $scope.password = "";

        //Si ios : Stockage dans le Keychain (stockage sécurisé et encrypté)
        if($cordovaDevice.getPlatform() === "iOS"){
            var kc = new Keychain();

            kc.getForKey(function(value){
                $scope.email = value;

                kc.getForKey(function(value){
                    $scope.password = value;

                    sendRequestLogin($scope.email, $scope.password);
                }, function(error){
                    $state.go('homeScreen');
                }, "password", "buffalo")
            }, function(error){
                $state.go('homeScreen');
            }, "email", "buffalo");
        }else{
            //Sinon récupération dans le localStorage
            $scope.email = window.localStorage['email'] || "";
            $scope.password = window.localStorage['password'] || "";
            sendRequestLogin($scope.email, $scope.password);
        }
    }

    //Vérification si les identifiants sont corrects avec un appel API (doit renvoyé l'id user)
    function sendRequestLogin(email, password){
        $http({
            url: "http://92.222.82.233/users",
            method: "GET",
            params: {email: email, password: password}
        }).error(function(data){
            $state.go('homeScreen')
        }).success(function(data){
            if(data['id'] === null){
                //Redirection vers l'écran de connexion
                $state.go("homeScreen")
                $scope.user_id = data
            }else{
                //L'utilisateur est connecté
                $scope.user_id = data['id'];
            }
        });
    }
});
