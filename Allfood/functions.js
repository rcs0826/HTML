 var newRow;
 var qtdRow = 0;
 var FundoLogin;
 var FundoDestaques;
 function fIncItem(){};
 $(document).ready(function(){
       newRow = $("#TABITEM > tbody > tr > td > table >tbody > .FundoLogin").html(); 
        
       var table="";      
       FundoDestaques = $("#TABITEM > tbody > tr > td > table >tbody > .FundoDestaques");
       FundoLogin = $("#TABITEM > tbody > tr > td > table >tbody > .FundoLogin");
         
       table = '<tbody id="tbItem"><tr class="FundoDestaques">'+FundoDestaques[0].innerHTML+'</tr>';
      
       for(var i=0; i<FundoLogin.length; i++){
               table += '<tr class="FundoLogin" align="center">'+FundoLogin[i].innerHTML+'</tr>';
       }    
       table += '</tbody>';
      $("#TABITEM > tbody > tr > td > table").html(table); 
      
      table = '<tr><td><table>';
      table += '<tr class="FundoDestaques">'+FundoDestaques[1].innerHTML+'</tr>';  
      table += '</table></td></tr>'; 
      $("#TABITEM > tbody").append(table);
       
       
       fIncItem = function(){        
           var row = '<tr class="FundoLogin" align="center">'+newRow+'</tr>';
           $("#TABITEM > tbody > tr > td > table >#tbItem").append(row); 
       };
 });