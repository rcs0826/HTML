define(['index'], function(index) {

  MmiArvoreAtivos.$inject = ['fchmip.programacao.Factory', 'helperEspecialidade'];

  function MmiArvoreAtivos(programacaoFactory, helperEspecialidade) {
    var directive = {
      restrict: 'E',
      scope: {
        mmiModel: '=',
        mmiEquipSelecionado: '=',
        mmiNivelSelecionado: '=',
        mmiNivelOrdens: '=',
        mmiAcaoSelecionaNivelOrdem: '=mmiAcaoSelecionaNivelOrdem',
        mmiAcaoSelecionaNivel: '=mmiAcaoSelecionaNivel',
        mmiControl: '=',
        mmiFuncaoAtualizacao: '=mmiFuncaoAtualizacao',
        mmiAcaoSelecionaEquipamento: '=mmiAcaoSelecionaEquipamento',
        mmiCarregaArvore: '=mmiCarregaArvore'
      },
      templateUrl: '/dts/mmi/html/sprint/arvoreativos/arvore-ativos.html',
      link: link
    };
    return directive;

    function link (scope) {

      scope.internalControl = scope.mmiControl;
      scope.carregaArvore = carregaArvore;
      scope.carregaArvoreNivelSelecionado = carregaArvoreNivelSelecionado;
      scope.mostraFilhos = mostraFilhos;
      scope.escondeFilhos = escondeFilhos;
      scope.selecionaNivelResumo = selecionaNivelResumo;
      scope.selecionaNivelOrdem = selecionaNivelOrdem;
      scope.obterAlturaArvore = obterAlturaArvore;
      scope.buscaOrdensEquipamento = buscaOrdensEquipamento;
      scope.buscaOrdensNivel = buscaOrdensNivel;
      
      scope.internalControl.carregaArvoreNivelSelecionado = function() {
        scope.carregaArvoreNivelSelecionado();
      }

      scope.internalControl.carregaArvore = function() {
        scope.carregaArvore();
      };

      scope.internalControl.buscaOrdensEquipamento = function(cdEquipto) {
        scope.buscaOrdensEquipamento(cdEquipto);
      };

      scope.internalControl.buscaOrdensNivel = function(ttNivel) {
        scope.buscaOrdensNivel(ttNivel);
      };

      var carregaArvoreCallback = function(result) {
        if (!result) return;

        scope.mmiNivelOrdens = false;        

        if(scope.mmiCarregaArvore) {
          scope.mmiCarregaArvore(); 
        }
        
        scope.ttOrdemPeriodo = result.ttOrdemPeriodo;
        scope.mmiModel.ttSprint = result.ttSprint;
          
        angular.forEach(scope.mmiModel.ttSprint, function(sprint) {
            sprint.dataInicial = new Date(sprint.dataInicialStr);
            sprint.dataFinal = new Date(sprint.dataFinalStr);
        });
          
        helperEspecialidade.data.sprint = scope.mmiModel.ttSprint;
        scope.mmiModel['ttOrdemPeriodo'] = result.ttOrdemPeriodo;
        scope.mmiModel.ttProgramacao['log-filtro-alterado'] = false;
        if (scope.mmiFuncaoAtualizacao) {
          scope.mmiFuncaoAtualizacao();
        }
        angular.forEach(result.ttNivel1, function(nivel){
          scope.mmiModel.arvore.push(nivel);
          angular.forEach(nivel.ttNivel2, function(nivel2){
            nivel2.pai = nivel;
            angular.forEach(nivel2.ttNivel3, function(nivel3){
              nivel3.pai = nivel2;
              angular.forEach(nivel3.ttNivel4, function(nivel4){
                nivel4.pai = nivel3;
              });
            });
          });
        });
      }

      var atualizaValorSelecionado = function(nivel) {
        scope.mmiEquipSelecionado = nivel.codigo;
                
        if (nivel.descricao) {
          scope.mmiEquipSelecionado += " - " + nivel.descricao;
        }

        if (!scope.mmiNivelOrdens) {
          var ttNivel = {"codEstabel": nivel.codEstabel};
          
          if (nivel.ttResumo) {
            scope.mmiModel.ttResumo = nivel.ttResumo;
            buscaOrdensNivel(ttNivel);            
          } else if (nivel.ttResumo2) {
            scope.mmiModel.ttResumo = nivel.ttResumo2;
            ttNivel.grupo = nivel.codigo;
            buscaOrdensNivel(ttNivel);
          } else if (nivel.ttResumo3) {
            scope.mmiModel.ttResumo = nivel.ttResumo3;
            ttNivel.modelo = nivel.codigo;
            ttNivel.grupo = nivel.pai.codigo;
            buscaOrdensNivel(ttNivel);
          }

          atualizaQuantidadePeriodo();
        } else {
          scope.mmiModel.ttResumo = nivel.ttResumo4;
          buscaOrdensEquipamento(scope.mmiEquipSelecionado);
        }
        
        scope.mmiNivelSelecionado = true;
      }

      var atualizaQuantidadePeriodo = function() {
        var iResumo = 0;
        
        for (var i = 0; i < scope.mmiModel.ttSprint.length; i++) {
          scope.mmiModel.ttSprint[i].qtdPeriodo = scope.mmiModel.ttResumo[iResumo].qtdTotal;
          iResumo+=4;
        }
      }

      function buscaOrdensNivel (nivel) {
        var params = {};        
        scope.ttEquipamento = [];
        scope.mmiModel.ttNivel = nivel;
        params.ttNivel = nivel;
        params.ttOrdemPeriodo = scope.mmiModel.ttOrdemPeriodo;
        params.ttProgramacao = scope.mmiModel.ttProgramacao;
        params.ttParametros = scope.mmiModel.ttParametrosAux;
        params.ttSprint = scope.mmiModel.ttSprint;
        
        programacaoFactory.buscaOrdensNivel(params, buscaOrdensCallback);
      }
      
      function buscaOrdensEquipamento (cdEquipto) {
        var params = {};        
        scope.ttEquipamento = [];        
        params.ttEquipamento = {"cdEquipto": cdEquipto,
                                "codEstabel": scope.mmiModel.codEstabel};
        params.ttProgramacao = scope.mmiModel.ttProgramacao;
        params.ttParametros = scope.mmiModel.ttParametrosAux;
        params.ttSprint = scope.mmiModel.ttSprint;
        
        programacaoFactory.buscaOrdensEquipamento(params, buscaOrdensCallback);
      }
      
      var buscaOrdensCallback = function(result) {
        scope.mmiModel.ttSprint = result.ttSprintRetorno;
        scope.mmiModel.ttOrdem = result.ttOrdem;
          
        angular.forEach(scope.mmiModel.ttSprint, function(sprint) {
            sprint.dataInicial = new Date(sprint.dataInicialStr);
            sprint.dataFinal = new Date(sprint.dataFinalStr);
        });
        
        var equipamento = {
          "cdEquipto": scope.mmiEquipSelecionado,
          "ttSprint": scope.mmiModel.ttSprint,
          "ttOrdem": scope.mmiModel.ttOrdem
        };
        
        scope.ttEquipamento.push(equipamento);

        if (scope.mmiAcaoSelecionaEquipamento) {
          scope.mmiAcaoSelecionaEquipamento();
        }
      }
      
      function removeSelecionado(divId) {
        var els = document.getElementsByClassName(divId);
        Array.prototype.forEach.call(els, function(el) {
          $(el).removeClass('nivel-selecionado');
        });
      }

      function selecionaNivel(divAtual, nivel) {
        removeSelecionado('div-nivel1');
        removeSelecionado('div-nivel2');
        removeSelecionado('div-nivel3');
        removeSelecionado('div-nivel4');
        
        $(divAtual).addClass('nivel-selecionado');
        
        nivel.mostraFilhos = !nivel.mostraFilhos;
        atualizaValorSelecionado(nivel);
      }

      function selecionaNivelResumo(nivel, event) {
        scope.mmiNivelOrdens = false;
        selecionaNivel(event.target, nivel);
        scope.mmiModel.nivelEventSelecionado = event;
        if(scope.mmiAcaoSelecionaNivel) {
          scope.mmiAcaoSelecionaNivel();
        }
      }
      
      function selecionaNivelOrdem(nivel, event) {
        scope.mmiModel.codEstabel = nivel.codEstabel;
        scope.mmiModel.nivelEventSelecionado = event;
        scope.mmiModel.nivelObject = nivel;
        scope.mmiNivelOrdens = true;
        selecionaNivel(event.target, nivel);
        scope.internalControl.nivelSelecionado = nivel;        
      }

      function carregaArvoreNivelSelecionado() {
        setTimeout(function() {
          if (!scope.mmiModel.nivelEventSelecionado || !scope.mmiModel.nivelEventSelecionado.target) return;
          var component = document.getElementById(scope.mmiModel.nivelEventSelecionado.target.id);
          if (component) {
            component.classList.add('nivel-selecionado');
          }
        }, 0);
      }

      function carregaArvore() {
        scope.mmiModel.nivelEventSelecionado = {};
        scope.mmiModel.nivelObject = {}
        scope.mmiModel.arvore = [];
        scope.mmiModel.ttResumo = [];
        scope.ttEquipamento = [];
        scope.mmiModel.ttOrdem = [];
        scope.ttOrdemPeriodo = [];
        scope.collapse = false;
        scope.mmiNivelSelecionado = false;
        programacaoFactory.carregaArvore(scope.mmiModel, carregaArvoreCallback);
      }

      function mostraFilhos() {
        angular.forEach(scope.mmiModel.arvore, function(nivel1){
          nivel1.mostraFilhos = true;
          angular.forEach(nivel1.ttNivel2, function(nivel2){
            nivel2.mostraFilhos = true;
            angular.forEach(nivel2.ttNivel3, function(nivel3){
              nivel3.mostraFilhos = true;
            });
          });
        });
        scope.collapse = true;
      }
  
      function escondeFilhos() {
        angular.forEach(scope.mmiModel.arvore, function(nivel1){
          nivel1.mostraFilhos = false;
          angular.forEach(nivel1.filhos, function(nivel2){
            nivel2.mostraFilhos = false;
            angular.forEach(nivel2.filhos, function(nivel3){
              selecionaNivel.mostraFilhos = false;
            });
          });
        });
        scope.collapse = false;
      }

      function obterAlturaArvore() {
        return {
            height: (window.innerHeight - 164) + 'px',
            'overflow-y': 'auto'
          };
        }
    }
  }

  index.register.directive('mmiArvoreAtivos', MmiArvoreAtivos);

});