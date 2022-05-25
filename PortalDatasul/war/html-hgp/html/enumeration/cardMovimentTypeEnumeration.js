var CARD_MOVEMENT_TYPE_ENUM = {

    INCLUSION   : 'I',
    CHANGE      : 'A',
    EXCLUSION   : 'E',
    INDEFINED   : ''
    
};

/* ENUMERATION_VALUES */
CARD_MOVEMENT_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:CARD_MOVEMENT_TYPE_ENUM.INCLUSION    , label:"Inclusão"},
    {data:CARD_MOVEMENT_TYPE_ENUM.CHANGE       , label:"Alteração"},
    {data:CARD_MOVEMENT_TYPE_ENUM.EXCLUSION    , label:"Exclusão"},
    {data:CARD_MOVEMENT_TYPE_ENUM.INDEFINED    , label:"Indefinido"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( CARD_MOVEMENT_TYPE_ENUM, AbstractEnumeration );
});
