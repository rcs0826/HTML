define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	hacGlobalFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function hacGlobalFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hac/fchsauhacglobal/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getTissEstadiamentoTumorByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissEstadiamentoTumorByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
		};

        factory.getTissChemotherapyTypeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissChemotherapyTypeByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
		};

        factory.getTissTreatmentPurposeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissTreatmentPurposeByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
		};

        factory.getTissECOGByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissECOGByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

        factory.getTissViaAdministracaoByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissViaAdministracaoByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

        factory.getTissDiagnosticoImgByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissDiagnosticoImgByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

        factory.getTissBillingTypeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissBillingTypeByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };
                
        factory.getTissInternmentTypeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissInternmentTypeByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };
                
        factory.getTissInternmentRegimeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissInternmentRegimeByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

        factory.getTissAccidentIndicationByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissAccidentIndicationByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

        factory.getTissLeaveReasonByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissLeaveReasonByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };
                
        factory.getTissAttendanceTypeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissAttendanceTypeByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };
        
        factory.getTissConsultationTypeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissConsultationTypeByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

        factory.getTissTechniqueByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissTechniqueByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

        factory.getTissProviderLevelByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTissProviderLevelByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

        factory.getClinicByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getClinicByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

		return factory;
	}
	
	index.register.factory('hac.global.Factory', hacGlobalFactory);	
});
