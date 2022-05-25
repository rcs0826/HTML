$(document).ready(function () {
    $("#btCopi","[btCopi]").click(function(){
        RCS.copyClipboard("txtSaid");
    });
    $("#btLimpEntr").click(function(){
    	$("#txtEntr").val("");    	
    });
    $("#btLimpTudo").click(function(){
    	$("#txtPref").val("");
    	$("#txtSulf").val("");
    	$("#txtEntr").val("");
    	$("#txtSaid").val("");
    });
    $("#btProc").click(function(){
        var txtEntr = $("#txtEntr").val();
        var txtPref = $("#txtPref").val();
        var vet = txtEntr.split("\n"); 
        var ret = "";
        for (var i = 0; i < vet.length; i++) {
            if(RCS.contains(vet[i],txtPref)){
                ret += (i+1) + ": "+ (vet[i]).trim() + "\n";
            }
        }
        $("#txtSaid").val(ret);
    });
    $("#btSubs").click(function(){
    	var txtEntr = $("#txtEntr").val();
    	var txtPref = $("#txtPref").val();
    	var txtSulf = $("#txtSulf").val();
        var trat = RCS.getValueSelect("slTrat");
    	var ret = "";
    	var retp = "";
    	var txtSaid = "";

        switch(trat){
            case "2":
                txtEntr = RCS.clearWhiteLine(txtEntr);
                break;
            case "3":
            case "5":
                txtEntr = RCS.clearDoubleWhiteLine(txtEntr);
                break;
            case "4":
                txtEntr = txtEntr.replace(/\/\/(.*?)\n/g,"");
                break;
        }
        var vet = txtEntr.split("\n");

    	for (var i = 0; i < vet.length; i++) {
            ret = vet[i];
             switch(trat){
                case "5":
                case "1":
                    ret = ret.trim();
                    break;
            }
            //ret = Trim?ret.trim():ret;
    		retp = ret.replaceAll("{rep}","").replaceAll("{num}","");
    		ret = ret.replaceAll("{rep}",retp).replaceAll("{num}",(i+1));    		
    		txtSaid += txtPref.replaceAll("{rep}",retp).replaceAll("{num}",(i+1)) 
    				+ ret 
    				+ txtSulf.replaceAll("{rep}",retp).replaceAll("{num}",(i+1)) 
    				+ "\n";
    	}

    	$("#txtSaid").val(txtSaid);    	
    });
    $("#btCtI").click(function(){         
        $("#txtSaid").val(RCS.csvTOinsert($("#txtPref").val(),$("#txtEntr").val()));     
    });
});