define(['index'], function(index) {

    // *********************************************************************************
    // *** Controller Pesquisa Avançada
    // *********************************************************************************
	costssimulationSearchCtrl.$inject = [ 	    
 		'$modalInstance', 
 		'$scope',
 	    'model',
 	    '$filter',
 	    'fchman.fchman0008.Factory',
		'men.referenciaitem.zoom'];

 	
 	function costssimulationSearchCtrl ($modalInstance,$scope,model,$filter,fchmanproductionplanFactory,serviceItemReferenceZoom) {	
 	    // recebe os dados de pesquisa atuais e coloca no controller
 	    var controller = this;
		
		this.advancedSearchModel = model;
        this.advancedSearch = clone(this.advancedSearchModel);
 	    this.itemHasReference = true;
	    this.closeOther = false;
		this.serviceItemReferenceZoom = serviceItemReferenceZoom;
	    $scope.oneAtATime = true;
	    
	    $scope.status = {
    	    isFirstOpen: true,
    	    isFirstDisabled: false
	    };

 	    // ação de pesquisar
 	    this.search = function () {
			for (var key in this.advancedSearch) {
				if (this.advancedSearchModel.hasOwnProperty(key)) {
					this.advancedSearchModel[key] = this.advancedSearch[key];
				}
			}
            
 	        // close é o fechamento positivo
 	        $modalInstance.close();
 	    }
 	     
 	    // ação de fechar
 	    this.close = function () {
 	        // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
 	        $modalInstance.dismiss();
 	    }
        
        
		
 	}

	function clone(obj) {
		var copy;

		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = clone(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	}

    index.register.controller('mcs.costssimulation.SearchCtrl', costssimulationSearchCtrl);
});