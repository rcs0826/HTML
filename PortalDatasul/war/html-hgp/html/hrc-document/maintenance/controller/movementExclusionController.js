define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    movementExclusionController.$inject = ['$rootScope', '$scope', '$modalInstance',
                                               'hrc.document.Factory', 'hrc.movement.Factory' , 'disclaimers', 
                                               'document', 'movementsList', 'movementsNumbers', 'TOTVSEvent', '$modal']
    function movementExclusionController($rootScope, $scope, $modalInstance, documentFactory, 
                                             movementFactory, disclaimers, document, movementsList,
                                             movementsNumbers, TOTVSEvent) {

        var _self = this;
        this.model = {};
        this.model.documentKey = null;
        
        _self.modalTitle = undefined;
        _self.movementsList = movementsList;
        _self.movementsNumbers = movementsNumbers;

        this.init = function () {            
            if(angular.isUndefined(document) === false){
                _self.model.documentKey =  "Unidade Prestadora " + StringTools.fill(document.cdUnidadePrestadora, '0', 4) 
                                    + " | Transação "  + StringTools.fill(document.cdTransacao, '0', 4) 
                                    + " | Série "      + document.nrSerieDocOriginal
                                    + " | Número "     + StringTools.fill(document.nrDocOriginal, '0', 8)
                                    + " | Sequência "  + StringTools.fill(document.nrDocSistema, '0', 9);
            }
        };        

        this.save = function () {
            $modalInstance.close(true);      
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hrc.movementExclusion.Control', movementExclusionController);
});
