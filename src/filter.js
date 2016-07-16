angular
    .module('ng-geocoder-input')
    .filter(filter);

filter.$inject = ['$sce'];

function filter($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}