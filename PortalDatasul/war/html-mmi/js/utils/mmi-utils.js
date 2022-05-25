define(['index'], function (index) {
	
	mmiServiceUtils.$inject = ['$rootScope'];

	var _MS_PER_DAY = 1000 * 60 * 60 * 24;
	
	function mmiServiceUtils($rootScope) {
        return {
        	
        	removePontos: function(value) {
        		if (value) {
        			return value.replace(/\./g, "");
    			}
        	},
        	
        	getCharValue: function(value) {
        		if (value === undefined) {
        			return "";
        		} else {
        			return value;
        		}
        	},
    	    
    	    getIntValue: function(value) {
    	    	if (isNaN(value) || value === undefined) {
    	    		return 0;
    	    	} else {
    	    		return value;
    	    	}
    	    },
        	
        	isInvalidValue: function(value) {
        		return value === undefined || value.length === 0;
        	},
    	    
        	buscaNomeEstadoOrdem: function(index) {
        		var estados = [$rootScope.i18n("l-not-started"),
        		               $rootScope.i18n("l-released"),
        		               $rootScope.i18n("l-reserved"),        		               
        		               "", /** Separada - não se aplica para OM **/
        		               $rootScope.i18n("l-requested"),
        		               $rootScope.i18n("l-started"),
        		               $rootScope.i18n("l-finished"),
        		               $rootScope.i18n("l-done")];
        		return estados[index - 1];
        	},
        	
        	converteValorBranco: function(value) {
        		if (value === "" || value === 0) {
        			return undefined;
        		} else return value;
			},
			
			calculaDiferencaDatas: function(dataIni, dataFim) {
				var utc1 = Date.UTC(dataIni.getFullYear(), dataIni.getMonth(), dataIni.getDate());
				var utc2 = Date.UTC(dataFim.getFullYear(), dataFim.getMonth(), dataFim.getDate());

				return Math.floor((utc2 - utc1) / _MS_PER_DAY);
			},
			
			converteDataHoraInvertida: function(data, hora) {
				data = new Date(data);
				var dia = data.getDate();
				if (dia < 10) dia = "0" + dia.toString();
				var mes = data.getMonth() + 1;
				if (mes < 10) mes = "0" + mes.toString();
				return data.getFullYear().toString() + mes + dia + hora;
			},

			geraCsv: function(result, fileName){

				var universalBOM = "\uFEFF"; /* força codificação UTF-8*/
	
				if (result && result.csv != "") {
					var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
						ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
						ieEDGE = navigator.userAgent.match(/Edge/g),
						ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));
	
					if (ie && ieVer<10) {
						console.log("No blobs on IE ver<10");
						return;
					}
		
					var textFileAsBlob = new Blob([result.csv], {type: 'text/plain'});					
	
					if (ieVer>-1) {
						window.navigator.msSaveBlob(textFileAsBlob, fileName);
					} else {
						var a         = document.createElement('a');
						a.href        = 'data:attachment/csv;charset=utf-8,' +  encodeURIComponent(universalBOM+result.csv);
						a.target      = '_blank';
						a.download    = fileName;
	
						document.body.appendChild(a);
						a.click();
					}
				}
			}
    	    
        };
	};
	
	index.register.service('mmi.utils.Service', mmiServiceUtils);	
});