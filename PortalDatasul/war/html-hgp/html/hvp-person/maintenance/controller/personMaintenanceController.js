define(['index',
	'/dts/hgp/html/global/hcgGlobalFactory.js',
	'/dts/hgp/html/hvp-person/maintenance/controller/addressMaintenanceModalController.js',
	'/dts/hgp/html/hvp-person/maintenance/controller/contactMaintenanceModalController.js',
	'/dts/hgp/html/enumeration/backyardTypeEnumeration.js',
	'/dts/hgp/html/enumeration/addressTypeEnumeration.js',
	'/dts/hgp/html/enumeration/contactTypeEnumeration.js',
	], function(index) {

	personMaintenanceController.$inject = ['$rootScope', '$scope', '$stateParams', 
                                           'totvs.app-main-view.Service', 'totvs.utils.Service',
	                             	       '$location', '$state','$modal', '$timeout', 
	                             	       '$window', 'hcg.global.Factory', 'TOTVSEvent'];

	function personMaintenanceController($rootScope, $scope, $stateParams,
                                         appViewService, totvsUtilsService,
                                         $location, $state, $modal, $timeout, 
                                         $window, hcgGlobalFactory, TOTVSEvent) {

        var _self = this;

        $scope.CONTACT_TYPE_ENUM  = CONTACT_TYPE_ENUM;
        /*$scope.BACKYARD_TYPE_ENUM = BACKYARD_TYPE_ENUM;
        $scope.ADDRESS_TYPE_ENUM  = ADDRESS_TYPE_ENUM;*/
        
        _self.contactTypeValue  = CONTACT_TYPE_ENUM.ENUMERATION_VALUES;
        /*_self.backyardTypeValue = BACKYARD_TYPE_ENUM.ENUMERATION_VALUES;
        _self.addressTypeValue  = ADDRESS_TYPE_ENUM.ENUMERATION_VALUES;*/

        $scope.person = {};
        _self.lgManutencaoPrestadores = false;

        $scope.contact = {};
        $scope.isContactVisible = true;

        _self.originalContact = undefined;
        /*_self.originalAddress = undefined;*/

        _self.removedContacts = [];

		this.initPersonMaintenance = function() {

		};

		/*this.editAddress = function(addressToEdit, addressIndex){
			_self.address = angular.copy(addressToEdit);

            var addressModal = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-person/maintenance/ui/addressMaintenanceModal.html',
                backdrop: 'static',
                controller: 'hvp.addressMaintenanceModalController as modalController',
                windowClass: 'extra-large',
                keyboard: false,
                resolve: 
                	{
                    personMaintenanceController: function () {
                        return _self;
                    },
                    addressToEdit: function(){
                        return addressToEdit;
                    },
                    addressIndex: function(){
                        return addressIndex;
                    }
                }
            });            
        };*/

        this.editContact = function(contactToEdit, contactIndex){
        	$scope.contact = angular.copy(contactToEdit);
        	$scope.isContactVisible = false;

            var contactModal = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-person/maintenance/ui/contactMaintenanceModal.html',
                backdrop: 'static',
                controller: 'hvp.contactMaintenanceModalController as modalController',
                windowClass: 'extra-large',
                keyboard: false,
                scope: $scope,
                resolve: {
					personMaintenanceController: function () {
                        return _self;
                    },
                    contactToEdit: function(){
                        return contactToEdit;
                    },
                    contactIndex: function(){
                        return contactIndex;
                    }
                }
            });            
        };

		this.addContact = function () {
        	if($scope.contact == undefined
            || $scope.contact['tp-contato'] == undefined){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', 
                    title: 'Tipo de Contato não foi informado!'
                });

                totvsUtilsService.focusOn('tipoContato');
                return;
            }

            if($scope.contact == undefined
            || $scope.contact['ds-contato'] == undefined
            || $scope.contact['ds-contato'] == ''){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: 'Contato não foi informado!'
                });

                totvsUtilsService.focusOn('contato');
                return;
            }

            $scope.person.contatos.unshift(angular.copy($scope.contact));
            _self.unsavedContactsNumber ++;
            _self.afterAddContact();

            return true;
		};

		this.afterAddContact = function () {
		    $scope.contact = {};
		    $scope.isContactVisible = true;
            totvsUtilsService.focusOn('tipoContato');
		};

		this.removeContact = function(contact, contactIndex){
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você realmente deseja remover o contato ' + contact['ds-contato']
                    + '?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    _self.doRemoveContact(contact, contactIndex);
                }
            }); 
        };

		this.doRemoveContact = function (contact, index, isFromEdit) {
			//se veio do editar nao coloca na temp de contatos removidos 
            if(isFromEdit != true){
                if(contact['id-contato'] > 0){
                    _self.removedContacts.push(angular.copy(contact));
                }
            }

            if(_self.unsavedContactsNumber > index){
                _self.unsavedContactsNumber --;
            }

            $scope.person.contatos.splice(index, 1);
        };

		//Atualiza dados da pessoa
        this.updatePersonData = function (person) {
            if (person.tmpDemographic != undefined 
             && person.tmpDemographic.length > 0){

                $scope.person = person.tmpDemographic[0];

                if($scope.person['lg-sexo'] == true){
                    $scope.person['in-sexo'] = 'M';
                }else{
                    $scope.person['in-sexo'] = 'F';
                }
                
            }else{
                $scope.person = person.tmpCompany[0];
            }

            $scope.person.enderecos = person.tmpAddress;
            $scope.person.contatos  = person.tmpContact;
        };

      	$scope.$on('$viewContentLoaded', function(){
            _self.initPersonMaintenance();
       	}); 
	}
	
	index.register.controller('hvp.personMaintenanceController', personMaintenanceController);	
});