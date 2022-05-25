define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
    benefExclusionReceiptFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function benefExclusionReceiptFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hmc/fchsaubenefexclusionreceipt/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getBenefsByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getBenefsByFilter', simpleFilterValue: simpleFilterValue, 
                                                                pageOffset: pageOffset, 
                                                                limit: limit, 
                                                                loadNumRegisters: loadNumRegisters},
                                                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                                                callback);               
        };

        factory.getBenefsByContractingPartyFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getBenefsByContractingPartyFilter', simpleFilterValue: simpleFilterValue, 
                                                                                pageOffset: pageOffset, 
                                                                                limit: limit, 
                                                                                loadNumRegisters: loadNumRegisters},
                                                                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                                                                callback);               
        };


        factory.getBenefsByContract = function(modalityRange, contractRange, userRange, callback){

            this.TOTVSQuery({method: 'getBenefsByContract', modalityIni: modalityRange.start, modalityFim: modalityRange.end, 
                                                            contractIni: contractRange.start, contractFim: contractRange.end,
                                                            userIni: userRange.start, userFim: userRange.end},
                                                            callback);
        }

        factory.getBenefsByContractingParty = function(contractingPartyRange, dateRange, callback){

            this.TOTVSQuery({method: 'getBenefsByContractingParty', contractingPartyIni: contractingPartyRange.start, 
                                                                    contractingPartyFim: contractingPartyRange.end,
                                                                    dateIni: dateRange.start, dateFim: dateRange.end},
                                                                    callback);
        }


        factory.getBenefByProtocol = function(protocol, callback){            

            this.TOTVSQuery({method: 'getBenefByProtocol', protocol: protocol},
                                                           callback);            

        }

        factory.getBenefsByProtocolDate = function(dateRange, callback){

            this.TOTVSQuery({method: 'getBenefsByProtocolDate', dateIni: dateRange.start, dateFim: dateRange.end},
                                                                callback);
        }

        factory.generateExclusionReceipt = function (selectedBenefs, parameters, callback) {            
            
            this.TOTVSPost({method: 'generateExclusionReceipt'}, {tmpBenefExclusionReceipt: selectedBenefs, 
                                                                  tmpParameters: parameters},
                                                                  callback);
        }        

		return factory;
	}
	
	index.register.factory('hmc.benefExclusionReceipt.Factory', benefExclusionReceiptFactory);	
});
