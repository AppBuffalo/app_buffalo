'use strict';

angular.module('buffalo')
    //searching for and filtering merchants
    .service('RequestBuilder', function($http, $q, $rootScope) {

        var errorMessage = {
            defaultMsg : [ {user_msg : 'Oops. There was an error with your request.'} ],
            noConnection : [ {user_msg : 'Oops. We lost you! Please check your internet connection and try again.'} ]
        };

        var httpErrorMessages = {
            500 : errorMessage.defaultMsg,
            502 : errorMessage.noConnection,
            504 : errorMessage.noConnection,
            0   : errorMessage.noConnection
        };

        function isDefined(variable){
            return typeof variable !== "undefined";
        }

        function getRequestPromise(request){
            var deferred = $q.defer();


            $http(request)
            .success(function(data) {

                    deferred.resolve(data);

                }).error(function(data, status) {

                    var message = isDefined(data.message) ? data.message : errorMessage.defaultMsg;

                if(request.disableErrorHandler){
                    data.message = message;
                    deferred.reject(data);
                    return;
                }

                deferred.reject(message);

                if (status in httpErrorMessages) {
                    console.log("error");
                }

                // 404 + empty string payload = no connection
                if(status === 404 && data === ""){
                    console.log("erreur no connection");
                }

            });

            return deferred.promise;
        }


        return {
            'getRequestPromise' : getRequestPromise
        };

    });
