controllers.controller('MainCtrl', function($scope, $ionicPlatform, $cordovaDevice, $cordovaKeychain, $http){

    $ionicPlatform.ready(function() {
        //Vérification si l'utilisateur a déjà utilisé l'app
        //Si oui alors les identifiants de l'utilisateur (email et password) doivent être stocké dans l'app
        var email = "";
        var password = "";

        //Si ios : Stockage dans le Keychain (stockage sécurisé et encrypté)
        if($cordovaDevice.getPlatform() === "iOS"){
            var kc = new Keychain();

            kc.getForKey(function(value){
                console.log("Email fetched");
                email = value;

                kc.getForKey(function(value){
                    console.log("Password fetched");
                    password = value;
                }, function(error){
                    console.log(error)
                }, "password", "buffalo")
            }, function(error){
                console.log(error)
            }, "email", "buffalo");
        }else{
            //Sinon récupération dans le localStorage
            email = window.localStorage['email'] || "";
            password = window.localStorage['password'] || "";
        }

        //Vérification si les identifiants sont corrects avec un appel API (doit renvoyé l'id user)
        password = CryptoJS.SHA3(password).toString(CryptoJS.enc.Base64);

        $http({
            url: "http://localhost:3000/users",
            method: "GET",
            params: {email: email, password: password}
        }).error(function(data){

        }).success(function(data){
            if(data['id'] == null){
                //Redirection vers l'écran de connexion
            }else{
                //L'utilisateur est connecté
                $scope.user_id = data['id']
            }
        });

    });
});
