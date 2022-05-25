var StringTools = {};

// hasOnlyNumbers
StringTools.hasOnlyNumbers = function(string){		
    var hasOnlyNumbers = /^\d+$/.test(string);
    return hasOnlyNumbers;
};

// hasOnlyNumbersBar
StringTools.hasOnlyNumbersBar = function(string){		
	var hasOnlyNumbersBar = /^\d\/\d+$/.test(string);
	return hasOnlyNumbersBar;
};

// fill
StringTools.fill = function(code, char, length){		
    var buffer = '' + code;

    while(buffer.length < length){
        buffer = char + buffer;
    }

    return buffer;
};

// fill
StringTools.fillRight = function(code, char, length){		
    var buffer = '' + code;

    while(buffer.length < length){
        buffer = buffer + char;
    }

    return buffer;
};

//number = numero a converter
//c = numero de casas decimais
//d = separador decimal
//t = separador milhar
StringTools.formatNumberToCurrency = function(number){
    var c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = number < 0 ? "-" : "", i = parseInt(number = Math.abs(+number || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return 'R$ ' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(number - i).toFixed(c).slice(2) : "");
};
