define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrs-reason/reasonFactory.js',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
    '/dts/hgp/html/hvp-contractingparty/contractingPartyZoomController.js',    
    '/dts/hgp/html/hrs-situation/situationFactory.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    abiAnalysisAttendanceSupDocReason.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                                    'dataItem','AbstractAdvancedFilterController','TOTVSEvent', 
                                                                  'hrs.reason.Factory', 'hrs.situation.Factory','hrs.abiAnalysisAttendance.Factory'];
    function abiAnalysisAttendanceSupDocReason($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                                   dataItem,  AbstractAdvancedFilterController,TOTVSEvent, 
                                                   reasonFactory, situationFactory, abiAnalysisAttendanceFactory) {

        var _self = this;
        _self.model = {}; 
        _self.dataItem = dataItem;
        _self.tmpMotivos = {};

        this.cancel = function () {
           $modalInstance.close(_self.dataItem);             
        };

        this.init = function () {      
            _self.currentUrl = $location.$$path;
            _self.tmpMotivos = [{"idMotivo":1}];
        }
        this.cellRendererTextArea = function(dataItem){
           resultElement = '<div style="text-align: center;" > ' + '<span> ';
           if (dataItem.dsMotivo) { 
                resultElement = resultElement + '</textarea rows="4" cols="50">';
           }
           resultElement = resultElement + '</span> ' + '</div> ';
           return resultElement;
        }
            
        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
            console.log(dataItem);

        });
        $.extend(this, abiAnalysisAttendanceSupDocReason);
    }
    index.register.controller('hrs.abiAnalysisAttendanceSupDocReason.Control', abiAnalysisAttendanceSupDocReason);
});

