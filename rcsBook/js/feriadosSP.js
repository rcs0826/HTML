// Registro dos feriados
var ferdesc = new Array();
var fercontrol = 0;

// Função de Cadastro dos Feriados
function alFer(dia,mes,desc){
     var fer = new Object();
     fer.dia = dia;
     fer.mes = mes;
     fer.desc = desc;
     ferdesc.push(fer);
     return dia+"-"+mes;
}; 
// Cálculo dos Feriados Sem Data Fixa
function ferSDF(mes,ano,qtdDias,diaSemana,desc){
      var cont = 0;
      var data;
      var diaSem;
      for(var i=1; i < ultimoDia(mes, ano); i++){
        data = new Date(ano, (mes - 1), i);
        diaSem = data.getDay();
          if(diaSem == (diaSemana - 1)){
             cont++;
             if(cont == qtdDias){
                  return alFer(i,mes,desc);
             }
          }
      }
};
// Cálculo do Carnaval
function calcCarnaval(dia_mes,ano){
     var dat = dia_mes.split("-");
     var dia = parseInt(dat[0]);   
     var mes = parseInt(dat[1]);  
     var cont = 0;
     var data;
     var diaSem;
     var contMes = ultimoDia(mes, ano);
     for(var i = 0; i < 55; i++){
         dia--;
         if(dia <= 0){
            mes--;
            dia = ultimoDia(mes, ano);
         }
         data = new Date(ano, (mes - 1), dia);
         diaSem = data.getDay();
         if(diaSem == 0){
             cont++;
             if(cont == 7){                  
                  alFer(dia-1,mes,"Carnaval");
                  alFer(dia,mes,"Carnaval");
                  dia++;
                  if(dia <= ultimoDia(mes, ano)){
                      alFer(dia,mes,"Carnaval");
                  }
                  else{
                       dia = 1;
                       mes++;                       
                       alFer(dia,mes,"Carnaval");
                  }
                  dia++; 
                  if(dia <= ultimoDia(mes, ano)){
                      alFer(dia,mes,"Carnaval");
                  }
                  else{
                       dia = 1;
                       mes++;                       
                       alFer(dia,mes,"Carnaval");
                  }
                  dia++;
                  if(dia <= ultimoDia(mes, ano)){
                      alFer(dia,mes,"Cinzas");
                  }
                  else{
                       dia = 1;
                       mes++;                       
                       alFer(dia,mes,"Cinzas");
                  }
                  return;
             }   
         } 
     }
}; 
// Cálculo do Corpus Christi
function calcCorpChris(dia_mes,ano){
     var dat = dia_mes.split("-");
     var dia = parseInt(dat[0]);   
     var mes = parseInt(dat[1]);  
     var cont = 0;
     var data;
     var diaSem;
     var contMes = ultimoDia(mes, ano);
     for(var i = 0; i < 60; i++){
         dia++;
         if(dia > ultimoDia(mes, ano)){
            mes++;
            dia = 1;
         }
         data = new Date(ano, (mes - 1), dia);
     }
     alFer(dia,mes,"Corpus Christi");
};
// Registros dos feriados
function cadFer(mes,ano){
    var data = new Date();
    if(mes == data.getMonth() || fercontrol == 0){
      ferdesc = new Array();
      alFer(1,1,'Ano Novo');
      alFer(25,1,'Aniversário de São Paulo');  
      alFer(21,4,'Tiradentes');  
      alFer(1,5,'Dia do Trabalho');
      alFer(12,6,'Dia dos Namorados'); 
      alFer(7,9,'Independência');  
      alFer(12,10,'Dia das crianças');  
      alFer(2,11,'Finados');   
      alFer(15,11,'Proclamação da República');   
      alFer(20,11,'Dia da Consciência Negra'); 
      alFer(25,12,'Natal');
      
      calcCarnaval(ferSDF(4,ano,3,1,"Domingo de Páscoa"),ano);
      calcCorpChris(ferSDF(4,ano,3,1,"Domingo de Páscoa"),ano);
      
      ferSDF(4,ano,2,6,"Paixão de Cristo"); 
      ferSDF(5,ano,2,1,"Dia das Mães");
      ferSDF(8,ano,2,1,"Dia dos Pais");
      
      fercontrol == 1;
    }
};
// Função de feriado
function feriados(){
    setTimeout(function(){
        var dt = document.getElementById("calendarMesAno").value;
        var tmp = dt.split('-');
        var mes = tmp[0];
        var ano = tmp[1];
        var newId = "";
        
        cadFer(mes,ano);
         
        for(var i=0; i<ferdesc.length; i++){
          if(ferdesc[i].mes == mes){
              newId = ano +"_"+ (mes < 10?"0"+mes:mes) +"_"+ ferdesc[i].dia;
              document.getElementById(newId).innerHTML = "<center><font color='red'>"+ferdesc[i].dia +"<br /><font size='2'>"+ ferdesc[i].desc + "</font></font></center>";
          } 
       }
    },10);
};