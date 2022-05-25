define(['index'], function(index) {

	index.register.filter('numberOnly', function(){
		return function (input) {
			var inputAux = input.replace(/[^0-9]/g, '');
			return inputAux;
			
		};
	});
	
	index.register.filter('decimal', function(){
		return function (input) {
			var inputAux = input.replace(/[^0-9.,]/g, '');
			//inputAux = inputAux.replace(/(\d)(\d{2})$/, '$1.$2');
			return inputAux;
			
		};
	});
	
	index.register.filter('ordemFilter', function(){
		return function (input) {
			var inputAux = input.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d)(\d{3})$/, '$1.$2');
			inputAux = inputAux.replace(/(\d)(.{7})$/, '$1.$2');
			return inputAux;
			
		};
	});
	
	index.register.filter('tipoManutFilter', function(){
		return function (input) {
			var inputAux = input.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d)(\d{3})$/, '$1.$2');
			return inputAux;
			
		};
	});
	
	index.register.filter('horaFilter', function(){
		return function (input) {
			var inputAux = input.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d)(\d{2})$/, '$1:$2');
			return inputAux;
			
		};
	});
	
	index.register.filter('ordemMask', function(){
		return function (text, input) {
			text = String(text);
			var inputAux = text.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d)(\d{3})$/, '$1.$2');
			inputAux = inputAux.replace(/(\d)(.{7})$/, '$1.$2');
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