app.config(function($stateProvider, $urlRouterProvider) {

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
    .state('/photos/camera', {
        url: '/photos/camera',
        controller: 'CameraCtrl'
      })
    .state('/photos/gallery', {
      url: '/photos/gallery',
      templateUrl: '/templates/photos/gallery.html',
      controller: 'GalleryCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main');

});
