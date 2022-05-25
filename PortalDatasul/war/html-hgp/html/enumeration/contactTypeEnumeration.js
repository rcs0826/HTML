var CONTACT_TYPE_ENUM = {
    COMMERCIAL_PHON   : 1, // Constante que representa o telefone comercial.
    RESIDENTIAL_PHONE : 2, // Constante que representa o telefone residencial.
    CELULAR_PHONE	  : 3, // Constante que representa o telefone celular.
    EMAIL_ADDRESS	  : 4, // Constante que representa o endereço de email.
    MSN		          : 5,
    GOOGLE_TALK       : 6,
    WEBSITE_URL       : 7
};

/* ENUMERATION_VALUES */
CONTACT_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:CONTACT_TYPE_ENUM.COMMERCIAL_PHON,   label:"Telefone Comercial"},
    {data:CONTACT_TYPE_ENUM.RESIDENTIAL_PHONE, label:"Telefone Residencial"},
    {data:CONTACT_TYPE_ENUM.CELULAR_PHONE,     label:"Telefone Celular"},
    {data:CONTACT_TYPE_ENUM.EMAIL_ADDRESS,     label:"Email"},
    {data:CONTACT_TYPE_ENUM.MSN,               label:"MSN"},
    {data:CONTACT_TYPE_ENUM.GOOGLE_TALK,       label:"Google Talk"},
    {data:CONTACT_TYPE_ENUM.WEBSITE_URL,       label:"URL WebSite"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( CONTACT_TYPE_ENUM, AbstractEnumeration );
});