define(['index',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
    '/dts/hgp/html/global-provider/providerZoomController.js',	
    '/dts/hgp/html/hvp-healthDeclaRules/healthDeclaRulesFactory.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'
], function (index) {
 
    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    importFileController.$inject = ['$rootScope', '$scope', '$modalInstance','TOTVSEvent','hvp.healthDeclaRulesFactory','isSearch'];
    function importFileController($rootScope, $scope, $modalInstance,TOTVSEvent,healthDeclaRulesFactory,isSearch) {

        var _self = this;
        this.model = {};
        _self.listFiles = [];


        function navegatorIdentify(){
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


        function download(filename, text) {
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);
            console.log(navegatorIdentify());

            if (navegatorIdentify().toLowerCase().indexOf('ie') >= 0){                
                var URI = 'data:text/csv;charset=utf-8,';
                var donwloadIe = window.open("about:blank", "_blank");
                donwloadIe.document.write(text); //fileData has contents for the file
                donwloadIe.document.close();
                donwloadIe.document.execCommand('SaveAs', false, filename);
                donwloadIe.close();
            }else{
                if (document.createEvent) {
                    var event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    pom.dispatchEvent(event);
                }
                else {
                    pom.click();
                }
            }
           
        }
 	    // Realiza a importacao de aquivo no servidor
        this.uploadFile = function($files) {
	       var dsMensagem  = "";
            _self.hasDoneSearch = false;
            successCallback = function (result,dsMensagem) {
                for (var x = 0; x < result.length; x++) {

                       dsMensagem = dsMensagem + result[x].dserror + "\r";
                }                

               if (dsMensagem !=  ""){
                    download('Relatorio de importação.csv', dsMensagem);

                         $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error', title: 'Ocorreram erros durante processo de importação. Consulte relatório!'
                                               
                          });                           
                }
                else{
                     $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Importação concluida com sucesso'
                     });       
                }
                _self.hasDoneSearch = true;
            };

            progressCallback = function (progress, event,dsMensagem) {
            };

            errorCallback = function (result, status, headers, config, attachmentInstance) {
            };           

		   files = $files;
           for (var i = 0; i < files.length; i++) {                    
                var file = files[i];
                 
                var teste  =  healthDeclaRulesFactory.upload(file,"nome","",dsMensagem,successCallback, progressCallback,errorCallback); 


				/*console.log("esse é o file");
                console.log(file);
                $upload.upload({
                    url: '/html-declarasaude/rest/declarasaudeparam/uploadFile' ,
                    file: file
                }).progress(function(evt) {
                    console.log('percent:',evt);
              	}).success(function(result, status, headers, headers) {
					console.log(result);
					console.log(status);
					console.log(headers);
					console.log(headers);
                    if(result != ""){
						 $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error', title: 'Ocorreram erros durante a chamada'
                                               
                          });						  
                    }                                        
                });*/
            }
        }        

        this.createLayout = function(){            
              download('Layout_de_importacao.csv', "Inserir o codigo do contratante;Grupo do contratante;Descricao do tipo de anexo(CPF ou RG ou etc..);Quantidade de beneficiarios;Descricao do tipo do modulo('Acesso Empresarial' ou 'Produto Padrão' ou 'Ambos'; modalidade : Proposta;modalidade : proposta;");
        }

        /*Metodo para buscar o label do status que foi selecionado na busca avancada*/
        this.importFile = function () {
     
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
            
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this);
        
    }

    index.register.controller('hvp.importFileController', importFileController);
});

