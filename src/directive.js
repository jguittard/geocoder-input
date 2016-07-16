angular
    .module('ng-geocoder-input')
    .directive(directive);

directive.$inject = ['geocoder'];

function directive(geocoder) {
    return {
        restrict: 'AE',

        scope: {
            "placeid": '@',
            "output": '=',
            "placeholder": '@',
            "minLength": '@',
            "waitMs": '@'
        },

        templateUrl: 'angular-google-maps-geocoder.html',

        link: function($scope, element, attrs) {

            //Fetch the initial place_id data
            if(attrs.placeid !== undefined) {
                geocoder.geocode_by_id(attrs.placeid).then(function(results) {
                    if(results.length > 0) $scope.output = results[0];
                });
            }

            //Get places when the user types in the input field
            $scope.getLocation = function(val) {
                return geocoder.geocode_by_query(val);
            };

            //Format the received data
            $scope.format = function(val) {
                if(!angular.isObject(val) || !val.hasOwnProperty("formatted_address")) return;
                return val.formatted_address;
            };

        }
    };
}