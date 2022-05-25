/* global angular*/
define(['index'], function(index) {
    

    configController.$inject = ['$rootScope', '$filter', 'totvs.app-main-view.Service', 'mpd.fchdis0052.Factory','dts-utils.message.Service'];

    function configController($rootScope, $filter, appViewService, fchdis0052, messageUtils) {
        
        var configController = this;
        
        var i18n = $filter('i18n');
        
        configController.configs = [];
        configController.configCount = 0;

        configController.search = function() {
            configController.loadData(configController.quickSearchText);    
        }

        configController.loadData = function (search, more) {
            fchdis0052.getConfigurations ({
                start: more ? configController.configs.length : 0, 
                search: search
            },function (data) {
                if (more) {
       				angular.forEach(data, function(value) {
                        configController.configs.push(value);
                    });
                } else {
                    configController.configs = data;
                    configController.configCount = 0;
                    if (data.length > 0) 
                        configController.configCount = data[0].$length;
                }                
            })

        }

        configController.loadMore = function () {
            configController.loadData(configController.quickSearchText,true);  
        }

        configController.addUser = function (sel) {
            fchdis0052.addConfiguration({}, {
                configType: 3,
                groupUser: sel['cod_usuario']
            }, function () {
                configController.loadData();
            })
        }

        configController.addGroup = function (sel) {
            fchdis0052.addConfiguration({}, {
                configType: 2,
                groupUser: sel['cod_grp_usuar']
            }, function () {
                configController.loadData();
            })
        }

        configController.addAll = function () {
            fchdis0052.addConfiguration({}, {
                configType: 1,
                groupUser: ""
            }, function () {
                configController.loadData();
            })
        }

        configController.delete = function(config) {

   			messageUtils.question( {
				title: 'Remover Configuração',
				text: $rootScope.i18n('Confirma a eliminação da configuração?'),
				cancelLabel: 'Não',
				confirmLabel: 'Sim',
                defaultCancel: true,
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
                        fchdis0052.deleteConfiguration ({
                            idiSeq : config['idi-seq']
                        },function() {
                            configController.loadData();
                        });
					}
				}
			});


        }
        
        appViewService.startView(i18n('Configuração PD4000'));
        configController.loadData();
        
    }

    index.register.controller('salesorder.pd4000.config.Controller', configController);
    
});

