define(['index'], function(index) {
    timeCast.$inject = [];
    function timeCast() {

    	var _self = this;

    	_self.milisecondsToHour = function(valor){

            horas = Math.floor(valor / 3600000);
            minutos = Math.floor((valor % 3600000) / 60000);
            segundos = Math.floor(((valor % 3600000) % 60000) / 1000);
            milissegundos = (((valor % 3600000) % 60000) % 1000) / 1000;

            return formatToMaxLength(horas, Math.max(horas.toString().length, 2)) +":"+ 
                   formatToMaxLength(minutos,2) + ":" + 
                   formatToMaxLength(segundos,2) + 
                   milissegundos.toFixed(3).replace("0.",",");
        };
        _self.hourToMiliseconds = function(valor){
            valor = valor.split(":");
            return Math.round((valor[0] * 3600000) + (valor[1] * 60000) + (valor[2].replace(",",".") * 1000));
        };
    	return _self;
    }

    function formatToMaxLength(value, maximumLength, str){
        var valueLength = String(value).length;
        var arrayLength = maximumLength - valueLength +1;
        if(arrayLength <= 0)
            return value;
        else
            return Array(arrayLength).join(str||'0')+value;
    };

    index.register.service('kbn.timeCast.Service', timeCast);

});