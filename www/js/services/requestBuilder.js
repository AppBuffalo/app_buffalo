'use strict';

angular.module('buffalo')
    //searching for and filtering merchants
    .service('RequestBuilder', function($http, $q) {

        function getRequestPromise(request){
            var deferred = $q.defer();

            $http(request)
            .success(function(data) {


                    deferred.resolve(data);

                }).error(function(data, status) {



                deferred.reject();


                // 404 + empty string payload = no connection
                if(status === 404 && data === ""){
                    console.log("error no connection");
                }
            });

            return deferred.promise;
        }


        return {
            'getRequestPromise' : getRequestPromise
        };

    });
