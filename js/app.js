'use strict';

var clientApp = angular.module('clientApp', []);

//PathFinderController.inject
clientApp.controller('PathFinderController', ['$scope', function($scope) {

  //Submit the Request to get the paths for the node text.
  $scope.results = [];
  $scope.paths = [];
  $scope.validJSON = true;
  $scope.pathSeperator = ".";
  $scope.jsonObject;

  $scope.submit = function() {

    $scope.paths = [];
    var enteredNode = $scope.nodeText;
    var json;
    try {
      json = angular.fromJson($scope.enteredJson);
      $scope.validJSON = true;
      $scope.jsonObject = json;
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
            // Its an array element here add [arrayIndex] to the path.
            addJsonPaths(theObject[property], path + '[' + property + ']');
          } else {
            addJsonPaths(theObject[property], path + $scope.pathSeperator + property);
          }
        } else {
          var pathInfo = {};
          var finalJSONPath = path + $scope.pathSeperator + property;
          if(finalJSONPath.indexOf($scope.pathSeperator + $scope.nodeText) > -1) {
              var nodeIndex = finalJSONPath.lastIndexOf($scope.nodeText);
              finalJSONPath = "$" + finalJSONPath.substring(0, nodeIndex + $scope.nodeText.length).trim();
              if(!doesPathExist(finalJSONPath)) {
                  var data = jsonPath($scope.jsonObject, finalJSONPath);
                  pathInfo["path"] = finalJSONPath;
                  pathInfo["result"] = JSON.stringify(data, undefined, 2);
                  $scope.paths.push(pathInfo);
              }
          }
        }
      }
    }
  }

  function doesPathExist(finalPath) {
    var doesExist = false;
    angular.forEach($scope.paths, function(pathInfo, key) {
      if(pathInfo.path === finalPath) {
        doesExist = true;
      }
    });
    return doesExist;
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

