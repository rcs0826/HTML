define(['index'], function(index) {
    function appendString(input, value) {
        if (input === "") return value;
        if (value === "") return input;
        return input + " - " + value;
    }

    function prettyProductFilter() {
        return function(input) {
            var sku = input.sku;
            var des = input.description;
            var ref = input.reference;

            var str = "";
            str = appendString(str, sku);
            str = appendString(str, des);
            str = appendString(str, ref);

            return str;
        };
    }

    function trimmTime(input) {
        if (input < 10) return "0" + input;
        return input;
    }

    function prettyTimeFilter() {
        return function(input) {
            if (!input) return null;

            var date = new Date(input);
            var hh = Math.floor(input / 3600000);
            var mm = date.getUTCMinutes();
            var ss = date.getSeconds();

            hh = trimmTime(hh);
            mm = trimmTime(mm);
            ss = trimmTime(ss);

            return hh + ":" + mm + ":" + ss;
        };
    }

    function countKanbanFilter() {
        return function(input, type) {
            if (!input) return null;
            var count = 0;
            if (type == "red") count = input.totalKanbans - input.totalGreenZone - input.totalYellowZone;
            if (type == "yellow"){
                count = Math.min(input.totalKanbans - input.totalGreenZone, input.totalYellowZone);
            }
            if (type == "green") {
                count = Math.min(input.totalKanbans, input.totalGreenZone);
            }
            return Math.max(count, 0);
        };
    }

    function numberOnly(){
        return function (input) {

            if (!input && input!==0)
                return null;

            var inputAux;

            if(typeof(input)=="number"){
                inputAux = parseInt(input.toString().replace(/[^0-9]/g, ''));
            }else{
                inputAux = input.replace(/[^0-9]/g, '');
            }

            return inputAux;
        };
    }

    function kanbanPercentFilter($filter) {
        return function(input, type) {
            if (!input) return "0%";
            var count = 0;

            var ratio = countKanbanFilter()(input, type);
            var total = 1;
            if (type == "red") total = input.totalRedZone;
            if (type == "yellow") total = input.totalYellowZone;
            if (type == "green") total = input.totalGreenZone;

            count = ratio / total * 100;
            return count + "%";
        };
    }

    filterDateFormat.$inject = ['$rootScope', '$filter'];
    function filterDateFormat($rootScope, $filter) {
        return function (dateToFormat) {

            var oDate = new Date(dateToFormat);

            if(isNaN(oDate)){
                return undefined;
            }else{
                this.formatDate = $rootScope.i18n('l-date-format');
                return $filter('date')(oDate, this.formatDate);
            }

        };
    }

    filterDateHourFormat.$inject = ['$rootScope', '$filter'];
    function filterDateHourFormat($rootScope, $filter) {
        return function (dateToFormat) {

            var oDate = new Date(dateToFormat);
            if(isNaN(oDate)){
                return undefined;
            }else{
                this.formatDate = $rootScope.i18n('l-datehour-format');
                return $filter('date')(oDate, this.formatDate);
            }

        };
    }

    function stackItemsFilter() {
        return function(input, manualItems, automaticItems) {
            return input.filter(function (value) {
                if (automaticItems == manualItems) return true;
                if (automaticItems) return !value.manualProduction;
                if (manualItems) return value.manualProduction;
                return true;
            });
        };
    }

    function stackOrderFilter($filter) {
        return function(input, order, expression, reverse) {
            if (order == 'name') expression = ["sku", "description", "reference"];
            if (order == 'priority') reverse ^= true;
            return $filter('orderBy')(input, expression, reverse);
        };
    }

    descFlow.$inject = ["$filter"];
    function descFlow($filter){
        return function(itemDetail, padrao){

            if (!itemDetail) return "";
            if (!padrao) padrao = "{sku} - {desc} {ref}";

            return $filter('descGeneric')(itemDetail,padrao);
        };
    }

    yesOrNo.$inject = ["$rootScope"];
    function yesOrNo($rootScope) {
        return function(boolean){
            if(boolean) return $rootScope.i18n("l-yes");

            return $rootScope.i18n("l-no");
        };
    }
    
    statusDesc.$inject = ["$rootScope"];
    function statusDesc($rootScope) {
        return function(value){
            if(value == 1) return $rootScope.i18n("l-green");
            if(value == 2) return $rootScope.i18n("l-yellow");
            if(value == 3) return $rootScope.i18n("l-red");
        };
    }

    descGeneric.$inject = ["$rootScope"];
    function descGeneric($rootScope) {
        return function(obj, padrao) {

            if (!obj) return "";
            if (!padrao) return "";

            replaceAll = function(string, search, replacement) {
                return string.split(search).join(replacement);
            };

            defaultCallback = function(value){
                return value;
            };

            var returnValue = padrao;

            var types = {
                "{sku}": {
                    values: ["it-codigo","codeErp","codErp","sku", "cod_chave_erp"],
                    callback: defaultCallback
                },
                "{desc}": {
                    values: ["desc-item","description","name","des_item_erp"],
                    callback: defaultCallback
                },
                "{codeErpCell}": {
                    values: ["codeErp", "codigoCelula", "cod_cel_erp", "cod_chave_erp"],
                    callback: function(value){
                        if(value){
                            return value +  " - ";
                        }else{
                            return "";
                        }
                    }
                },
                "{descCell}": {
                    values: ["cellDescription", "name", "descCelula", "des_cel"],
                    callback: function(value){
                        return value;
                    }
                },
                "{codeErpCt}": {
                    values: ["cod_chave_erp"],
                    callback: function(value){
                        if(value){
                            return value +  " - ";
                        }else{
                            return "";
                        }
                    }
                },
                "{descCt}": {
                    values: ["des_ct_erp"],
                    callback: function(value){
                        return value;
                    }
                },
                "{ref}": {
                    values: ["cod-refer","reference","itemReference","cod_refer"],
                    callback: function(value){
                        if(value && value.trim()){
                            return "(" + value.trim() +  ")";
                        }else{
                            return "";
                        }
                    }
                },
                "{exp}": {
                    values: ["expedited","itemUnique.expedition","expedition","log_expedic", "ttItemDS.log_expedic"],
                    callback: function(value){
                        if(value){
                            return $rootScope.i18n("l-expedition");
                        }else{
                            return $rootScope.i18n("l-process");
                        }
                    }
                },
                "{exp.short}": {
                    values: ["expedited","itemUnique.expedition", "expedition", "log_expedic"],
                    callback: function(value){
                        if(value){
                            return "F";
                        }else{
                            return "P";
                        }
                    }
                }
            };

            for(var type in types){

                for(i=0; i < types[type].values.length; i++){

                    var found = true;
                    var children = types[type].values[i].split(".");
                    var thisvalue = obj;

                    for(j=0; j < children.length; j++){

                        if(children[j] in thisvalue){
                            thisvalue = thisvalue[children[j]];
                        }else{
                            found = false;
                            break;
                        }

                    }

                    if(found){
                        returnValue = replaceAll(returnValue,type,types[type].callback(thisvalue) );
                        break;
                    }

                }

                if(!found) {
                    returnValue = replaceAll(returnValue,type,"");
                }

            }

            return returnValue;

        };
    }

    function descIdContainsFilter() {
        return function(array, buscaTexto) {
            var fn = function(e) {
                var busca = buscaTexto.toLowerCase();
                var codigo = e.cod_estab_erp.toLowerCase();
                var descricao = e.des_estab.toLowerCase();

                return codigo.indexOf(busca) !== -1 || descricao.indexOf(busca) !== -1;
            };
            return array.filter(fn);
        }
    }

    function itemListFilter() {
        return function(array, buscaTexto) {

            var fn = function(e) {

                var refer = ""

                if(e.cod_refer)
                    refer = e.cod_refer.toLowerCase();

                var busca = buscaTexto.toLowerCase();
                var codigo = e.cod_chave_erp.toLowerCase();
                var descricao = e.des_item_erp.toLowerCase();

                return codigo.indexOf(busca) !== -1 || descricao.indexOf(busca) !== -1 || refer.indexOf(busca) !== -1;
            };
            return array.filter(fn);

        };
    }
    
    function capitalizeFilter() {
        return function(input) {
            if (!input) return '';
            
            var words = input.split(" ");
            var output = '';
            
            for (var i in words) {
                var word = words[i];
                
                if (i != 0) {
                    output += " ";
                }
                output += word.charAt(0).toUpperCase() + word.substr(1);
            }
            return output;
        }
    }
    
    controlled.$inject = ["$rootScope"];
    function controlled($rootScope) {
        return function(input) {
            
            var output = 0;
            
            if(input == 1){
                return $rootScope.i18n("l-yes");
            } else {
                return $rootScope.i18n("l-no");
            }
        }
    }

    index.register.filter('kbnControlled', controlled);
    index.register.filter('kbnDateFormat', filterDateFormat);
    index.register.filter('kbnDateHourFormat', filterDateHourFormat);
	index.register.filter("prettyProduct", prettyProductFilter);
    index.register.filter("prettyTime", prettyTimeFilter);
    index.register.filter("countKanban", countKanbanFilter);
    index.register.filter("kanbanPercent", kanbanPercentFilter);
    index.register.filter("stackItems", stackItemsFilter);
    index.register.filter("stackOrder", stackOrderFilter);
    index.register.filter("descGeneric", descGeneric);
    index.register.filter("descFlow", descFlow);
    index.register.filter("numberOnly", numberOnly);
    index.register.filter("yesOrNo", yesOrNo);
    index.register.filter("statusDesc", statusDesc);
    index.register.filter("descIdContains", descIdContainsFilter);
    index.register.filter("itemList", itemListFilter);
    index.register.filter('capitalize', capitalizeFilter);
});
