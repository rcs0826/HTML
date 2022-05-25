
// O AngularJS Resource mudou sua assinatura após a versão 1.3, para mantêr a
// compatibilidade e diminuir a replicação de código, a lógica de callback dos
// promisses foi externalizada nesta função a baixo.
var processPromise = function(call, callback) {
	if (call && call.hasOwnProperty('$then')) {
		call.$then(function (result) {
			if (callback) {
				callback(result.data);
			}
		});
	} else {
		call.$promise.then(function (result) {
			if (callback) {
				// Tratamento para quando uma operação de PUT ou POST retornar 
				// um erro que seja apresentado em tela. Neste caso o valor do
				// resultado ficar armazenado na propriedade data da requisição.
				if (result && result.hasOwnProperty('data')) {
					callback(result.data);
				} else {
					callback(result);
				}
			}
		});
	}
};


define(['index'
], function (index) {

	healthDeclaRulesFactoryOld.$inject = ['$resource'];
	
	function healthDeclaRulesFactoryOld($resource){
	
		var factory = $resource('/html-declarasaude/rest/pendauditdeclarasaude/:method/:id', {}, {
			update: {
				method: 'PUT',
				isArray: false
			}
		});
				
	    factory.getannextypelist = function (callback) {
			var call = this.query({method: 'buscarTipoAnexos'});
            processPromise(call, callback);						
		};		

		factory.downloadAnexo = function (id, nomAnexo, callback) {
			var call = this.query({method: 'downloadAnexo', idiPessoa: id, nomAnexo: nomAnexo});
			processPromise(call, callback);			
		};
        
		return factory;		
	}
	

    index.register.factory('hvp.healthDeclaRulesFactoryOld', healthDeclaRulesFactoryOld);
});