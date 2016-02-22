"use strict";

angular.module('starter', ['ionic', 'ngFitText'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.controller('BaseConverterController', function($scope, $ionicPopover, $ionicPlatform) {
	$ionicPopover.fromTemplateUrl("templates/help.html", {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});

	$ionicPlatform.ready(function() {
		if(window.localStorage['firstRun200'] != 'true')  {
			window.localStorage['firstRun200'] = 'true';
			$scope.popover.show(".ion-ios-help-outline");
		}
	});

	$scope.hexadecimal = '0';
	$scope.decimal = '0';
	$scope.binary = '0';

	$scope.base = 10;
	$scope.minimumBase = 2;

	$scope.automatic = true;
	$scope.integer = true;

	var number = 0;

	function updateOutput() {
		$scope.hexadecimal = number.toString(16);
		$scope.decimal = number.toString(10);
		$scope.binary = number.toString(2);
	}

  function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
  }

	$scope.add = function(digit) {
		number *= $scope.base;
		number += digit;

		updateOutput();
	};

	$scope.decimalPoint = function() {
    var buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, -3, false);
    var data = [].slice.call( new Uint8Array(buffer));

    $scope.binary = '';

    for(var i = 0; i < 8; i++)
    {
      if(i != 0) $scope.binary += '-';
      $scope.binary += padDigits(data[i].toString(2), 8);
    }
	};

	$scope.negate = function() {

	};

	$scope.clearEntry = function() {
		number = Math.floor(number / $scope.base);

		updateOutput();
	};

	$scope.allClear = function() {
		number = 0;

		updateOutput();
	};

	$scope.help = function($event) {
		$scope.popover.show($event);
	};

	$scope.automaticToggle = function() {
		$scope.automatic = !$scope.automatic;
	};

	$scope.integerToggle = function() {
		$scope.integer = !$scope.integer;
	};

	$scope.baseToggle = function(refactor) {
		$scope.base = refactor;
		var translated = parseInt(number.toString(), $scope.base);
		number = translated;

		updateOutput();
	};
})
