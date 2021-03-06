// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngFitText'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('BaseConverterController', function($scope, $ionicLoading, $ionicPopover, $ionicPlatform) {

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function numberWithDashes(x) {
    return x.toString().replace(/\B(?=(\d{8})+(?!\d))/g, "-");
  }

  var template = '<ion-popover-view id="infoScreen">' + '<ion-header-bar>' +
      '<h1 class="title">About Base "10" Converter</h1>' +
      '</ion-header-bar>'+ '<ion-content>' +
      '<div class="popoverText"><p>Thanks for purchasing the most advanced base/number conversion tool in the app store proudly developed by Lin Firmware; I hope you enjoy the app and consider leaving a review in the app store!</p><p><b>Getting Started</b></p><p>Simply start entering your target number to begin converting between bases. See the tips below for special cases.</p><ul id="infoList"><li>Your desired base will be intelligently predicted; simply click on the display text for your desired base to override this prediction.</li><li>The dark checkmark indicates the current base, and empty circles indicate bases you can change too. If a base has no circle that means the current number is out of bounds for that base or contains digits incompatible with that base.</li><li>The font for each base will dynamically scale and span multiple lines as needed to make sure the entire number is visible at all times.</li><li>The largest supported number is 53 bits in length.</li><li>Press "DEL" or "AC" to delete individual digits or clear the entire number, respectively.</li></ul></div>' + '</ion-content>' + '</ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
   });

   $scope.openPopover = function($event) {
      $scope.popover.show($event); 
   };

   $scope.closePopover = function() {
      $scope.popover.hide();
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover.remove();
   });

   // Execute action on hide popover
   $scope.$on('popover.hidden', function() {
      // Execute action
   });

   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
      // Execute action
   });

   $ionicPlatform.ready(function() {
      if(window.localStorage['firstRun8'] != 'true')  {
          window.localStorage['firstRun8'] = 'true';
          $scope.popover.show(".ion-ios-help-outline");
      }
  });

  $scope.keys = [
    {"description":"A", "border":"borderBottom dark"},
    {"description":"B", "border":"borderBottom dark"},
    {"description":"C", "border":"borderBottom dark"},
    {"description":"D", "border":"borderBottom dark"},
    {"description":"7", "border":"borderBottom"},
    {"description":"8", "border":"borderBottom"},
    {"description":"9", "border":"borderBottom"},
    {"description":"E", "border":"borderBottom dark"},
    {"description":"4", "border":"borderBottom"},
    {"description":"5", "border":"borderBottom"},
    {"description":"6", "border":"borderBottom"},
    {"description":"F", "border":"borderBottom dark"},
    {"description":"1", "border":"borderBottom dark"},
    {"description":"2", "border":"borderBottom"},
    {"description":"3", "border":"borderBottom"},
    {"description":"AC", "rowSpan":2, "border":"borderBottom red"},
    {"description":"0", "border":"borderBottom dark"},
    {"description":"DEL", "columnSpan":2, "border":"borderBottom red"},
  ];

  $scope.input = "";

  $scope.currentBase = 10;
  $scope.manualBaseActive = false;

  $scope.hex = "0";
  $scope.dec = "0";
  $scope.bin = "0";

  $scope.hexIndicator = 1;
  $scope.decIndicator = 1;
  $scope.binIndicator = 1;

  $scope.minimumBase = function(data) {
    if(data.search(/[a-f]/) > -1) { return 16; }
    if(data.search(/[2-9]/) > -1) { return 10; }
    return 2;
  }

  $scope.predictedBase = function(data) {
    var min = $scope.minimumBase(data);
    var length = data.length;

    switch (min) {
      case 2:
        if (length > 5) {
          return 2;
        }

        return 10;
      default:
        return min;
    }
  }

  $scope.setOutput = function() {
    var base, number;

    if($scope.manualBaseActive == false) {
      base = $scope.predictedBase($scope.input);
    } else {
      base = $scope.currentBase;
    }

    number = parseInt($scope.input, base);

    if((number > 9007199254740991 || Number.isNaN(number)) || $scope.minimumBase($scope.input) > base)
    {
      if($scope.input.length > 0) {
        $scope.input = $scope.input.substr(0, $scope.input.length - 1);
        $scope.validateBaseCircles();
      }
      if($scope.input.length == 0)
      {
        $scope.hex = "0";
        $scope.dec = "0";
        $scope.bin = "0";

        $scope.hexIndicator = 1;
        $scope.decIndicator = 1;
        $scope.binIndicator = 1;
      }
      return;
    }

    $scope.currentBase = base;

    $scope.hex = number.toString(16).toUpperCase();
    $scope.dec = numberWithCommas(number.toString(10));
    $scope.bin = numberWithDashes(number.toString(2));

    $scope.validateBaseCircles();
  }

  $scope.reCalc = function(base) {
    var number = parseInt($scope.input, base);
    var minimum = $scope.minimumBase($scope.input);
    if(((number > 9007199254740991 || Number.isNaN(number)) || minimum > base) && $scope.input.length != 0) return;

    $scope.manualBaseActive = true;
    $scope.currentBase = base;

    $scope.setOutput();
  }

  $scope.validateBaseCircles = function() {
    var number = parseInt($scope.input, 16);
    var minimum = $scope.minimumBase($scope.input);

    if((number > 9007199254740991 || Number.isNaN(number))) $scope.hexIndicator = 0; else $scope.hexIndicator = 1;

    number = parseInt($scope.input, 10);
    if((number > 9007199254740991 || Number.isNaN(number)) || minimum > 10) $scope.decIndicator = 0; else $scope.decIndicator = 1;

    number = parseInt($scope.input, 2);
    if((number > 9007199254740991 || Number.isNaN(number)) || minimum > 2) $scope.binIndicator = 0; else $scope.binIndicator = 1;
  }

  $scope.keyPressed = function(val) {
    if(val == "ac") {
      $scope.clear();
    } else if(val == "del") {
      $scope.remove();
    } else {
      $scope.add(val);
    }
  }

  $scope.add = function(added) {
    if ($scope.input.length == 0 && $scope.added == '0') {
        return;
    }

    $scope.input += added;
    $scope.setOutput();
  }

  $scope.remove = function() {
    if($scope.input.length > 0) $scope.input = $scope.input.substr(0, $scope.input.length - 1);
    $scope.setOutput();
  }

  $scope.clear = function() {
    $scope.input = "";

    $scope.currentBase = 10;
    $scope.manualBaseActive = false;

    $scope.hex = "0";
    $scope.dec = "0";
    $scope.bin = "0";

    $scope.hexIndicator = 1;
    $scope.decIndicator = 1;
    $scope.binIndicator = 1;
  }
});