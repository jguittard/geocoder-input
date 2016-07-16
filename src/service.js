angular
    .module('ng-geocoder-input')
    .service('geocoder', geocoder);

geocoder.$inject = ['$q'];

function geocoder($q) {
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
}