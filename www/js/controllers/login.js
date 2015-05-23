controllers.controller('LoginCtrl', function($scope, $http, $state, $cordovaDevice, $cordovaKeychain){

    //Connexion
    $scope.login = function(user){

        if(isEmpty(user['password']) || isEmpty(user['email'])){
            $scope.errors = "Tous les champs doivent êtres remplis";
        }else{
            var password = CryptoJS.SHA3(user['password']).toString(CryptoJS.enc.Base64);
            var email = user['email'];

            $http({
                url: "http://92.222.82.233/users",
                method: "GET",
                params: {email: email, password: password}
            }).error(function(data){
                $scope.errors = "Erreur réseau";
            }).success(function(data){
                if(data['id'] === null){
                    //Redirection vers l'écran de connexion
                    $scope.errors = "Identifiants invalides"
                }else{
                    //L'utilisateur est connecté, enregistrement de ses identifiants dans le Keychain ou LocalStorage
                    if($cordovaDevice.getPlatform() === "iOS"){
                        var kc = new Keychain();
                        kc.setForKey(function(){}, function(){}, 'email', 'buffalo', email);
                        kc.setForKey(function(){
                            $state.go('main');
                        }, function(){}, 'password', 'buffalo', password);
                    }else{
                        window.localStorage['email'] = email;
                        window.localStorage['password'] = password;
                        $state.go('main');
                    }
                }
            });
        }

    };

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

});
