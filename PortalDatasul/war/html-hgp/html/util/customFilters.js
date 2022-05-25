/*JS que contem os filtros customizados para usar na tela*/

define(['index',
        '/dts/hgp/html/js/util/StringTools.js'], function (index) {
 
	index.register.filter('cpf', function(){
	    return function(cpf){
	    	if(angular.isUndefined(cpf) == true 
	    	|| cpf.length != 11){
	    		return cpf;
	    	}

	        return cpf.substr(0, 3) + '.'
	             + cpf.substr(3, 3) + '.' 
	             + cpf.substr(6, 3) + '-' 
	             + cpf.substr(9,2);
	    };
	});

	index.register.filter('cnpj', function(){
	    return function(cnpj){
	    	if(angular.isUndefined(cnpj) == true
	    	|| cnpj.length != 14){
	    		return cnpj;
	    	}

	        return cnpj.substring(0, 2)  + "." 
			     + cnpj.substring(2, 5)  + "."
			     + cnpj.substring(5, 8)  + "/" 
			     + cnpj.substring(8, 12) + "-"
			     + cnpj.substring(12, 14);
	    };
	});

	index.register.filter('cep', function(){
	    return function(cep){
	    	if(angular.isUndefined(cep) == true 
	    	|| cep.length != 8){
	    		return cep;
	    	}

	        return cep.substring(0, 5) + "-" 
			 	 + cep.substring(5, 8);
	    };
	});
        
    index.register.filter('time', function(){
	    return function(time){
	    	if(angular.isUndefined(time) == true 
	    	|| StringTools.hasOnlyNumbers(time) == false){
	    		return time;
	    	}

	    	if(time.length <= 4){
	    		time = StringTools.fill(time,"0",4);
	        	return time.substring(0, 2) + ":" + time.substring(2);
			}else{
	    		time = StringTools.fill(time,"0",6);
	        	return time.substring(0, 2) + ":" + time.substring(2, 4) + ":" + time.substring(4);
	    	}
	    };
	});

	index.register.filter('tpMovtoRessus', function(){
	    return function(tpMovtoRessus){
	    	if(angular.isUndefined(tpMovtoRessus) == true){
	    		return tpMovtoRessus;
	    	}

	    	switch(tpMovtoRessus){
	    		case "P": 
	    			 return "Principal"
	    		case "E": 
	    			 return "Especial"
	    		case "S": 
	    			 return "Secundário"
	    	}
	    	
	    };
	});
});