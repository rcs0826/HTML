define(['index'], function(index) {

	index.register.filter('orderNumberMask', function(){
		return function (text, input) {
			text = String(text);
			var inputAux = text.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d)(\d{3})$/, '$1.$2');
			inputAux = inputAux.replace(/(\d)(.{7})$/, '$1.$2');
			return inputAux;
		};
	});

	index.register.filter('taskTimeMask', function(){
		return function (text, input) {
			text = String(text);
			var inputAux = text;
			inputAux = inputAux.replace(/(\d)(?=(\d{3})+\.)/g, '$1,$2');
			return inputAux;
		};
	});

	index.register.filter('enterLineTextArea', function(){
		return function (text, input) {
			text = String(text);
			var inputAux = text;
			inputAux = inputAux.replace(/\r\n|\r|\n/g,"\n");				
			return inputAux;
		};
	});
	
	index.register.filter('numberMask', function(){
		return function (input) {
			var inputAux = input.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d)(\d{3})$/, '$1.$2');
			return inputAux;
			
		};
	});
	
	index.register.filter('decimal', function(){
		return function (input) {

			var charAux    = input.split("");
			var qntVirgula = 0;
			var intAux     = input.length;
			intAux = intAux - 1.

            angular.forEach(charAux, function (value) {
            	if (value == ",") {
            		qntVirgula = qntVirgula + 1.
            	}
            });

            if (qntVirgula > 1) {
            	inputAux = input.slice(0,intAux);
            } else {
            	if (qntVirgula == 1) {
            		intAux = input.indexOf(",");
            		intAux = input.length - intAux;
            		if (intAux > 4){
            			inputAux = input.replace(/[^0-9]/g, '');
            			inputAux = inputAux.replace(/(\d)(\d{4})$/,"$1,$2");

            		} else {
            			inputAux = input.replace(/[^0-9^,]/g, '');
            		}
            	} else {
					inputAux = input.replace(/[^0-9^,]/g, '');
					inputAux = inputAux.replace(/(\d)(\d{4})$/,"$1,$2");
            	}
            }
			return inputAux;
		};
	});

	index.register.filter('percentMask', function(){
		return function (text, input) {
			text = String(text);
			var inputAux = text.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d{3})(\d)/g, '$1,$2');
			return inputAux;			
		};
	});

	index.register.filter('timeMask', function(){
		return function (input) {
			var inputAux = input.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d)(\d{2})$/, '$1:$2');
			return inputAux;
			
		};
	});
	
	index.register.filter('tecnicoMask', function(){
		return function (text, input) {
			text = String(text);
			var inputAux = text.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d)(\d{1})$/, '$1-$2');
			return inputAux;
			
		};
	});
	

});
