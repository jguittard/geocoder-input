(function(angular) {
    'use strict';

    angular
        .module('ng-geocoder-input')
        .run(run);

    run.$inject = ['$templateCache'];

    function run($templateCache) {
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
    }
})(angular);