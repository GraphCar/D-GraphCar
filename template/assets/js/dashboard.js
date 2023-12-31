function carregarDados() {
  fetch("/Dados/alertasGerais", {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((response) => {
        // span_alerta_cpu.innerHTML = response[0].cpuCritico;
        // span_alerta_gpu.innerHTML = response[0].gpuCritico;
        // span_alerta_bat.innerHTML = response[0].bateriaCritico;
        span_ocorrencia_cpu.innerHTML = Number(response[0].cpuAlerta) + Number(response[0].cpuCritico);
        span_ocorrencia_gpu.innerHTML = Number(response[0].gpuAlerta) + Number(response[0].gpuCritico);
        span_ocorrencia_bat.innerHTML = Number(response[0].bateriaAlerta) + Number(response[0].bateriaCritico);
      });
    } else {
      console.log(resposta)
      console.log("Houve um erro ao tentar recuperar os dados!");

      resposta.text().then(texto => {
        console.error(texto);
        alert("Houve um erro ao tentar recuperar os dados!");
      });
    }
  });
  console.log("abc: " + sel_modelo_carro.value);
  fetch(`/Dados/alertasConcatenados/${sel_modelo_carro.value || "-"}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((response) => {
        console.log(response);

        let jsonAlertas = extrairDadosConcatenados(response);

        console.log("Batata")
        console.log(dados_kpis)

        extrairDadosGraficos(jsonAlertas);


        obterQuantidadeCarros();
        exibirGraficos();
      });
    } else {
      console.log(resposta)
      console.log("Houve um erro ao tentar recuperar os dados!");

      resposta.text().then(texto => {
        console.error(texto);
        alert("Houve um erro ao tentar recuperar os dados!");
      });
    }
  });
}

function atualizarNotificacoes() {
  fetch("/Dados/listarNotificacoes").then(function (resposta) {
    if (resposta.ok) {
      if (resposta.status == 204) {
        var notificacoes = document.getElementById("div_lista_alertas");
        var mensagem = document.createElement("p");

        mensagem.innerHTML = "Nada novo aqui!"
        mensagem.classList.add("text-small", "text-muted", "ellipsis", "mb-0")

        feed.appendChild(mensagem);
        throw "Nada novo aqui!";
      }

      resposta.json().then(function (resposta) {
        console.log("Dados recebidos: ", JSON.stringify(resposta));


        var nomeNotificacoes = []
        var mensagens = []
        var notificacoes = document.getElementById("div_lista_alertas");
        var alertas = {
          cpuAlerta: 0,
          cpuCritico: 0,
          gpuAlerta: 0,
          gpuCritico: 0,
          bateriaAlerta: 0,
          bateriaCritico: 0
        }
        console.log("alertas");
        console.log(resposta);

        notificacoes.innerHTML = '<h6 class="p-3 mb-0">Mensagens</h6>';
        for (let i = 0; i < resposta.length; i++) {
          var publicacao = resposta[i];
          if (publicacao.cpuUso > 70) {
            alertas.cpuAlerta++;
          } else if (publicacao.cpuUso > 90) {
            alertas.cpuCritico++;
          }
          if (publicacao.gpuUso > 70) {
            alertas.gpuAlerta++;
          } else if (publicacao.gpuUso > 90) {
            alertas.gpuCritico++;
          }
          if (publicacao.bateriaNivel < 5) {
            alertas.bateriaCritico++;
          } else if (publicacao.bateriaNivel < 20) {
            alertas.bateriaAlerta++;
          }
        }
        let totalAlertas = 0;

        if (alertas.cpuAlerta != 0) {
          nomeNotificacoes.push("Alerta de CPU");
          mensagens.push("Existem " + alertas.cpuAlerta + " alertas de CPU nos últimos 15 minutos");
          totalAlertas++;
        }
        if (alertas.cpuCritico != 0) {
          nomeNotificacoes.push("Nível Crítico de CPU");
          mensagens.push("Existem " + alertas.cpuAlerta + " CPUs em nível CRÍTICO nos últimos 15 minutos");
          totalAlertas++;
        }
        if (alertas.gpuAlerta != 0) {
          nomeNotificacoes.push("Alerta de GPU");
          mensagens.push("Existem " + alertas.gpuAlerta + " alertas de GPU nos últimos 15 minutos");
          totalAlertas++;
        }
        if (alertas.gpuCritico != 0) {
          nomeNotificacoes.push("Nível Crítico de GPU");
          mensagens.push("Existem " + alertas.gpuCritico + " GPUs em nível CRÍTICO nos últimos 15 minutos");
          totalAlertas++;
        }
        if (alertas.bateriaAlerta != 0) {
          nomeNotificacoes.push("Alerta de Bateria");
          mensagens.push("Existem " + alertas.bateriaAlerta + " alertas de bateria nos últimos 15 minutos");
          totalAlertas++;
        }
        if (alertas.bateriaCritico != 0) {
          nomeNotificacoes.push("Nível Crítico de Bateria");
          mensagens.push("Existem " + alertas.bateriaCritico + " baterias em nível CRÍTICO nos últimos 15 minutos");
          totalAlertas++;
        }

        if (totalAlertas == 0) {
          span_qtde_alertas.classList.add("invisible");
          let aDropDown = document.createElement("a");
          let divConteudo = document.createElement("div");
          let pMensagem = document.createElement("p");

          aDropDown.classList.add("dropdown-item", "preview-item");
          divConteudo.classList.add("preview-item-content", "flex-grow");
          pMensagem.classList.add("text-small", "text-muted", "ellipsis", "mb-0");

          pMensagem.innerHTML = "Não há alertas no momento!";

          divConteudo.appendChild(pMensagem);
          aDropDown.appendChild(divConteudo);
          notificacoes.appendChild(aDropDown);

        } else {
          for (i = 0; i < nomeNotificacoes.length; i++) {
            let aDropDown = document.createElement("a");
            let divConteudo = document.createElement("div");
            let spanTitulo = document.createElement("span");
            let pMensagem = document.createElement("p");

            spanTitulo.innerHTML = nomeNotificacoes[i];
            pMensagem.innerHTML = mensagens[i];

            aDropDown.classList.add("dropdown-item", "preview-item");
            divConteudo.classList.add("preview-item-content", "flex-grow");
            spanTitulo.classList.add("badge", "badge-pill");

            if (nomeNotificacoes[i].includes("Alerta")) {
              spanTitulo.classList.add("badge-warning");
            } else {
              spanTitulo.classList.add("badge-danger");
            }

            pMensagem.classList.add("text-small", "text-muted", "ellipsis", "mb-0");

            divConteudo.appendChild(spanTitulo);
            divConteudo.appendChild(pMensagem);
            aDropDown.appendChild(divConteudo);
            notificacoes.appendChild(aDropDown);
          }
          span_qtde_alertas.innerHTML = "!";
          span_qtde_alertas.classList.remove("invisible");
        }



      });
    } else {
      throw ('Houve um erro na API!');
    }
  }).catch(function (resposta) {
    console.error(resposta);
  });
}

function pesquisarId() {
  fetch(`/Dados/pesquisarId/${fkCarro.value}`).then(function (resposta) {
    if (resposta.ok) {

      resposta.json().then((response) => {
        sessionStorage.FK_CARRO = fkCarro.value

        window.location = "../../pages/dash-manutencao/dash-manutencao.html"

      });
    } else {
      console.log(resposta)
      console.log("Houve um erro ao tentar recuperar os dados!");

      resposta.text().then(texto => {
        console.error(texto);
        alert("Houve um erro ao tentar recuperar os dados!");
      });
    }
  });
}

function obterQuantidadeCarros() {
  fetch(`/Dados/quantidadeCarros/${sel_modelo_carro.value || "-"}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((response) => {
        span_total_carros.innerHTML = response[0].count_carro;
        obterMetricas();
      });
    } else {
      console.log(resposta)
      console.log("Houve um erro ao tentar recuperar os dados!");

      resposta.text().then(texto => {
        console.error(texto);
        alert("Houve um erro ao tentar recuperar os dados!");
      });
    }
  });
}

function obterMetricas() {
  fetch("/Dados/metasDashboard", {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((response) => {
        response[0].meta_cpu = Number(response[0].meta_cpu);
        response[0].meta_gpu = Number(response[0].meta_gpu);
        response[0].meta_bat = Number(response[0].meta_bat);

        let total_carros = Number(span_total_carros.innerHTML);

        span_ocorrencia_cpu.innerHTML = dados_kpis.cpu.alerta;
        span_ocorrencia_cpu_carros.innerHTML = dados_kpis.cpu.carros.size;
        p_cpu_meta.innerHTML = `< ${response[0].meta_cpu} %`;
        p_cpu_meta.style = "color: black";
        let ocorrenciasCpuAtual = Math.round(dados_kpis.cpu.carros.size * 100 / total_carros, 1);
        console.log(ocorrenciasCpuAtual);
        console.log(response[0].meta_cpu);
        console.log(ocorrenciasCpuAtual < response[0].meta_cpu);
        if (ocorrenciasCpuAtual < response[0].meta_cpu) {
          p_cpu_atual.style = "color: green;";
        } else {
          p_cpu_atual.style = "color: red;";
        }
        p_cpu_atual.innerHTML = `${ocorrenciasCpuAtual} %`;


        span_ocorrencia_gpu.innerHTML = dados_kpis.gpu.alerta;
        span_ocorrencia_gpu_carros.innerHTML = dados_kpis.gpu.carros.size;
        p_gpu_meta.innerHTML = `< ${response[0].meta_gpu} %`;
        p_gpu_meta.style = "color: black";
        let ocorrenciasGpuAtual = Math.round(dados_kpis.gpu.carros.size * 100 / total_carros, 1);
        if (ocorrenciasGpuAtual < response[0].meta_gpu) {
          p_gpu_atual.style = "color: green;";
        } else {
          p_gpu_atual.style = "color: red;";
        }
        p_gpu_atual.innerHTML = `${ocorrenciasGpuAtual} %`;

        span_ocorrencia_bat.innerHTML = dados_kpis.bat.alerta;
        span_ocorrencia_bat_carros.innerHTML = dados_kpis.bat.carros.size;
        p_bat_meta.innerHTML = `< ${response[0].meta_bat} %`;
        p_bat_meta.style = "color: black";
        let ocorrenciasBatAtual = Math.round(dados_kpis.bat.carros.size * 100 / total_carros, 1);
        if (ocorrenciasBatAtual < response[0].meta_bat) {
          p_bat_atual.style = "color: green";
        } else {
          p_bat_atual.style = "color: red";
        }
        p_bat_atual.innerHTML = `${ocorrenciasBatAtual} %`;

      });
    } else {
      console.log(resposta)
      console.log("Houve um erro ao tentar recuperar os dados!");

      resposta.text().then(texto => {
        console.error(texto);
        alert("Houve um erro ao tentar recuperar os dados!");
      });
    }
  });
}

function buscarModelos() {
  fetch(`/Motorista/mostrarModelos`).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then(function (response) {
        console.log(response);
        sel_modelo_carro.innerHTML = '<option value="-" selected="true" selected="true">Todos</option>'
        for (let i = 0; i < response.length; i++) {
          sel_modelo_carro.innerHTML += `<option value="${response[i].idModelo}">${response[i].modelo}</option>`;
        }

      });
    } else {
      throw ('Houve um erro na API!');
    }
  }).catch(function (resposta) {
    console.error(resposta);

  });
}

function exibirTabelaDeCarros() {
  fetch(`/Dados/exibirTabelaDeCarros`).then(function (resposta) {
    if (resposta.ok) {

      resposta.json().then(function (response) {
        console.log(response);
        var corpo = document.getElementById("tabela-corpo")
        
        console.log(response.length)
        for (let index = 0; index < response.length; index++) {
          let linha = document.createElement("tr")
          let tdIdCarro = document.createElement("td")
          let tdOcorrenciaCPU = document.createElement("td")
          let tdOcorrenciaGPU = document.createElement("td")
          let tdOcorrenciaBateria = document.createElement("td")
          let tdOcorrenciaTotal = document.createElement("td")

          let ocorrenciaCPU = Number(response[index].cpuAlerta) + Number(response[index].cpuCritico)
          let ocorrenciaGPU = Number(response[index].gpuAlerta) + Number(response[index].gpuCritico)
          let ocorrenciasBateria = Number(response[index].bateriaAlerta) + Number(response[index].bateriaCritico)
          let OcorrenciaTotal = ocorrenciaCPU + ocorrenciaGPU + ocorrenciasBateria

          tdIdCarro.innerHTML = Number(response[index].fkCarro)
          tdOcorrenciaCPU.innerHTML = ocorrenciaCPU          
          tdOcorrenciaGPU.innerHTML = ocorrenciaGPU          
          tdOcorrenciaBateria.innerHTML = ocorrenciasBateria
          tdOcorrenciaTotal.innerHTML = OcorrenciaTotal

          linha.appendChild(tdIdCarro)
          linha.appendChild(tdOcorrenciaCPU)
          linha.appendChild(tdOcorrenciaGPU)
          linha.appendChild(tdOcorrenciaBateria)
          linha.appendChild(tdOcorrenciaTotal)

          corpo.append(linha)
        }
      })
    }
  })
}

var flotPlot;
var dashDataCrit;
var dashDataAlerta

var dados_graph = [];
var labels_graph = [];
var dados_kpis = {};
var tickData = [];
span_nome_usuario.innerHTML = sessionStorage.NOME_USUARIO;
span_nome_usuario_bem_vindo.innerHTML = sessionStorage.NOME_USUARIO.split(" ")[0];
var grafico_atual = "todos";
buscarModelos();
carregarDados();

atualizarNotificacoes();

function mudarDadosGrafico(parametro) {
  if (parametro == "cpu" && grafico_atual != "cpu") {
    flotPlot.setData([
      {
        label: "Estado de Alerta",
        data: dashDataAlerta.cpu,
        color: "rgba(253, 127, 99, 0.5)",
        lines: {
          fillColor: "rgba(253, 127, 99, 0.5)",
        },
      },
      {
        label: "Estado Crítico",
        data: dashDataCrit.cpu,
        color: "rgba(204, 22, 22, 0.6)",
        lines: {
          fillColor: "rgba(204, 22, 22, 0.6)",
        },
      }
    ]);
    grafico_atual = "cpu";
    div_card_cpu.classList.add("background-item-selected");
    div_card_gpu.classList.remove("background-item-selected");
    div_card_bat.classList.remove("background-item-selected");
  } else if (parametro == "gpu" && grafico_atual != "gpu") {
    flotPlot.setData([
      {
        label: "Estado de Alerta",
        data: dashDataAlerta.gpu,
        color: "rgba(253, 127, 99, 0.5)",
        lines: {
          fillColor: "rgba(253, 127, 99, 0.5)",
        },
      },
      {
        label: "Estado Crítico",
        data: dashDataCrit.gpu,
        color: "rgba(204, 22, 22, 0.6)",
        lines: {
          fillColor: "rgba(204, 22, 22, 0.6)",
        },
      }
    ]);
    grafico_atual = "gpu";
    div_card_cpu.classList.remove("background-item-selected");
    div_card_gpu.classList.add("background-item-selected");
    div_card_bat.classList.remove("background-item-selected");
  } else if (parametro == "bat" && grafico_atual != "bat") {
    flotPlot.setData([
      {
        label: "Estado de Alerta",
        data: dashDataAlerta.bat,
        color: "rgba(253, 127, 99, 0.5)",
        lines: {
          fillColor: "rgba(253, 127, 99, 0.5)",
        },
      },
      {
        label: "Estado Crítico",
        data: dashDataCrit.bat,
        color: "rgba(204, 22, 22, 0.6)",
        lines: {
          fillColor: "rgba(204, 22, 22, 0.6)",
        },
      }
    ]);
    grafico_atual = "bat"
    div_card_cpu.classList.remove("background-item-selected");
    div_card_gpu.classList.remove("background-item-selected");
    div_card_bat.classList.add("background-item-selected");
  } else {
    flotPlot.setData([
      {
        label: "Estado de Alerta",
        data: dashDataAlerta.total,
        color: "rgba(253, 127, 99, 0.5)",
        lines: {
          fillColor: "rgba(253, 127, 99, 0.5)",
        },
      },
      {
        label: "Estado Crítico",
        data: dashDataCrit.total,
        color: "rgba(204, 22, 22, 0.6)",
        lines: {
          fillColor: "rgba(204, 22, 22, 0.6)",
        },
      }
    ]);
    grafico_atual = "todos";
    div_card_cpu.classList.remove("background-item-selected");
    div_card_gpu.classList.remove("background-item-selected");
    div_card_bat.classList.remove("background-item-selected");
  }
  flotPlot.setupGrid(true);
  flotPlot.draw();
}

function extrairDadosConcatenados(response) {

  let jsonAlertas = {}

  dados_kpis = {
    cpu: { carros: new Set(), alerta: 0, critico: 0 },
    gpu: { carros: new Set(), alerta: 0, critico: 0 },
    bat: { carros: new Set(), alerta: 0, critico: 0 }
  };

  for (let i = 0; i < response.length; i++) {
    let dia = response[i]['dia'];
    let carro = response[i]['fkCarro'];
    if (!(dia in jsonAlertas)) {
      jsonAlertas[dia] = {
        cpuAlerta: 0,
        cpuCritico: 0,
        gpuAlerta: 0,
        gpuCritico: 0,
        batAlerta: 0,
        batCritico: 0,
      }
    }
    let arrayCpu = response[i]['cpuConcat'].split(',');
    let arrayGpu = response[i]['gpuConcat'].split(',');
    let arrayBat = response[i]['bateriaNivelConcat'].split(',');

    let cpuState = 0;
    let gpuState = 0;
    let batState = 0;

    for (let j = 0; j < arrayCpu.length; j++) {
      if (cpuState == 0 && arrayCpu[j] == '1') {
        jsonAlertas[dia]['cpuAlerta'] += 1;
        cpuState = 1;
        dados_kpis.cpu.carros.add(carro)
        dados_kpis.cpu.alerta += 1;
      } else if ((cpuState == 0 || cpuState == 1) && arrayCpu[j] == '2') {
        jsonAlertas[dia]['cpuCritico'] += 1;
        jsonAlertas[dia]['cpuAlerta'] += 1;
        cpuState = 2;
        dados_kpis.cpu.carros.add(carro)
        dados_kpis.cpu.alerta += 1;
        dados_kpis.cpu.critico += 1;
      } else if (cpuState == 2 && arrayCpu[j] == '1') {
        cpuState = 1;
      } else if ((cpuState == 1 || cpuState == 2) && arrayCpu[j] == '0') {
        cpuState = 0;
      }

      if (gpuState == 0 && arrayGpu[j] == '1') {
        jsonAlertas[dia]['gpuAlerta'] += 1;
        gpuState = 1;
        dados_kpis.gpu.carros.add(carro)
        dados_kpis.gpu.alerta += 1;
      } else if ((gpuState == 0 || gpuState == 1) && arrayGpu[j] == '2') {
        jsonAlertas[dia]['gpuCritico'] += 1;
        jsonAlertas[dia]['gpuAlerta'] += 1;
        gpuState = 2;
        dados_kpis.gpu.carros.add(carro)
        dados_kpis.gpu.alerta += 1;
        dados_kpis.gpu.critico += 1;
      } else if (gpuState == 2 && arrayGpu[j] == '1') {
        gpuState = 1;
      } else if ((gpuState == 1 || gpuState == 2) && arrayGpu[j] == '0') {
        gpuState = 0;
      }

      if (batState == 0 && arrayBat[j] == '1') {
        jsonAlertas[dia]['batAlerta'] += 1;
        batState = 1;
        dados_kpis.bat.carros.add(carro)
        dados_kpis.bat.alerta += 1;
      } else if ((batState == 0 || batState == 1) && arrayBat[j] == '2') {
        jsonAlertas[dia]['batCritico'] += 1;
        jsonAlertas[dia]['batAlerta'] += 1;
        batState = 2;
        dados_kpis.bat.carros.add(carro)
        dados_kpis.bat.alerta += 1;
        dados_kpis.bat.critico += 1;
      } else if (batState == 2 && arrayBat[j] == '1') {
        batState = 1;
      } else if ((batState == 1 || batState == 2) && arrayBat[j] == '0') {
        batState = 0;
      }
    }
  }

  return jsonAlertas;
}

function extrairDadosGraficos(jsonAlertas) {
  dados_graph = [];

  for (const [key, value] of Object.entries(jsonAlertas)) {
    value['dia'] = key;
    dados_graph.push(value);
  }

  day = new Date();
  cont = dados_graph.length - 1;

  for (i = 0; i < 30; i++) {
    labels_graph.push(day.getDate() + "/" + (day.getMonth() + 1));
    day.setDate(day.getDate() - 1);
    // if (cont >= 0 && dados_graph[cont].dia == labels_graph[i]) {
    //   dados_graph[cont].tick = 29 - i;
    //   cont--;
    // }
  }
  labels_graph = labels_graph.reverse();
  for (i = 0; i < 30; i++) {
    let curDia = labels_graph[i];
    let index = dados_graph.findIndex((x) => x.dia == curDia);
    if (index > -1) {
      dados_graph[index].tick = i;
    }
  }
}


function exibirGraficos() {

  (function ($) {
    "use strict";
    $(function () {
      Chart.defaults.global.legend.labels.usePointStyle = true;

      if ($("#inline-datepicker").length) {
        $("#inline-datepicker").datepicker({
          enableOnReadonly: true,
          todayHighlight: true,
          templates: {
            leftArrow: '<i class="mdi mdi-chevron-left"></i>',
            rightArrow: '<i class="mdi mdi-chevron-right"></i>',
          },
        });
      }
      // flot chart bar script
      $(function () {
        var data = [
          ["0", 6],
          ["1", 8],
          ["2", 4],
          ["3", 5],
          ["4", 6],
          ["5", 7],
        ];

        if ($("#earningChart").length) {
          $.plot("#earningChart", [data], {
            series: {
              bars: {
                show: true,
                barWidth: 0.5,
                align: "center",
                fillColor: "#cc1616",
              },
              color: "#cc1616",
              lines: {
                fill: true,
              },
            },
            xaxis: {
              mode: "categories",
              tickLength: 0,
              ticks: [],
            },
            yaxis: {
              ticks: [],
            },
            grid: {
              borderWidth: 0,
              labelMargin: 10,
              hoverable: true,
              clickable: true,
              mouseActiveRadius: 6,
            },
          });
        }
      });
      $(function () {
        var data = [
          ["0", 6],
          ["1", 8],
          ["2", 4],
          ["3", 5],
          ["4", 6],
          ["5", 7],
        ];

        if ($("#productChart").length) {
          $.plot("#productChart", [data], {
            series: {
              bars: {
                show: true,
                barWidth: 0.5,
                align: "center",
                fillColor: "#cc1616",
              },
              color: "#cc1616",
              lines: {
                fill: true,
              },
            },
            xaxis: {
              mode: "categories",
              tickLength: 0,
              ticks: [],
            },
            yaxis: {
              ticks: [],
            },
            grid: {
              borderWidth: 0,
              labelMargin: 10,
              hoverable: true,
              clickable: true,
              mouseActiveRadius: 6,
            },
          });
        }
      });
      $(function () {
        var data = [
          ["0", 6],
          ["1", 8],
          ["2", 4],
          ["3", 5],
          ["4", 6],
          ["5", 7],
        ];

        if ($("#orderChart").length) {
          $.plot("#orderChart", [data], {
            series: {
              bars: {
                show: true,
                barWidth: 0.5,
                align: "center",
                fillColor: "#cc1616",
              },
              color: "#cc1616",
              lines: {
                fill: true,
              },
            },
            xaxis: {
              mode: "categories",
              tickLength: 0,
              ticks: [],
            },
            yaxis: {
              ticks: [],
            },
            grid: {
              borderWidth: 0,
              labelMargin: 10,
              hoverable: true,
              clickable: true,
              mouseActiveRadius: 6,
            },
          });
        }
      });
      var areaData1 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: ["#e2f8f8"],
            borderColor: ["#00cccd"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptions1 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      var areaDataDark1 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: ["#00cccd33"],
            borderColor: ["#00cccd"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptionsDark1 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      var areaData2 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [13, 2, 15, 3, 19, 12],
            backgroundColor: ["#e2f8f8"],
            borderColor: ["#00cccd"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptions2 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      var areaDataDark2 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [13, 2, 15, 3, 19, 12],
            backgroundColor: ["#00cccd33"],
            borderColor: ["#00cccd"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptionsDark2 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      var areaData3 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 9, 13, 5, 12, 3],
            backgroundColor: ["#ffed92"],
            borderColor: ["#ffab2d"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptions3 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      var areaDataDark3 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 9, 13, 5, 12, 3],
            backgroundColor: ["#ffed924f"],
            borderColor: ["#ffab2d"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptionsDark3 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      var areaData4 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [2, 19, 13, 5, 12, 10],
            backgroundColor: ["#ffed92"],
            borderColor: ["#ffab2d"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptions4 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      var areaDataDark4 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [2, 19, 13, 5, 12, 10],
            backgroundColor: ["#ffed924f"],
            borderColor: ["#ffab2d"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptionsDark4 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      var areaData5 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 15, 2, 12],
            backgroundColor: ["#e2f8f8"],
            borderColor: ["#00cccd"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptions5 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      var areaDataDark5 = {
        labels: ["", "", "", "", ""],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 15, 2, 12],
            backgroundColor: ["#00cccd33"],
            borderColor: ["#00cccd"],
            borderWidth: 1,
            pointRadius: 0,
            fill: true, // 3: no fill
          },
        ],
      };
      var areaOptionsDark5 = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
              },
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      };
      if ($("#areaChart1").length) {
        var areaChartCanvas = $("#areaChart1").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaData1,
          options: areaOptions1,
        });
      }
      if ($("#areaChart2").length) {
        var areaChartCanvas = $("#areaChart2").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaData2,
          options: areaOptions2,
        });
      }
      if ($("#areaChart3").length) {
        var areaChartCanvas = $("#areaChart3").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaData3,
          options: areaOptions3,
        });
      }
      if ($("#areaChart4").length) {
        var areaChartCanvas = $("#areaChart4").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaData4,
          options: areaOptions4,
        });
      }
      if ($("#areaChart5").length) {
        var areaChartCanvas = $("#areaChart5").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaData5,
          options: areaOptions5,
        });
      }
      if ($("#areaChartDark1").length) {
        var areaChartCanvas = $("#areaChartDark1").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaDataDark1,
          options: areaOptionsDark1,
        });
      }
      if ($("#areaChartDark2").length) {
        var areaChartCanvas = $("#areaChartDark2").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaDataDark2,
          options: areaOptionsDark2,
        });
      }
      if ($("#areaChartDark3").length) {
        var areaChartCanvas = $("#areaChartDark3").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaDataDark3,
          options: areaOptionsDark3,
        });
      }
      if ($("#areaChartDark4").length) {
        var areaChartCanvas = $("#areaChartDark4").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaDataDark4,
          options: areaOptionsDark4,
        });
      }
      if ($("#areaChartDark5").length) {
        var areaChartCanvas = $("#areaChartDark5").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas, {
          type: "line",
          data: areaDataDark5,
          options: areaOptionsDark5,
        });
      }
      if ($("#surveyBar").length) {
        Chart.elements.Rectangle.prototype.draw = function () {
          var ctx = this._chart.ctx;
          var vm = this._view;
          var left, right, top, bottom, signX, signY, borderSkipped, radius;
          var borderWidth = vm.borderWidth;
          // Set Radius Here
          // If radius is large enough to cause drawing errors a max radius is imposed
          var cornerRadius = 10;

          if (!vm.horizontal) {
            // bar
            left = vm.x - vm.width / 2;
            right = vm.x + vm.width / 2;
            top = vm.y;
            bottom = vm.base;
            signX = 1;
            signY = bottom > top ? 1 : -1;
            borderSkipped = vm.borderSkipped || "bottom";
          } else {
            // horizontal bar
            left = vm.base;
            right = vm.x;
            top = vm.y - vm.height / 2;
            bottom = vm.y + vm.height / 2;
            signX = right > left ? 1 : -1;
            signY = 1;
            borderSkipped = vm.borderSkipped || "left";
          }

          // Canvas doesn't allow us to stroke inside the width so we can
          // adjust the sizes to fit if we're setting a stroke on the line
          if (borderWidth) {
            // borderWidth shold be less than bar width and bar height.
            var barSize = Math.min(
              Math.abs(left - right),
              Math.abs(top - bottom)
            );
            borderWidth = borderWidth > barSize ? barSize : borderWidth;
            var halfStroke = borderWidth / 2;
            // Adjust borderWidth when bar top position is near vm.base(zero).
            var borderLeft =
              left + (borderSkipped !== "left" ? halfStroke * signX : 0);
            var borderRight =
              right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
            var borderTop =
              top + (borderSkipped !== "top" ? halfStroke * signY : 0);
            var borderBottom =
              bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
            // not become a vertical line?
            if (borderLeft !== borderRight) {
              top = borderTop;
              bottom = borderBottom;
            }
            // not become a horizontal line?
            if (borderTop !== borderBottom) {
              left = borderLeft;
              right = borderRight;
            }
          }

          ctx.beginPath();
          ctx.fillStyle = vm.backgroundColor;
          ctx.strokeStyle = vm.borderColor;
          ctx.lineWidth = borderWidth;

          // Corner points, from bottom-left to bottom-right clockwise
          // | 1 2 |
          // | 0 3 |
          var corners = [
            [left, bottom],
            [left, top],
            [right, top],
            [right, bottom],
          ];

          // Find first (starting) corner with fallback to 'bottom'
          var borders = ["bottom", "left", "top", "right"];
          var startCorner = borders.indexOf(borderSkipped, 0);
          if (startCorner === -1) {
            startCorner = 0;
          }

          function cornerAt(index) {
            return corners[(startCorner + index) % 4];
          }

          // Draw rectangle from 'startCorner'
          var corner = cornerAt(0);
          var width, height, x, y, nextCorner, nextCornerId;
          ctx.moveTo(corner[0], corner[1]);

          for (var i = 1; i < 4; i++) {
            corner = cornerAt(i);
            nextCornerId = i + 1;
            if (nextCornerId == 4) {
              nextCornerId = 0;
            }

            nextCorner = cornerAt(nextCornerId);

            width = corners[2][0] - corners[1][0];
            height = corners[0][1] - corners[1][1];
            x = corners[1][0];
            y = corners[1][1];

            var radius = cornerRadius;

            // Fix radius being too large
            if (radius > height / 2) {
              radius = height / 2;
            }
            if (radius > width / 2) {
              radius = width / 2;
            }

            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(
              x + width,
              y + height,
              x + width - radius,
              y + height
            );
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
          }

          ctx.fill();
          if (borderWidth) {
            ctx.stroke();
          }
        };
        var data = {
          labels: ["S", "M", "T", "W", "T", "F", "S"],
          datasets: [
            {
              data: [14, 12, 9, 15, 10, 12, 10],
              backgroundColor: "#cc1616",
              borderColor: "#cc1616",
              pointRadius: 0,
              lineTension: 0,
              borderWidth: 1,
            },
            {
              data: [17, 17, 17, 17, 17, 17, 17],
              backgroundColor: "#e6e6e6",
              borderColor: "#e6e6e6",
              pointRadius: 0,
              lineTension: 0,
              borderWidth: 1,
            },
          ],
        };
        var options = {
          responsive: true,
          legend: {
            display: false,
          },
          barRoundness: 1,
          scales: {
            xAxes: [
              {
                display: true,
                stacked: true,
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                barPercentage: 0.3,
              },
            ],
            yAxes: [
              {
                ticks: {
                  display: false,
                  beginAtZero: true,
                },
                display: true,
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
              },
            ],
          },
        };
        var ctxBar = document.getElementById("surveyBar");
        var myBarChart = new Chart(ctxBar, {
          type: "bar",
          data: data,
          options: options,
        });
      }
      if ($("#surveyBarDark").length) {
        Chart.elements.Rectangle.prototype.draw = function () {
          var ctx = this._chart.ctx;
          var vm = this._view;
          var left, right, top, bottom, signX, signY, borderSkipped, radius;
          var borderWidth = vm.borderWidth;
          // Set Radius Here
          // If radius is large enough to cause drawing errors a max radius is imposed
          var cornerRadius = 10;

          if (!vm.horizontal) {
            // bar
            left = vm.x - vm.width / 2;
            right = vm.x + vm.width / 2;
            top = vm.y;
            bottom = vm.base;
            signX = 1;
            signY = bottom > top ? 1 : -1;
            borderSkipped = vm.borderSkipped || "bottom";
          } else {
            // horizontal bar
            left = vm.base;
            right = vm.x;
            top = vm.y - vm.height / 2;
            bottom = vm.y + vm.height / 2;
            signX = right > left ? 1 : -1;
            signY = 1;
            borderSkipped = vm.borderSkipped || "left";
          }

          // Canvas doesn't allow us to stroke inside the width so we can
          // adjust the sizes to fit if we're setting a stroke on the line
          if (borderWidth) {
            // borderWidth shold be less than bar width and bar height.
            var barSize = Math.min(
              Math.abs(left - right),
              Math.abs(top - bottom)
            );
            borderWidth = borderWidth > barSize ? barSize : borderWidth;
            var halfStroke = borderWidth / 2;
            // Adjust borderWidth when bar top position is near vm.base(zero).
            var borderLeft =
              left + (borderSkipped !== "left" ? halfStroke * signX : 0);
            var borderRight =
              right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
            var borderTop =
              top + (borderSkipped !== "top" ? halfStroke * signY : 0);
            var borderBottom =
              bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
            // not become a vertical line?
            if (borderLeft !== borderRight) {
              top = borderTop;
              bottom = borderBottom;
            }
            // not become a horizontal line?
            if (borderTop !== borderBottom) {
              left = borderLeft;
              right = borderRight;
            }
          }

          ctx.beginPath();
          ctx.fillStyle = vm.backgroundColor;
          ctx.strokeStyle = vm.borderColor;
          ctx.lineWidth = borderWidth;

          // Corner points, from bottom-left to bottom-right clockwise
          // | 1 2 |
          // | 0 3 |
          var corners = [
            [left, bottom],
            [left, top],
            [right, top],
            [right, bottom],
          ];

          // Find first (starting) corner with fallback to 'bottom'
          var borders = ["bottom", "left", "top", "right"];
          var startCorner = borders.indexOf(borderSkipped, 0);
          if (startCorner === -1) {
            startCorner = 0;
          }

          function cornerAt(index) {
            return corners[(startCorner + index) % 4];
          }

          // Draw rectangle from 'startCorner'
          var corner = cornerAt(0);
          var width, height, x, y, nextCorner, nextCornerId;
          ctx.moveTo(corner[0], corner[1]);

          for (var i = 1; i < 4; i++) {
            corner = cornerAt(i);
            nextCornerId = i + 1;
            if (nextCornerId == 4) {
              nextCornerId = 0;
            }

            nextCorner = cornerAt(nextCornerId);

            width = corners[2][0] - corners[1][0];
            height = corners[0][1] - corners[1][1];
            x = corners[1][0];
            y = corners[1][1];

            var radius = cornerRadius;

            // Fix radius being too large
            if (radius > height / 2) {
              radius = height / 2;
            }
            if (radius > width / 2) {
              radius = width / 2;
            }

            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(
              x + width,
              y + height,
              x + width - radius,
              y + height
            );
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
          }

          ctx.fill();
          if (borderWidth) {
            ctx.stroke();
          }
        };
        var data = {
          labels: ["S", "M", "T", "W", "T", "F", "S"],
          datasets: [
            {
              data: [14, 12, 9, 15, 10, 12, 10],
              backgroundColor: "#cc1616",
              borderColor: "#cc1616",
              pointRadius: 0,
              lineTension: 0,
              borderWidth: 1,
            },
            {
              data: [17, 17, 17, 17, 17, 17, 17],
              backgroundColor: "#383e5d",
              borderColor: "#383e5d",
              pointRadius: 0,
              lineTension: 0,
              borderWidth: 1,
            },
          ],
        };
        var options = {
          responsive: true,
          legend: {
            display: false,
          },
          barRoundness: 1,
          scales: {
            xAxes: [
              {
                display: true,
                stacked: true,
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                barPercentage: 0.3,
              },
            ],
            yAxes: [
              {
                ticks: {
                  display: false,
                  beginAtZero: true,
                },
                display: true,
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
              },
            ],
          },
        };
        var ctxBar = document.getElementById("surveyBarDark");
        var myBarChart = new Chart(ctxBar, {
          type: "bar",
          data: data,
          options: options,
        });
      }

      // flot chart script
      $(function () {
        "use strict";

        var dashData2 = [];
        dashDataCrit = { "cpu": [], "gpu": [], "bat": [], "total": [] };
        dashDataAlerta = { "cpu": [], "gpu": [], "bat": [], "total": [] };
        tickData = [];

        let cont = 0;
        for (let i = 0; i < 30; i++) {
          tickData.push([i, labels_graph[i]]);
          let index = dados_graph.findIndex((x) => x.dia == labels_graph[i]);
          if (index > -1) {

            let dado = dados_graph[index];

            dashDataAlerta.cpu.push([i, Number(dado.cpuAlerta)]);
            dashDataAlerta.gpu.push([i, Number(dado.gpuAlerta)]);
            dashDataAlerta.bat.push([i, Number(dado.batAlerta)]);
            dashDataAlerta.total.push([i, Number(dado.cpuAlerta) + Number(dado.gpuAlerta) + Number(dado.batAlerta)]);

            dashDataCrit.cpu.push([i, Number(dado.cpuCritico)]);
            dashDataCrit.gpu.push([i, Number(dado.gpuCritico)]);
            dashDataCrit.bat.push([i, Number(dado.batCritico)]);
            dashDataCrit.total.push([i, Number(dado.cpuCritico) + Number(dado.gpuCritico) + Number(dado.batCritico)]);
          } else {
            dashDataAlerta.cpu.push([i, 0]);
            dashDataAlerta.gpu.push([i, 0]);
            dashDataAlerta.bat.push([i, 0]);
            dashDataAlerta.total.push([i, 0]);

            dashDataCrit.cpu.push([i, 0]);
            dashDataCrit.gpu.push([i, 0]);
            dashDataCrit.bat.push([i, 0]);
            dashDataCrit.total.push([i, 0]);
          }


        }
        console.log(tickData)
        console.log(dashDataAlerta)

        function bgFlotData(num, val) {
          var data = [];
          for (var i = 0; i < num; ++i) {
            data.push([i, val]);
          }
          return data;
        }

        function bgFlotData(num, val) {
          var data = [];
          for (var i = 0; i < num; ++i) {
            data.push([i, val]);
          }
          return data;
        }

        flotPlot = $.plot(
          "#flotChart",
          [
            {
              label: "Estado de Alerta",
              data: dashDataAlerta.total,
              color: "rgba(253, 127, 99, 0.5)",
              lines: {
                fillColor: "rgba(253, 127, 99, 0.5)",
              },
            },
            {
              label: "Estado Crítico",
              data: dashDataCrit.total,
              color: "rgba(204, 22, 22, 0.6)",
              lines: {
                fillColor: "rgba(204, 22, 22, 0.6)",
              },
            },
          ],
          {
            series: {
              shadowSize: 0,
              lines: {
                show: true,
                lineWidth: 2,
                fill: true,
              },
            },
            legend: {
              show: true,
              position: "nw",
              noColumns: 1,
            },
            grid: {
              borderWidth: 0,
              labelMargin: 4,
            },
            yaxis: {
              show: true,
              color: "#fff",
              tickColor: "#eee",
              // min: 0,
              // max: 200,
              autoScale: "loose",
              labelWidth: 40,
              // ticks: [0,50,100, 150,200],
            },
            xaxis: {
              show: true,
              color: "#fff",
              tickColor: "#eee",
              ticks: tickData, /*[
              [0, "2000"],
              [10, "2500"],
              [20, "3000"],
              [30, "3500"],
              [40, "4000"],
              [50, "4500"],
              [60, "5000"],
              [70, "5500"],
            ],*/
            },
          }
        );

      });
    });
  })(jQuery);
}

function download() {
  const columnTitles = ['id', 'Data captura', 'Alerta cpu', 'Alerta gpu', 'Alerta bateria', 'Alerta total', 'Crítico cpu', 'Crítico gpu', 'Crítico bateria', 'Crítico total'];

  const combinedData = [columnTitles];
  for (let i = 0; i < tickData.length; i++) {
    const row1 = tickData[i];
    const row2 = dashDataAlerta.cpu[i][1];
    const row3 = dashDataAlerta.gpu[i][1];
    const row4 = dashDataAlerta.bat[i][1];
    const row5 = dashDataAlerta.total[i][1];
    const row6 = dashDataCrit.cpu[i][1];
    const row7 = dashDataCrit.gpu[i][1];
    const row8 = dashDataCrit.bat[i][1];
    const row9 = dashDataCrit.total[i][1];
    combinedData.push([row1, row2, row3, row4, row5, row6, row7, row8, row9]);
  }

  const combinedCSV = combinedData.map(row => row.join(',')).join('\n');

  const blob = new Blob([combinedCSV], { type: 'text/csv' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'dados.csv';
  document.body.appendChild(a);

  a.click();

  URL.revokeObjectURL(url);
}