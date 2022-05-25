var ASSISTANCE_PROFILE_ENUM = {

	NOT_INFORMED             : 0,  //Não Informado
    GENERAL_HOSPITAL         : 1,  // Hospital Geral
    DAY_HOSPITAL             : 2,  // Hospital Dia
    MATERNITY                : 3,  // Maternidade
    CARDIOLOGY               : 4,  // Hosp. Espec. em Cardiologia
    OPHTHALMOLOGY            : 5,  // Hosp. Espec. em Oftalmologia
    ONCOLOGY                 : 6,  // Hosp. Espec. em Oncologia
    ORTHOPEDICS_TRAUMATOLOGY : 7,  // Hosp. Espec. em Ortopedia/Traumatologia
    OTOLARYNGOLOGY           : 8,  // Hosp. Espec. em Otorrinolaringologia
    PEDIATRICS               : 9,  // Hosp. Espec. em Pediatria
    MAXILLOFACIAL_CRANIUM    : 10, // Hosp. Espec. em Cranio Maxilo Facial
    NEUROLOGY                : 11, // Hosp. Espec. em Neurologia                       
    UROLOGY_NEPHROLOGY       : 12, // Hosp. Espec. em Urologia/Nefrologia
    PSYCHIATRY               : 13, // Hosp. Espec. em Psiquiatria
    BURNED                   : 14, // Hosp. Espec. em Queimados
    INFECTIOUS_DISEASES      : 15, // Hosp. Espec. em Doencas Infectocontagiosas
    GASTROENTEROLOGY         : 16, // Hosp. Espec. em Gastroenterologia
    HEPATOLOGY               : 17, // Hosp. Espec. em Hepatologia
    GERIATRICS               : 18, // Hosp. Espec. em Geriatria
    HEMATOLOGY               : 19, // Hosp. Espec. em Hematologia
    PNEUMOLOGY               : 20, // Hosp. Espec. em Pneumologia
    RHEUMATOLOGY             : 21, // Hosp. Espec. em Reumatoligia
    ENDOCRINOLOGY            : 22, // Hosp. Espec. em Endocrinologia
    PROCTOLOGY               : 23, // Hosp. Espec. em Proctologia
    PLASTIC_SURGERY          : 24, // Hosp. Espec. em Cirurgia Plastica
    HEAD_NECK_SURGERY        : 25, // Hosp. Espec. em Cirurgia Cabeca e Pescoco
    HAND_SURGERY             : 26, // Hosp. Espec. em Cirurgia da Mao
    THORACIC_SURGERY         : 27, // Hosp. Espec. em Cirurgia Toracica
    VASCULAR_SURGERY         : 28  // Hosp. Espec. em Cirurgia Vascular
};

/* ENUMERATION_VALUES */
ASSISTANCE_PROFILE_ENUM.ENUMERATION_VALUES = [
    {data:ASSISTANCE_PROFILE_ENUM.NOT_INFORMED, label:"Não Informado"},       
    {data:ASSISTANCE_PROFILE_ENUM.GENERAL_HOSPITAL, label:"Assistência Hospitalar"},   
    {data:ASSISTANCE_PROFILE_ENUM.DAY_HOSPITAL, label:"Serviços de Alta Complexidade"},
    {data:ASSISTANCE_PROFILE_ENUM.MATERNITY, label:"Demais Estabelecimentos"},
    {data:ASSISTANCE_PROFILE_ENUM.CARDIOLOGY, label:"Não Informado"},       
    {data:ASSISTANCE_PROFILE_ENUM.OPHTHALMOLOGY, label:"Não Informado"},     
    {data:ASSISTANCE_PROFILE_ENUM.ONCOLOGY, label:"Hosp. Espec. em Oncologia"},       
    {data:ASSISTANCE_PROFILE_ENUM.ORTHOPEDICS_TRAUMATOLOGY, label:"Hosp. Espec. em Ortopedia/Traumatologia"},       
    {data:ASSISTANCE_PROFILE_ENUM.OTOLARYNGOLOGY, label:"Hosp. Espec. em Otorrinolaringologia"},       
    {data:ASSISTANCE_PROFILE_ENUM.PEDIATRICS, label:"Hosp. Espec. em Pediatria"},       
    {data:ASSISTANCE_PROFILE_ENUM.MAXILLOFACIAL_CRANIUM, label:"Hosp. Espec. em Cranio Maxilo Facial"},       
    {data:ASSISTANCE_PROFILE_ENUM.NEUROLOGY, label:"Hosp. Espec. em Neurologia"},       
    {data:ASSISTANCE_PROFILE_ENUM.UROLOGY_NEPHROLOGY, label:"Hosp. Espec. em Urologia/Nefrologia"},       
    {data:ASSISTANCE_PROFILE_ENUM.PSYCHIATRY, label:"Hosp. Espec. em Psiquiatria"},       
    {data:ASSISTANCE_PROFILE_ENUM.BURNED, label:"Hosp. Espec. em Queimados"},       
    {data:ASSISTANCE_PROFILE_ENUM.INFECTIOUS_DISEASES, label:"Hosp. Espec. em Doencas Infectocontagiosas"},       
    {data:ASSISTANCE_PROFILE_ENUM.GASTROENTEROLOGY, label:"Hosp. Espec. em Gastroenterologia"},       
    {data:ASSISTANCE_PROFILE_ENUM.HEPATOLOGY, label:"Hosp. Espec. em Hepatologia"},       
    {data:ASSISTANCE_PROFILE_ENUM.GERIATRICS, label:"Hosp. Espec. em Geriatria"},       
    {data:ASSISTANCE_PROFILE_ENUM.HEMATOLOGY, label:"Hosp. Espec. em Hematologia"},       
    {data:ASSISTANCE_PROFILE_ENUM.PNEUMOLOGY, label:"Hosp. Espec. em Pneumologia"},       
    {data:ASSISTANCE_PROFILE_ENUM.RHEUMATOLOGY, label:"Hosp. Espec. em Reumatoligia"},       
    {data:ASSISTANCE_PROFILE_ENUM.ENDOCRINOLOGY, label:"Hosp. Espec. em Endocrinologia"},  
    {data:ASSISTANCE_PROFILE_ENUM.PROCTOLOGY, label:"Hosp. Espec. em Proctologia"},   
    {data:ASSISTANCE_PROFILE_ENUM.PLASTIC_SURGERY, label:"Hosp. Espec. em Cirurgia Plastica"},   
    {data:ASSISTANCE_PROFILE_ENUM.HEAD_NECK_SURGERY, label:"Hosp. Espec. em Cirurgia Cabeca e Pescoco"},   
    {data:ASSISTANCE_PROFILE_ENUM.HAND_SURGERY, label:"Hosp. Espec. em Cirurgia da Mao"},   
    {data:ASSISTANCE_PROFILE_ENUM.THORACIC_SURGERY, label:"Hosp. Espec. em Cirurgia Toracica"},   
    {data:ASSISTANCE_PROFILE_ENUM.VASCULAR_SURGERY, label:"Hosp. Espec. em Cirurgia Vascular"}

];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( ASSISTANCE_PROFILE_ENUM, AbstractEnumeration );
});