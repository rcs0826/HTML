define(['index'], function (index) {

    serviceUtils.$inject = ['$rootScope', '$filter', '$injector'];

    // # Purpose: Serviço com funções auxiliares genéricas
    // # Parameters: 
    // #    Injeção dos serviços ($rootScope, $filter, $injector)
    // # Notes: 

    function serviceUtils($rootScope, $filter, $injector) {
    	return {

            // # Purpose: Formata valor decimal
            // # Parameters: 
            // #     number: Valor
            // #     fractionSize: número de casas decimais
            // # Notes: 
			formatDecimal: function (number, fractionSize) {

                var filter = $filter('number');

                if(fractionSize == undefined){
                    return filter(number);
                }else{
                    return filter(number, fractionSize);
                }
            },
            
            // # Purpose: Ordena um array de objetos
            // # Parameters: 
            // #     objList: Array de objetos para ordenação
            // #     properties: Atributos de ordenação
            // # Notes: Exemplo de uso
            // #        serviceUtils.sortArrayOfObjects(arrayObjs, ["code","name","surname"])
            // #        Para ordenar de forma decrescente pasta colocar "-" na frente do atributo
            // #        Ex.: ["-code","name","surname"]
            sortArrayOfObjects: function(objList, properties){
                var dynamicSortMultiple = function(props){
                    var dynamicSort = function(property){
                        var sortOrder = 1;
                        if(property[0] === "-") {
                            sortOrder = -1;
                            property = property.substr(1);
                        }
                        return function (a,b) {
                            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                            return result * sortOrder;
                        }
                    }
                    return function (obj1, obj2) {
                        var i = 0, result = 0, numberOfProperties = props.length;
                        while(result === 0 && i < numberOfProperties) {
                            result = dynamicSort(props[i])(obj1, obj2);
                            i++;
                        }
                        return result;
                    }
                }
                return objList.sort(dynamicSortMultiple(properties));

            },

            // # Purpose: Converte data para o formato UTC
            // # Parameters: 
            // #     date: Data
            // # Notes: 
            dateToUTCDate : function(date){
                if(!date)
                    return null;

                var _utc = new Date(Date.UTC(date.getFullYear(), 
                                             date.getMonth(), 
                                             date.getDate()));
                _utc.setUTCHours(date.getHours());
                _utc.setUTCMinutes(date.getMinutes()); 
                _utc.setUTCSeconds(date.getSeconds()); 
                return _utc;
            },
            
            // # Purpose: Converte data de milissegundos para o formato UTC
            // # Parameters: 
            // #     date: Data em milissegundos
            // # Notes: 
            millisToUTCDate : function(millis){
                if(!millis)
                    return null;

                return this.dateToUTCDate(new Date(millis));
            },
        }
    };

    // # Purpose: A diretiva TotvsRating é utilizada para demonstrar a reputação 
    // #          de um fornecedor no Clicbusiness
    // # Parameters: 
    // # Notes: 
    function totvsRating() {
        var directive = {
            template: '<div class="field-container"></div>',
            restrict: 'E',
            require: '^ngModel',
            scope : {
                ngModel : '=',
                max : '@'
            },        
            link: link
        }
        return directive;

        function link(scope, element, attrs){
            var i = 1, 
                span, 
                icon, 
                filledStars,
                emptyStars;

            if(!attrs.max) attrs.max = 5;
            filledStars = (scope.ngModel > attrs.max)?attrs.max:scope.ngModel;
            emptyStars  = attrs.max - filledStars;
            
            while(i<=attrs.max){
                icon = (i <= filledStars)?'glyphicon-star':'glyphicon-star-empty';
                span = angular.element("<span/>").addClass('pull-left glyphicon ' + icon);
                element.find('.field-container').append(span);
                i++;
            }
            
        }
    }

    // Util Service
    index.register.service('mcc.utils.Service', serviceUtils);
    index.register.directive('totvsRating', totvsRating);
});


// # Purpose: Funções da diretiva TotvsRating
// # Parameters: 
// # Notes: 
(function () {

    'use strict';

    angular
        .module('index')
        .directive('totvsRating', totvsRating);

    totvsRating.$inject = ['$compile'];
    function totvsRating($compile) {
        console.log("totvsRating");
        var directive = {
            template: '<div class="field-container"></div>',
            restrict: 'E',
            scope: {
                max: '@',
                ngModel: '=',
                displayOnly: '@'
            },
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
             console.log("totvsRating link");
           scope.$watch(attrs.ngModel, function (newValue) {
                element.outerHtml = '';

                if(!attrs.max){
                    attrs.max = 5;
                }
                var emptyStars = (attrs.ngModel <= attrs.max)?(attrs.max - attrs.ngModel):0;
                while(i < attrs.ngModel){
                    var span = document.createElement('span');
                    span.addClass('glyphicon glyphicon-star')
                    element.appendChild(span);
                    i++;
                }
                while(i < emptyStars){
                    var span = document.createElement('span');
                    span.addClass('glyphicon glyphicon-star-empty')
                    element.appendChild(span);
                    i++;
                }
            });
        }
    }
});