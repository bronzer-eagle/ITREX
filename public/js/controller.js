var testTask = angular.module('testTask', ['ui.router']);

testTask.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/state1");
    //
    // Now set up the states
    $stateProvider
        .state('state1', {
            url: "/state1",
            templateUrl: "/public/templates/graduates.html"
        })
        .state('state2', {
            url: "/state2",
            templateUrl: "/public/templates/domino.html"
        })
});

testTask.controller('taskController', function ($scope, $http) {
    var flagPart = false;
    var counter = 1;

    $scope.variants = ['one', 'two', 'three', 'four', 'five', 'six'];
    $scope.flag = 0;
    $scope.student = {};
    $scope.dTop = {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
        six: false
    };

    $scope.dBott = {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
        six: false
    };

    $scope.values = {
        sec: 1,
        size: 1,
        angle: 0
    };

    randomDomino($scope.dTop);
    randomDomino($scope.dBott);

    $scope.results = function () {
        var res = 0;
        var amount = 0;
        for (var key in $scope.data) {
            res += $scope.data[key].children.reduce(function (sum, value) {
                return parseFloat(sum) + parseFloat(value['GPA']);
            }, 0);
            amount += $scope.data[key].children.length;
        }
        res = (res / amount).toFixed(2);
        return isNaN(res) ? 0 : res;
    };

    $http.get('public/json/data.json').success(function (data) {
        $scope.data = data;
        $scope.activeTab = 0;
        $scope.activeData = $scope.data[0];
    });

    $scope.deleteStudent = function (i) {
        $scope.activeData.children.splice(i, 1);
    };

    $scope.deleteTab = function (i) {
        if ($scope.data.length == 1){
            $scope.data[0] = {grad: 'new', children: []};
            $scope.activeData = $scope.data[0];
        } else{
            if ($scope.data.length-1 == i){
                $scope.activeData = $scope.data[i-1];
                $scope.activeTab = i-1;
            }else{
                $scope.activeData = $scope.data[i+1];
                $scope.activeTab = i;
            }
            $scope.data.splice(i, 1);
        }
    };

    $scope.switchTab = function (i) {
        $scope.activeTab = i;
        $scope.activeData = $scope.data[i];
    };

    $scope.addTab = function () {
        $scope.data.push({grad: 'new', children: []});
        $scope.activeTab = $scope.data.length - 1;
        $scope.activeData = $scope.data[$scope.data.length - 1];
    };

    $scope.addStudent = function (valid) {
        if (valid) {
            $scope.activeData.children.push($scope.student);
            $scope.student = {};
        }
    };

    $scope.turnIt = function (side) {
        if (side) {
            $scope.values.angle += 90;
        } else {
            $scope.values.angle -= 90;
        }
    };


    $scope.getStyle = function () {
        return {
            'transform': 'rotate(' + $scope.values.angle + 'deg) scale(' + $scope.values.size + ')',
            'transition': 'transform ' + Math.abs($scope.values.sec - 4.9) + 's ease'
        }
    };


    $scope.newDomino = function () {
        $scope.values.angle = 0;
        flagPart = true;
        alert('Choose top part of domino!');
    };

    $scope.choosePart = function (i) {
        if (!flagPart) {
            return false;
        } else {
            if (counter == 1) {
                createDomino($scope.dTop, i);
                counter++;
                alert('Choose bottom part of Domino!');
            } else {
                createDomino($scope.dBott, i);
                counter = 1;
                flagPart = false;
            }
        }
    };

    function createDomino(obj, i) {
        for (var key in obj) {
            obj[key] = (key == $scope.variants[i]);
        }
    }

    function randomDomino(obj) {
        var result = Math.floor(Math.random() * 5);
        createDomino(obj, result);
    }


});




