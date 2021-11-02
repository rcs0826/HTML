$("#sidebarToggle").click();    

    var MyWidget = {
      init: function() {
      //if(false){
          this.iframeHeight();
          this.goPage(0);   
          this.addFuncButton();
        },
      url:"/autoControle/resources/images/",
      pages:[{
        title:"Título",
        page:"#"
      },
      {
        title:"CADASTRO DE VARIÁVEIS E ATRIBUTOS DE ACABADOS",
        page:"frmAcabadosRegistro.html"
      }],

      iframeHeight:function(){
        $("#ifCont").height($("#accordionSidebar").height());
      },

      goPage:function(id,obj){
        if(id > ( this.pages.length - 1 )){
          alert("Página não encontrada, verificar na lista de código");
        }
        $("#h6title").html(this.pages[id].title);
        $("#ifCont").attr("src",this.url+this.pages[id].page);
        this.hide("#divPage",(id==0));

        if(obj != undefined){
          obj.parentElement.parentElement.parentElement.childNodes[1].click();
        }
        
      },

      addFuncButton:function(){
        var that = this;
        var obj = $("[btGoPage]");      
        for(var i=0; i < obj.length; i++){
          $("#"+obj[i].id).click(function(){
            that.goPage(this.getAttribute("btGoPage"),this);
          });
        }
      },
      hide:function(id,cond){
        if(cond){
          //$(id).hide();
          $(id).fadeOut();
        }
        else{
          //$(id).show();
          $(id).fadeIn();
        }
      },
    };


    MyWidget.init();