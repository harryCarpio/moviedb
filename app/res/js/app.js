'use strict';

var movieApp = angular.module('movieApp', [
  'ngRoute',
  'ngAnimate',
  'ngStorage',
  'xeditable',
  'movieControllers'

]);

movieApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

movieApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/movies', {
      templateUrl: 'partials/movie-list.html',
      controller: 'MovieCtrl'
    }).
    when('/movies/new', {
      templateUrl: 'partials/movie-add.html',
      controller: 'MovieCtrl'
    }).
    when('/movies/:movieId', {
      templateUrl: 'partials/movie-detail.html',
      controller: 'MovieCtrl'
    }).
    when('/movies/:movieId/edit', {
      templateUrl: 'partials/movie-edit.html',
      controller: 'MovieEditCtrl'
    }).
    when('/actors', {
      templateUrl: 'partials/actor-list.html',
      controller: 'ActorCtrl'
    }).
    when('/actors/new', {
      templateUrl: 'partials/actor-add.html',
      controller: 'ActorCtrl'
    }).
    when('/actors/:actorId', {
      templateUrl: 'partials/actor-detail.html',
      controller: 'ActorCtrl'
    }).
    otherwise({
      templateUrl: 'partials/home.html',
      controller: 'MovieCtrl'
    });
  }
]);
