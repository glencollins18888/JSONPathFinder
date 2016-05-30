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

  $scope.submit = function() {

    $scope.paths = [];
    var enteredNode = $scope.nodeText;
    var json = angular.fromJson($scope.enteredJson);

    addJsonPaths(json, "");
    console.log($scope.paths);
  };

  function addJsonPaths(theObject, path) {
    var paths = [];
    for (var property in theObject) {
      if (theObject.hasOwnProperty(property)) {
        if (theObject[property] instanceof Object) {
          addJsonPaths(theObject[property], path + '/' + property);
        } else {
          var finalPath = path + '/' + property;
          if(finalPath.indexOf("/" + $scope.nodeText) > -1) {
            var nodeIndex = finalPath.indexOf($scope.nodeText);
              finalPath = finalPath.substring(0, nodeIndex + $scope.nodeText.length);
              if($scope.paths.indexOf(finalPath) == -1) {
                  $scope.paths.push(finalPath);
              }
          }
        }
      }
    }
  }

}]);

