controllers.controller('RegisterCtrl', function($scope, $http, $state, $cordovaDevice, $cordovaKeychain){

    //Inscription
    $scope.register = function(user){
        if(isEmpty(user['password']) || isEmpty(user['email'])){
            $scope.errors = "Tous les champs doivent êtres remplis";
        }else{
            var password = CryptoJS.SHA3(user['password']).toString(CryptoJS.enc.Base64);
            var email = user['email'];
            var device_id = $cordovaDevice.getUUID();
            var device_type = $cordovaDevice.getPlatform();

            console.log(password);
            console.log(email);
            console.log(device_id);
            console.log(device_type);

            $http({
                url: "http://92.222.82.233/users",
                method: "POST",
                params: {email: email, password: password, device_id: device_id, device_type: device_type}
            }).error(function(data){
                $scope.errors = "Erreur réseau";
            }).success(function(data){
                if(data['id'] === null){
                    //Redirection vers l'écran de connexion
                    $scope.errors = "Erreur à l'Inscription"
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
