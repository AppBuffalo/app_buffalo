'use strict';

angular.module('buffalo')
    //searching for and filtering merchants
    .service('RequestBuilder', function($http, $q) {

        function getRequestPromise(request){
            var deferred = $q.defer();


            console.log(JSON.stringify(request, null, 4));

            $http(request)
            .success(function(data) {


                    deferred.resolve(data);

                }).error(function(data, status) {



                deferred.reject(message);

                if (status in httpErrorMessages) {
                    console.log("error");
                }

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
