/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index'], function(index) {

    'use strict';

    /*####################################### Filtros ##########################################*/

    /* Filtro...: chkAccountFormat
       Descrição: Concatena valores de uma lista de contas correntes separando por ;
       Retorno..: <valor 1>;<valor 2>;<valor n>;<...>
    */
    function chkAccountFormat($rootScope) {

        return function(sentence, params) {

            var str = "";
            if (sentence.length === 1) {
                str = sentence[0].cod_cta_corren + ' - ' + sentence[0].nom_abrev;
            } else {
                angular.forEach(sentence, function(chkAccount) {
                    if (str === "") {
                        str = chkAccount.cod_cta_corren;
                    } else {
                        str = str + ";" + chkAccount.cod_cta_corren;
                    }
                });
            }

            return str;

        }
        ;
    }
    chkAccountFormat.$inject = ['$rootScope'];
    index.register.filter('chkAccountFormat', chkAccountFormat);

    /*####################################### Serviços #########################################*/

    function serviceHelper($rootScope, $filter) {

        var service = {};

        return service;

    }

    // Serviço Helper
    serviceHelper.$inject = ['$rootScope', '$filter'];
    index.register.service('cmg.utils.Service', serviceHelper);

});
