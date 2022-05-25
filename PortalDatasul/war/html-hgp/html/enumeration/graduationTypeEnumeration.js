var GRADUATION_TYPE_ENUM = {

    NOT_INFORMED     : 0, //Nao Informado
    MASTER           : 1, //Mestrado
    DOCTORATE_DEGREE : 2, //Doutorado
    FREE_TEACHING    : 3, //Livre Docencia
    OTHER            : 4  //Outros Nao se Aplica

};

/* ENUMERATION_VALUES */
GRADUATION_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:GRADUATION_TYPE_ENUM.NOT_INFORMED, label:"Nao Informado"},       
    {data:GRADUATION_TYPE_ENUM.MASTER, label:"Mestrado"},
    {data:GRADUATION_TYPE_ENUM.DOCTORATE_DEGREE, label:"Doutorado"},
    {data:GRADUATION_TYPE_ENUM.FREE_TEACHING, label:"Livre Docencia"},
    {data:GRADUATION_TYPE_ENUM.OTHER, label:"Outros Nao se Aplica"}

];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( GRADUATION_TYPE_ENUM, AbstractEnumeration );
});