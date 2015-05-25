controllers.controller('CommentCtrl', function($scope, $stateParams, $ionicPlatform, $state,
                                               $ionicViewSwitcher, $cordovaFile, $cordovaFileTransfer){

    $ionicPlatform.ready(function() {
        $scope.image_uri = $stateParams.imageURI;
        document.getElementById("form-comment").focus();
    });

    $scope.ajouterCommentaire = function(){
        if(document.getElementById("form-comment").style.visibility === "visible"){
            document.getElementById("form-comment").style.visibility = "hidden";
        }else{
            document.getElementById("form-comment").style.visibility = "visible";
            document.getElementById("form-comment").click().focus();
        }
    };

    $scope.retourMain = function(){
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };

    $scope.envoyerPhoto = function(){
        console.log("Envois Photo");

        var uploadOptions = {
            params : { 'upload_preset': "hfrgicap"}
        };

        $cordovaFileTransfer
            .upload("cloudinary://319843273551643:cFGMpedaTrczjCgQUhgUmbQLHCw@dbqbmbcvg", $scope.image_uri, uploadOptions)
            .then(function(result) {
                console.log("OK");
            }, function(err) {
                console.log(err);
            });

    };
});

