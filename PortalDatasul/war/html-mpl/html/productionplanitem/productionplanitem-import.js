define(['index'], function(index) {
	
	/**
	 * Controller Modal Necessidades
	 */
	
	ImportCtrl.$inject = ['$modalInstance',
	                      '$rootScope',
	                      'model',
	                      'fchman.fchmanproductionplanitem.Factory',
	                      'TOTVSEvent'];
    
    function ImportCtrl ($modalInstance,
                         $rootScope,
                         model,
                         fchmanproductionplanitemFactory,
                         TOTVSEvent) {
        
        var controller = this;
    	
        // recebe os dados de pesquisa atuais e coloca no controller
        this.model = model;
        this.isOpen = true;
        
        this.planCode = controller.model.planCode;
        this.planDescription = controller.model.planDescription;
        
        this.override = false;
        this.importType = 1;
        this.file;
        this.layout = null;
        
        /* Função....: onChangeDataPeriodo
           Descrição.: evento ng-change do radio data/periodo
           Parâmetros: state: 1 - Período/Ano, 2 - Data */
        this.onChangeDataPeriodo = function (state) {
            controller.importType = state;
        };
        
        /* Função....: changeFile
           Descrição.: evento ngf-change do botão Selecionar Arquivo
           Parâmetros: $files - objeto do arquivo selecionado */
        this.changeFile = function ($files) {
            if ($files.length < 1) {
                controller.file = undefined;
                return;
            }
            
            controller.file = $files[0];
        };
        
        /* Função....: downloadLayout
           Descrição.: Gera arquivo de layout e abre janela para salvar
           Parâmetros:  */
        this.downloadLayout = function () {
            
            var textToWrite = "#Item;Estabelec;Periodo/Ano;Data;Quantidade;Referencia;NomeAbrev;GrupoCliente;PedidoCliente;Seq\n\n";
            
            controller.saveTextAsFile("mpl.csv", textToWrite);
        };
        
        
        this.saveTextAsFile = function (fileNameToSaveAs, textToWrite) {
            /* Saves a text string as a blob file*/  
            var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
                ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
                ieEDGE = navigator.userAgent.match(/Edge/g),
                ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

            if (ie && ieVer<10) {
                console.log("No blobs on IE ver<10");
                return;
            }

            var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});

            if (ieVer>-1) {
                window.navigator.msSaveBlob(textFileAsBlob, fileNameToSaveAs);
            } else {
                var downloadLink = document.createElement("a");
                
                downloadLink.download = fileNameToSaveAs;
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = function(e) { document.body.removeChild(e.target); };
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
                downloadLink.click();
            }
        }
        
        /* Função....: import
           Descrição.: ação de clicar no botão importar.
                       Chama o método importItemsFile da fachada fchmanproductionplanitemFactory, 
                       usado para importar as necessidades do arquivo selecionado
           Parâmetros:  */
        this.import = function () {
            if (controller.file) {
                var parameters = {planCode: controller.planCode,
                                  importType: controller.importType, /* 1 - Período/Ano, outro - Data*/
                                  overrideItems: controller.override,
                                  file: controller.file};

                fchmanproductionplanitemFactory.importItemsFile(parameters,
                    function (result) {
                        if (!result['$hasError']) {
                            // notifica o usuario que o registro foi removido
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', // tipo de notificação
                                title: $rootScope.i18n('l-imported-items'), // titulo da notificação
                                detail: $rootScope.i18n('msg-imported-itens') // detalhe da notificação
                            });
                            $modalInstance.close();
                        }

                    }, function (progress, event) {
                        //console.log("import", "function: Progress", progress, event);

                    }, function (result, status, headers, config) {
                        //console.log("import", "function: Error", result, status, headers, config);
                });
            };
        };
        
        /* Função....: close
           Descrição.: ação de clicar no botão fechar
           Parâmetros:  */
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        };
    };
    
    index.register.controller('mpl.productionplanitem.ImportCtrl', ImportCtrl);
    
});