'use strict';

var movieControllers = angular.module("movieControllers", []);

movieControllers.controller("MovieCtrl", function($scope, $localStorage, $location, $filter, $q) {
  if ($localStorage.current_movie) {
    $scope.current_movie = $localStorage.current_movie;
  }
  if ($localStorage.actors) {
    $scope.actors = $localStorage.actors;
  } else {
    $scope.actors = [{
      "id": 0,
      "first_name": "Brie",
      "last_name": "Larsonn",
      "gender": "",
      "birth_date": ""
    }, {
      "id": 1,
      "first_name": "Jacob",
      "last_name": "Tremblay",
      "gender": "",
      "birth_date": ""
    }, {
      "id": 2,
      "first_name": "Leonardo",
      "last_name": "DiCaprio",
      "gender": "",
      "birth_date": ""
    }];
    $localStorage.actors = $scope.actors;
  }

  if ($localStorage.movies) {
    $scope.movies = $localStorage.movies;
  } else {

    $scope.movies = [{
      "id": 0,
      "name": "Room",
      "release_year": 2015,
      "gross_income": 14161502,
      "actors": [$scope.actors[0], $scope.actors[1]],
      "director_name": "Lenny Abrahamson",
      "rating": 8.3,
      "genre": "Drama"
    }, {
      "id": 1,
      "name": "Spotlight ",
      "release_year": 2015,
      "gross_income": 41562351,
      "actors": [],
      "director_name": "Tom McCarthy",
      "rating": 8.2,
      "genre": "Biography;Drama;History;Thriller"
    }, {
      "id": 2,
      "name": "Deadpool",
      "release_year": 2016,
      "gross_income": 315915561,
      "actors": [],
      "director_name": "Tim Miller",
      "rating": 8.4,
      "genre": "Action;Adventure;Comedy;Sci-Fi"
    }, {
      "id": 3,
      "name": "Inception",
      "release_year": 2010,
      "gross_income": 292568851,
      "actors": [$scope.actors[2]],
      "director_name": "Christopher Nolan",
      "rating": 8.8,
      "genre": "Action;Mystery;Thriller;Sci-Fi"
    }];
    $localStorage.movies = $scope.movies;
  }

  // delete data
  $scope.delete = function(movie) {
    var index = $scope.movies.indexOf(movie);
    $scope.movies.splice(index, 1);
  };
  // reset new data model
  $scope.reset = function() {
    $scope.newName = "";
    $scope.newRelaseYear = 0;
    $scope.newGrossIncome = 0;
    $scope.newActors = "";
    $scope.newDirectorName = "";
    $scope.newRating = 0;
    $scope.newGenre = "";
  }
  $scope.reset();
  // add new data
  $scope.add = function() {
    // Do nothing if no state is entered (blank)
    if (!$scope.newName)
      return;
    // add to main movies
    $scope.movies.push({
      id: $scope.movies.length,
      name: $scope.newName,
      release_year: $scope.newRelaseYear,
      gross_income: $scope.newGrossIncome,
      actors: $scope.newActors,
      director_name: $scope.newDirectorName,
      rating: $scope.newRating,
      genre: $scope.newGenre
    });
    $localStorage.movies = $scope.movies;
    $scope.reset();
  }

  $scope.edit = function(movie) {
    $localStorage.edited_movie = movie;
    var movie = $localStorage.current_movie;
    $scope.go("/movies/" + movie.id + "/edit");
  };

  $scope.detail = function(movie) {
    $localStorage.current_movie = movie;
    $scope.go("/movies/" + movie.id);
  };

  $scope.go = function(path) {
    $location.path(path);
  };

});

movieControllers.controller('MovieEditCtrl', function($scope, $localStorage, $location,$q) {
  var edited_movie = angular.copy($localStorage.movies);
  $scope.actors = angular.copy($localStorage.actors);

  if ($localStorage.edited_movie) {
    $scope.current_movie = $localStorage.current_movie;
  }

  $scope.save = function(movie) {
    $scope.movies = $localStorage.movies;
    $scope.go("/movies");
  };

  $scope.cancel = function() {
    $localStorage.movies = edited_movie;
    $scope.go("/movies");
  };

  $scope.go = function(path) {
    $location.path(path);
  };

  /*****************************************************/

  $scope.filterActor = function(actor) {
    return actor.isDeleted !== true;
  };

  $scope.addActor = function() {
    $scope.actors.push({
      id: $scope.actors.length,
      first_name: '',
      last_name: '',
      gender: '',
      birth_date: '',
      isNew: true
    });
  };
  // cancel all changes
  $scope.cancelAddActor = function() {
    for (var i = $scope.actors.length; i--;) {
      var actor = $scope.actors[i];
      // undelete
      if (actor.isDeleted) {
        delete actor.isDeleted;
      }
      // remove new
      if (actor.isNew) {
        $scope.actor.splice(i, 1);
      }
    };
  };
  // save edits
  $scope.saveTable = function() {
    var results = [];
    for (var i = $scope.actors.length; i--;) {
      var actor = $scope.actors[i];
      // actually delete actor
      if (actor.isDeleted) {
        $scope.actors.splice(i, 1);
      }
      // mark as not new
      if (actor.isNew) {
        actor.isNew = false;
      }

      // send on server
    }
    return $q.all(results);
  };

  /*****************************************************/
});

movieControllers.controller('MovieListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('res/json/movies.json').success(function(data) {
      $scope.movies = data;
    });
    $scope.orderProp = 'release_year';
  }
]);


movieControllers.controller("ActorCtrl", function($scope, $localStorage, $location) {

  if ($localStorage.actors) {
    console.log("local actors ok");
    $scope.actors = $localStorage.actors;
  } else {
    console.log("local actors no");
    $scope.actors = [];
  }
  // delete data
  $scope.delete = function(actor) {
    var index = $scope.actors.indexOf(actor);
    $scope.actors.splice(index, 1);
  };
  // reset new data model
  $scope.reset = function() {
    $scope.newFirstName = "";
    $scope.newLastName = "";
    $scope.newGender = "";
    $scope.newBirthDate = "";
    $scope.newMovies = [];
  }
  $scope.reset();
  // add new data
  $scope.add = function() {
    console.log("1 .- adding...");
    // Do nothing if no state is entered (blank)
    if (!$scope.newLastName)
      return;

    console.log("adding...");
    // add to main movies
    $scope.actors.push({
      id: $scope.actors.length,
      first_name: $scope.newFirstName,
      last_name: $scope.newLastName,
      gender: $scope.newGender,
      birth_date: $scope.newBirthDate,
      movies: $scope.newMovies
    });
    $localStorage.actors = $scope.actors;

    console.log($scope.actors);
    // See $Scope.reset...
    $scope.reset();
  }

  $scope.current = function(index) {
    return $scope.actors[index]
  }

  $scope.go = function(path) {
    $location.path(path);
  };
});
