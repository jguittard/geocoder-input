(function(angular) {
    'use strict';

    angular.module('ng-geocoder-input', ['ui.bootstrap'])
        .run(['$templateCache', function ($templateCache) {
            var template;
            template = "" +
                "<a ng-bind-html='match.model.formatted_address | typeaheadHighlight:query | trustAsHtml'></a>";
            $templateCache.put('angular-google-maps-geocoder-item.html', template);

            template = "" +
                "<input type='text' ng-model='output'" +
                "    placeholder='{{ placeholder }}'" +
                "    typeahead-min-length='{{ minLength }}'" +
                "    typeahead-wait-ms='{{ waitMs }}'" +
                "    typeahead-template-url='angular-google-maps-geocoder-item.html'" +
                "    typeahead-input-formatter='format(output)'" +
                "    typeahead='address for address in getLocation($viewValue)'" +
                "    typeahead-loading='loadingLocations' class='form-control c-square c-theme'>";
            $templateCache.put('angular-google-maps-geocoder.html', template);
        }])
        .service('geocoder', ['$q', function ($q) {
            var gmgeocoder = new google.maps.Geocoder();

            return {
                handle_reply: function(defer, results, status) {
                    if(status == google.maps.GeocoderStatus.OK) {
                        defer.resolve(results);
                    } else if(status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                        defer.resolve([]);
                    } else if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                        defer.reject("Over query limit");
                    } else if(status === google.maps.GeocoderStatus.REQUEST_DENIED) {
                        defer.reject("Request denied");
                    } else {
                        defer.reject("Unknown error");
                    }
                },

                geocode_by_id: function(place_id) {
                    var self = this;
                    var defer = $q.defer();

                    gmgeocoder.geocode({ placeId: place_id }, function(results, status) {
                        self.handle_reply(defer, results, status);
                    });

                    return defer.promise;
                },

                geocode_by_latlng: function(lat_lng) {
                    var self = this;
                    var defer = $q.defer();

                    gmgeocoder.geocode({ latLng: lat_lng }, function(results, status) {
                        self.handle_reply(defer, results, status);
                    });

                    return defer.promise;
                },

                geocode_by_query: function(query) {
                    var self = this;
                    var defer = $q.defer();

                    gmgeocoder.geocode({ address: query }, function(results, status) {
                        self.handle_reply(defer, results, status);
                    });

                    return defer.promise;
                }
            };
        }])
        .directive('ngGeocoderInput', ['geocoder', function (geocoder) {
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
        }])
        .filter('trustAsHtml', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }]);
})(angular);