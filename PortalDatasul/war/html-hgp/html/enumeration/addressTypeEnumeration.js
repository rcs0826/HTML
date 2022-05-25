var ADDRESS_TYPE_ENUM = {

    HOME             : 1, //Residencial
    BUSINESS         : 2, //Comercial                       
    OTHER            : 3 //Outro
};

/* ENUMERATION_VALUES */
ADDRESS_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:ADDRESS_TYPE_ENUM.HOME, label:"Residencial"},       
    {data:ADDRESS_TYPE_ENUM.BUSINESS, label:"Comercial"},
    {data:ADDRESS_TYPE_ENUM.OTHER, label:"Outro"}

];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( ADDRESS_TYPE_ENUM, AbstractEnumeration );
});