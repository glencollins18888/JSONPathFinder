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

    traverse(jsonAsObject, "");
    $scope.submitted = true;
  };

    function traverse(x, path) {
        if (isArray(x)) {
            traverseArray(x, path);
        } else if ((typeof x === 'object') && (x !== null)) {
            traverseObject(x, path);
        } else {
            var pathInfo = {};
            var finalPath = path;
            console.log(finalPath);
            if (finalPath.indexOf($scope.pathSeperator + $scope.nodeText) > -1) {
                 var nodeIndex = finalPath.lastIndexOf($scope.nodeText);
                 var matchedPathEndIndex = finalPath.indexOf($scope.pathSeperator, nodeIndex);
                 if (matchedPathEndIndex > 0) {
                    finalPath = finalPath.substring(0, nodeIndex + $scope.nodeText.length).trim();
                 }
                 if (!doesPathExist(finalPath)) {
                     var data;
                     var jsonPathQuery = "$" + finalPath;

                     if ($scope.pathSeperator === "/") {
                         data = jsonPath(jsonAsObject, jsonPathQuery.replace(/\//g, "."));
                     } else {
                        data = jsonPath(jsonAsObject, jsonPathQuery);
                     }

                     if (data) {
                         pathInfo["path"] = finalPath;
                         pathInfo["result"] = JSON.stringify(data[0], undefined, 2);
                         $scope.paths.push(pathInfo);
                     }
                 }
             }
        }
    }


  function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  }

  function traverseArray(arr, path) {
    var count = 0;
    arr.forEach(function(x) {
      traverse(x, path + '[' + [count++] + ']');
    });
  }

  function traverseObject(obj, path) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        //console.log(path + "  " + key + ":");
        traverse(obj[key], path + $scope.pathSeperator + key);
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

