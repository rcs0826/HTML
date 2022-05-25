define(['index'], function(index) {
    
	// ########################################################
	// ### Services
	// ########################################################

	fchdis0035.$inject = ['$totvsresource', '$cacheFactory'];
	function fchdis0035($totvsresource, $cacheFactory) {

		/*
		 * Objetivo: Fazer o encapsulamento do atributo companyId (empresa) para efetuar a troca de empresa.
		 * Método:  setCompanyId -> seta a empresa selecionada
		 *          getCompanyId -> retorna a empresa selecionada
		*/
		var factoryCompany = {
			companyId: undefined,
			setCompanyId: function (cid) {
				factoryCompany.companyId = cid;
			},
			getCompanyId: function () {
				return factoryCompany.companyId;
			}
		};

		var specificResources = {
			/*
			 * Objetivo: Retorna informações da empresa logada e lista de empresas do usuário
			 * Parâmetros:  Saída:  ttEmpresasUsuar: lista de empresas do usuário
									p-cod-empresa: código da empresa logada
									p-razao-social: razão social da empresa logada
			 * Observações:
			 */
			'getChangeCompany':{
				method: 'POST',
				isArray: false,
				params: {"codempresa":"@pCodEmpresa"},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/changeCompany/',
				headers:{'companyId':factoryCompany.getCompanyId}
			},
			'getDataCompany':{
				method: 'GET',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/dataCompany/'
			},
			'dtsGetUserRoles':{
				method: 'GET',
				isArray: false,
				params: {usuario: '@usuario'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/getUserRoles'
			},
			'dtsGetVisibleFields':{
				method: 'GET',
				isArray: true,
				params: {cTable: '@cTable'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/visiblefields/'
			},
			'isCRMActive': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/is_crm_active'
			},
			'getSalesOrderPreferences': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/salesorderpreferences',
				params: {}
			}
		}

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/:method', {}, specificResources),
			cache = $cacheFactory('mpd.fchdis0035.Cache');

		angular.extend(factory, factoryCompany);

		factory.getUserRoles = function (usuario, callback, isAllowedCache) {
			isAllowedCache = isAllowedCache !== false;

			var idCache = 'getUserRoles' + usuario,
				result = (isAllowedCache == true ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.dtsGetUserRoles(usuario, function (data){
					if (isAllowedCache == true) {
						cache.put(idCache, data);
					}

					if (callback) { callback(data); }
				});
			}
		};

		factory.getVisibleFields = function (cTable, callback, isAllowedCache, user) {

		// so aplica o cache se informado usuario, n e necessario p/ requisicao, mas sim p/ o id do cache
			isAllowedCache = (isAllowedCache !== false && user) ? true : false;

			var idCache = 'getVisibleFields-' + cTable.cTable + '-' + (user ? user : ''),
				result = (isAllowedCache == true ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.dtsGetVisibleFields(cTable, function (data) {

					if (isAllowedCache == true) {
						cache.put(idCache, data);
					}

					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	};   
         
	index.register.factory('mpd.fchdis0035.factory', fchdis0035); 
});
