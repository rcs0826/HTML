/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index'], function(index) {

    'use strict';

    /*####################################### Serviços #########################################*/

    function serviceHelper($rootScope, $filter) {

        var service = {};

        return service;

    }

    // Serviço Helper
    serviceHelper.$inject = ['$rootScope', '$filter'];
    index.register.service('cfl.utils.Service', serviceHelper);

});
