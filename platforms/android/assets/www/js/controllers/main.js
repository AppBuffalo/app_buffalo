controllers.controller('MainCtrl', function($scope, $ionicPlatform, $cordovaDevice, $cordovaKeychain){
    $ionicPlatform.ready(function() {
        //Vérification si l'utilisateur a déjà utilisé l'app
        //Si oui alors les identifiants de l'utilisateur (username et password) doivent être stocké dans l'app

        //Si ios : Stockage dans le Keychain (stockage sécurisé et encrypté)
        if($cordovaDevice.getPlatform() === "iOS"){
            $cordovaKeychain.getForKey('username', 'buffalo').then(function(value){
                console.log(value);
            }, function(error){
                console.log(error);
            })
        }
        //Sinon stockage dans le localStorage
        else{

        }

    });
});
