var MARITAL_STATUS_ENUM = {

    SINGLE      : 1,
    MARRIED     : 2,
    WIDOWER     : 3,
    DISENGAGED  : 4,
    DIVORCED    : 5,
    OTHERS      : 9
};

/* ENUMERATION_VALUES */
MARITAL_STATUS_ENUM.ENUMERATION_VALUES = [
    {data:MARITAL_STATUS_ENUM.SINGLE        , label:"Solteiro"},
    {data:MARITAL_STATUS_ENUM.MARRIED       , label:"Casado"},
    {data:MARITAL_STATUS_ENUM.WIDOWER       , label:"Viúvo"},
    {data:MARITAL_STATUS_ENUM.DISENGAGED    , label:"Separado"},
    {data:MARITAL_STATUS_ENUM.DIVORCED      , label:"Divorciado"},
    {data:MARITAL_STATUS_ENUM.OTHERS        , label:"Outros"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( MARITAL_STATUS_ENUM, AbstractEnumeration );
});
