define(['index'], function(index) {
	index.register.filter('numberOnly', function(){
		return function (input) {
			var inputAux = input.replace(/[^0-9]/g, '');
			return inputAux;
		};
	});
	index.register.filter('decimal', function(){
		return function (input) {
			var inputAux = input.replace(/[^0-9]/g, '');
			inputAux = inputAux.replace(/(\d)(\d{4})$/, '$1,$2');
			inputAux = inputAux.replace(/(\d)(.{8})$/, '$1.$2');
			inputAux = inputAux.replace(/(\d)(.{12})$/, '$1.$2');
			return inputAux;
			
		};
	});
});