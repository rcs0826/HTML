var CARD_PRINT_TYPE_ENUM = {

    NOTPRINT    : 'N',
    PRINT       : 'I',
    REPRINT     : 'R',
    CANCEL      : 'C',
    INDEFINED   : ''
};

/* ENUMERATION_VALUES */
CARD_PRINT_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:CARD_PRINT_TYPE_ENUM.NOTPRINT       , label:"Não Imprime"},
    {data:CARD_PRINT_TYPE_ENUM.PRINT          , label:"Impressão"},
    {data:CARD_PRINT_TYPE_ENUM.REPRINT        , label:"Reimpressão"},
    {data:CARD_PRINT_TYPE_ENUM.CANCEL         , label:"Cancela"},
    {data:CARD_PRINT_TYPE_ENUM.INDEFINED      , label:"Indefinido"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( CARD_PRINT_TYPE_ENUM, AbstractEnumeration );
});
