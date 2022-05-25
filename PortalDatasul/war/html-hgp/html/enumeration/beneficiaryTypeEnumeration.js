var BENEFICIARY_TYPE_ENUM = {
    BASE     : 1,
    EXCHANGE : 2
};

/* ENUMERATION_VALUES */
BENEFICIARY_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:BENEFICIARY_TYPE_ENUM.BASE     , label:"Base"},
    {data:BENEFICIARY_TYPE_ENUM.EXCHANGE , label:"Intercâmbio"}
];

BENEFICIARY_TYPE_ENUM.VALUES_WITH_ALL_OPTION = [{data:0, label: 'Todos'}].concat(BENEFICIARY_TYPE_ENUM.ENUMERATION_VALUES);

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( BENEFICIARY_TYPE_ENUM, AbstractEnumeration );
});