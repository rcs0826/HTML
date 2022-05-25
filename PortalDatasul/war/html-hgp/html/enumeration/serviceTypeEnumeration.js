var SERVICE_TYPE_ENUM = {
    PROCEDURE : 1,
    INPUT     : 2,
    /*PACKAGE   : 3,*/
};

/* ENUMERATION_VALUES */
SERVICE_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:SERVICE_TYPE_ENUM.PROCEDURE, label:"Procedimento"},
    {data:SERVICE_TYPE_ENUM.INPUT    , label:"Insumo"},
    /*{data:SERVICE_TYPE_ENUM.PACKAGE  , label:"Pacote"},*/
];

SERVICE_TYPE_ENUM.VALUES_WITH_ALL_OPTION = [{data:0, label: 'Ambos'}].concat(SERVICE_TYPE_ENUM.ENUMERATION_VALUES);

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend(SERVICE_TYPE_ENUM, AbstractEnumeration );
});