'use strict';

var clientApp = angular.module('clientApp', []);

//PathFinderController.inject
clientApp.controller('PathFinderController', ['$scope', function($scope) {

  //Submit the Request to get the paths for the node text.
  $scope.results = [];
  $scope.paths = [];
  $scope.validJSON = true;
  $scope.pathSeperator = ".";
  var jsonAsObject;

  $scope.submit = function() {

    $scope.paths = [];
    var enteredNode = $scope.nodeText;
    try {
      var enteredJson = document.getElementById("enteredJson").value;
      jsonAsObject = angular.fromJson(enteredJson);
      $scope.validJSON = true;
    } catch(err) {
      console.log("Invalid JSON");
      $scope.validJSON = false;
    }

    addJsonPaths(jsonAsObject, "");
    $scope.submitted = true;
  };

  function addJsonPaths(theObject, path) {
    var paths = [];
    for (var property in theObject) {
      if (theObject.hasOwnProperty(property)) {
        if (theObject[property] instanceof Object) {
          if(isInt(property)) {
            // Its an array element here add [arrayIndex] to the finalPath.
            addJsonPaths(theObject[property], path + '[' + property + ']');
          } else {
            addJsonPaths(theObject[property], path + $scope.pathSeperator + property);
          }
        } else {
            var pathInfo = {};
            var finalPath = path + $scope.pathSeperator + property;
            if(finalPath.indexOf($scope.pathSeperator + $scope.nodeText) > -1) {
              var nodeIndex = finalPath.lastIndexOf($scope.nodeText);
              var matchedPathEndIndex = finalPath.indexOf($scope.pathSeperator, nodeIndex);
              finalPath = finalPath.substring(0, matchedPathEndIndex).trim();
              if(!doesPathExist(finalPath)) {
                  var data;
                  var jsonPathQuery = "$" + finalPath;

                  if($scope.pathSeperator === "/") {
                    data = jsonPath(jsonAsObject, jsonPathQuery.replace(/\//g, "."));
                  } else {
                    data = jsonPath(jsonAsObject, jsonPathQuery);
                  }

                  if(data) {
                    pathInfo["path"] = finalPath;
                    pathInfo["result"] = JSON.stringify(data[0], undefined, 2);
                    $scope.paths.push(pathInfo);
                  }
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

