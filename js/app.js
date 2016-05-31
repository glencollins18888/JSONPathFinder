'use strict';

// Declare app level module which depends on views, and components
/*angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);*/

var clientApp = angular.module('clientApp', []);


clientApp.controller('PathFinderController', ['$scope', function($scope) {

  //Submit the Request to get the paths for the node text.
  $scope.results = [];
  $scope.paths = [];
  $scope.validJSON = true;
  $scope.submit = function() {

    $scope.paths = [];
    var enteredNode = $scope.nodeText;
    var json;
    try {
      json = angular.fromJson($scope.enteredJson);
      $scope.validJSON = true;
    } catch(err) {
      console.log("Invalid JSON");
      $scope.validJSON = false;
    }

    addJsonPaths(json, "");
    $scope.submitted = true;
  };

  function addJsonPaths(theObject, path) {
    var paths = [];
    for (var property in theObject) {
      if (theObject.hasOwnProperty(property)) {
        if (theObject[property] instanceof Object) {
          if(isInt(property)) {
            addJsonPaths(theObject[property], path + '[' + property + ']');
          } else {
            addJsonPaths(theObject[property], path + $scope.pathSeperator + property);
          }
        } else {
          var finalPath = path + $scope.pathSeperator + property;
          if(finalPath.indexOf($scope.pathSeperator + $scope.nodeText) > -1) {
            var nodeIndex = finalPath.lastIndexOf($scope.nodeText);
              finalPath = finalPath.substring(0, nodeIndex + $scope.nodeText.length);
              if($scope.paths.indexOf(finalPath) == -1) {
                  $scope.paths.push(finalPath);
              }
          }
        }
      }
    }
  }

  function isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  }

}]);

clientApp.controller('PathResultsController', ['$scope', function($scope) {

  $scope.copyPath = function() {
    //TODO
  };

}]);

