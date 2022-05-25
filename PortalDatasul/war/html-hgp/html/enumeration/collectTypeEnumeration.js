var COLLECT_TYPE_ENUM = {

    NONE           : 0, //Nenhum
    ALL            : 1, //Todos
    HOME           : 2, //Domiciliar
    ANATOMIES      : 3, //Anatomos
    EMERGENCY_ROOM : 4  //Pronto Socorro

};

/* ENUMERATION_VALUES */
COLLECT_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:COLLECT_TYPE_ENUM.NONE, label:"Nenhum"},       
    {data:COLLECT_TYPE_ENUM.ALL, label:"Todos"},
    {data:COLLECT_TYPE_ENUM.HOME, label:"Domiciliar"},
    {data:COLLECT_TYPE_ENUM.ANATOMIES, label:"Anatomos"},
    {data:COLLECT_TYPE_ENUM.EMERGENCY_ROOM, label:"Pronto Socorro"}

];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( COLLECT_TYPE_ENUM, AbstractEnumeration );
});