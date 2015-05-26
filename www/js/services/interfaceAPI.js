/**
 * Created by Thomas on 25/05/2015.
 */
'use strict';

angular.module('buffalo')
    .service('InterfaceAPI', function(RequestBuilder) {


        var USER_API_ENDPOINT = 'http://92.222.82.233';

        function login(UUID, platform){
            var params = { 'device_id' : UUID, 'device_type' : platform };

            return RequestBuilder.getRequestPromise({

                method         : 'GET',
                url            : USER_API_ENDPOINT + '/users',
                params         : params
            });
        }

        function register(UUID, platform){
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : USER_API_ENDPOINT + '/users',
                data           : {
                    'device_id'      : UUID,
                    'device_type'      : platform
                }
            });
        }

        function swipeLike(userID, imageID){
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : USER_API_ENDPOINT + '/users/'+userID+'/like/'+imageID
            });
        }
        function swipeNope(userID, imageID){
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : USER_API_ENDPOINT + '/users/'+userID+'/dislike/'+imageID
            });
        }


        function getPhotos(userID, latitude, longitude){
            var params = { 'user_id' : userID, 'longitude' : longitude, 'latitude' : latitude };

            return RequestBuilder.getRequestPromise({

                method         : 'GET',
                url            : USER_API_ENDPOINT + '/photos',
                params         : params

            });
        }

        function uploadPhoto(userID, latitude, longitude,url,commentaire){

            return RequestBuilder.getRequestPromise({

                method         : 'POST',
                url            : USER_API_ENDPOINT + '/photos',
                data           : {
                    'user_id'      : userID,
                    'lat'     : latitude,
                    'long'    : longitude,
                    's3_url'       : url,
                    'comment' : commentaire
                }

            });
        }




        return {
            'login'      : login,
            'swipeNope'  : swipeNope,
            'swipeLike'  : swipeLike,
            'register'   : register,
            'getPhotos'  : getPhotos,
            'uploadPhoto': uploadPhoto
        };

    });