define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrs-reason/reasonFactory.js',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
    '/dts/hgp/html/hvp-contractingparty/contractingPartyZoomController.js',    
    '/dts/hgp/html/hrs-situation/situationFactory.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    abiAnalysisAttendanceSupDocAttachment.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                                    'dataItem','AbstractAdvancedFilterController','TOTVSEvent', 
                                                                  'hrs.reason.Factory', 'hrs.situation.Factory','hrs.abiAnalysisAttendance.Factory', 'idPermissao','maintenancePermission'];
    function abiAnalysisAttendanceSupDocAttachment($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                                   dataItem,  AbstractAdvancedFilterController,TOTVSEvent, 
                                                   reasonFactory, situationFactory, abiAnalysisAttendanceFactory, idPermissao,maintenancePermission) {

        var _self = this;
        _self.model = {}; 
        _self.dataItem = dataItem;
        _self.hadAttachment = false;
        _self.download = {};       
        _self.idPermissao = idPermissao;
        _self.maintenancePermission = maintenancePermission;
        _self.file = {};
        _self.arqImportacao = null;
        _self.arquivo = null;        
        _self.showCarregando = false;
        _self.removed = false;

        this.save = function () {
             $modalInstance.close(_self.dataItem);   
        };

        this.cancel = function () {
            _self.dataItem.removed = _self.removed;
           $modalInstance.close(_self.dataItem);             
        };

        this.init = function () {      
            _self.currentUrl = $location.$$path;
            _self.carregaArquivo();
            
        }
        
        this.formatBytes = function(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

        this.carregaArquivo = function () {
            if (_self.dataItem 
                && _self.dataItem.nmArquivo != "")
                if ($("#uploadDocPadrao .k-header").length == 0)
                    setTimeout(_self.carregaArquivo,100);
                else
                    $("<ul class='k-upload-files k-reset'><li class='k-file ng-scope k-file-success' id='fileFake'" +
                    "data-uid='6afb62e4-d1e2-438b-9401-0d52da5a190d'><div class='template-upload' style='width: auto'>" +
                    "<div class='row'><span class='k-progress' style='width: 100%;'></span>" +
                    "<div class='col-lg-6 col-md-6 col-sm-6 col-xs-9' style='overflow: hidden; white-space: nowrap;" +
                    " text-overflow:ellipsis;' title='" + _self.dataItem.nmArquivo + "'>" + _self.dataItem.nmArquivo + "</div>" +
                    "<div class='col-lg-2 col-md-2 col-sm-2 col-xs-6'>" +  _self.formatBytes(_self.dataItem.tmDocumento * 1 ) + "</div><div class='col-lg-1 col-md-1 col-sm-1 col-xs-1' " +
                    "style='float: right;'> <button type='button' class='k-upload-action k-button k-button-bare' style='display: " +
                    "inline-block;'>&nbsp;</span></button></div></div></div>" +
                    "</li></ul>").appendTo('#uploadDocPadrao .k-header');
        }

        this.onUploadSuccess = function(event){

                 $rootScope.$broadcast(TOTVSEvent.showNotification, {
                     type: 'success', title: 'Anexo foi salvo com sucesso!'
                 }); 
                 _self.removed = false;
        }   

        this.onUploadSelect = function(event){
            _self.uploadFile(event.files);

            return;
        }

        this.formatDate = function(date) {
            var year = date.getFullYear().toString();
            var month = (date.getMonth() + 101).toString().substring(1);
            var day = (date.getDate() + 100).toString().substring(1);
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            return year + month + day + hour + minutes + seconds;// + Math.floor((Math.random() * 100000) + 1);;
        }

        // Realiza a importacao de aquivo no servidor
        this.uploadFile = function($files) {

            var nmDocto = "";
            var files = $files;
            successCallback = function (result) {
                _self.showCarregando = false;    
                
                if (result[0] && result[0].idDocto > 0){

                    _self.dataItem = result[0];
                    $(".k-upload-files").remove();
                    $(".k-upload-status").hide();
                    _self.carregaArquivo();


                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'sucess', title: 'Arquivo importado com sucesso!'
                    });
                } else {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Não foi possível importar o arquivo!'
                    });
                }

            };
            progressCallback = function (progress, event) {
            };
            errorCallback = function (result, status, headers, config, attachmentInstance) {             
            }; 

            //lastItem = anArray.pop();

            for (var i = 0; i < files.length; i++) {                    
                var file = files[i];
                
                nmDocto = file.name.substr(0, file.name.lastIndexOf("."));
                nmDocto = nmDocto + "_" + _self.formatDate(new Date()) + file.extension;
                file.name = nmDocto;
                
                _self.showCarregando = true;   
                if (dataItem.idDocto == null)
                    dataItem.idDocto = 0;
                abiAnalysisAttendanceFactory.uploadDocumento(file, nmDocto, file.extension, dataItem.idDocto, dataItem.cdRessusAbiAtendim, dataItem.idImpugdocs, successCallback, progressCallback, errorCallback); 
            }
        }

        this.download = function(idDocto){
            abiAnalysisAttendanceFactory.downloadDocumento(dataItem.idDocto,
             function (result) {
                    if (result) {
                        if (result.nmArquivo != "" 
                            && result.lcArquivoBase64 != null) {
                            var type = 'data:application/octet-stream;base64,';
                            var pom = document.createElement('a');
                            pom.setAttribute('href', type + encodeURIComponent(result.lcArquivoBase64));
                            pom.setAttribute('download', result.nmArquivo);

                            if (document.createEvent) {
                                var event = document.createEvent('MouseEvents');
                                event.initEvent('click', true, true);
                                pom.dispatchEvent(event);
                            }
                            else {
                                pom.click();
                            }
                        } else {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error', title: 'Não foi possível encontrar o arquivo, o mesmo pode ter sido removido ou movido de diretório!'
                 });              
                        }
                    }   
             });
        }

        this.navegatorIdentify = function(){
            var ua= navigator.userAgent, tem, 
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
            if(/trident/i.test(M[1])){
                tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
                return 'IE '+(tem[1] || '');
            }
            M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
            if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
           return M.join(' ');
        }

        this.remover = function(idDocto){
            
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: "Deseja remover o anexo?",
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes) {
						 abiAnalysisAttendanceFactory.removerDocComprobatorio(idDocto,
							function (result) {
							    if (result){
									$rootScope.$broadcast(TOTVSEvent.showNotification, {
													   type: 'sucess', title: "Arquivo removido com sucesso!"
									});  

                                    _self.removed = true;
                                    _self.dataItem.idDocto = null;
                                    

                                    $(".k-upload-files").remove();
                                    $(".k-upload-status").hide();
							 }
						 });
                    } else {
                        return ;
                    }             
                } 
            });
             
        }   
        
        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
        $.extend(this, abiAnalysisAttendanceSupDocAttachment);
    }
    index.register.controller('hrs.abiAnalysisAttendanceSupDocAttachment.Control', abiAnalysisAttendanceSupDocAttachment);
});

