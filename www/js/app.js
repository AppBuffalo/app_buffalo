'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('buffalo', ['ionic', 'ngCordova', 'ngDialog', 'ui.bootstrap'])


    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl'
            })
            .state('comment', {
                url: '/comment',
                templateUrl: 'templates/comment.html',
                controller: 'CommentCtrl',
                params: {'imageURI': null, 'user_id': null,  'latitude': null, 'longitude': null}
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/main');

    })
    .run(function($ionicPlatform,$window) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
                $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            StatusBar.hide();
        });
    });


