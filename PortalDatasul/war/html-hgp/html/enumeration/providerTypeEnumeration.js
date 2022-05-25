var PROVIDER_TYPE_ENUM = {    
    EXECUTANTE         : 0,
    PRINCIPAL		   : 1,
    AMBOS              : 2,
};

/* ENUMERATION_VALUES */
PROVIDER_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:PROVIDER_TYPE_ENUM.EXECUTANTE, label:"Executante"},
    {data:PROVIDER_TYPE_ENUM.PRINCIPAL , label:"Principal"},
    {data:PROVIDER_TYPE_ENUM.AMBOS     , label:"Ambos"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( PROVIDER_TYPE_ENUM, AbstractEnumeration );
});
