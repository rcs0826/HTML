var CONTACTING_PARTY_TYPE_ENUM = {
    NONE        : 'N', 
    DIAMOND     : 'D', 
    GOLD	    : 'O', 
    SILVER	    : 'P', 
    COPPER		: 'B',
    RED         : 'V'
};

/* ENUMERATION_VALUES */
CONTACTING_PARTY_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:CONTACTING_PARTY_TYPE_ENUM.NONE,      label:""},
    {data:CONTACTING_PARTY_TYPE_ENUM.DIAMOND,   label:"Diamante"},
    {data:CONTACTING_PARTY_TYPE_ENUM.GOLD,      label:"Ouro"},
    {data:CONTACTING_PARTY_TYPE_ENUM.SILVER,    label:"Prata"},
    {data:CONTACTING_PARTY_TYPE_ENUM.COPPER,    label:"Bronze"},
    {data:CONTACTING_PARTY_TYPE_ENUM.RED,       label:"Vermelho"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( CONTACTING_PARTY_TYPE_ENUM, AbstractEnumeration );
});