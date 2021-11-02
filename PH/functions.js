function verificar(){
  var nome = document.getElementById("fname");
  var sobrenome = document.getElementById("lname");
  var usuario = document.getElementById("user");
  var email = document.getElementById("email");
  var rgxEmail = new RegExp(/\S+@\S+\.\S+/);
  var senha = document.getElementById("senha");
  var csenha = document.getElementById("csenha");
  
  if(nome.value == ""){
    alert("Você deve informar seu Nome");
    nome.focus().select();
    return false;
  }
  if(sobrenome.value == ""){
    alert("Você deve informar seu Sobrenome");
    sobrenome.focus().select();
    return false;
  }
  if(usuario.value ==""){
    alert("Por favor crie um nome de usuario valido");
    usuario.focus().select();
    return false;
  }
  if( email.value.match(rgxEmail) == null ){
    alert("Campo e-mail com valor inválido");  
    return false;
  }
  if(senha.value =="" || senha.value != csenha.value){
    alert("As senhas não são iguais");
    senha.focus().select();
    return false;
  }
  else{
       alert("Conta criada com Sucesso");
       document.getElementById("form").value="";
       window.location="indexPortugues.html";
  }
}