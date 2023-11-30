function carregarServidores() {
  fetch('/Servidor/listarServidores', {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((response) => {
        sel_servidor.innerHTML = '';

        for(let i = 0; i < response.length; i++) {
          let mac = response[i].mac;
          for (let m = 2; m < 15; m += 3) {
            mac = mac.slice(0,m) + ':' + mac.slice(m);
          }
          sel_servidor.innerHTML += `<option value="${response[i].idServidor}">${response[i].hostname} (${mac})</option>`;
        }
        console.log("Markings: ")
        console.log(markings_total)
        carregarChamados();
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

function carregarChamados() {
  fetch(`/Servidor/listarPeriodosChamados/${sel_servidor.value}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((response) => {

        markings_total = {'cpu': [], 'ram': [], 'disco': []}
        labels_graph = [];
        dados_graph = {'cpu': [], 'ram': [], 'disco': []};

        for (let i = 0; i < response.length; i ++) {
          if (response[i].fkComponente == 1) {
            markings_total.cpu.push([response[i].dataAbertura, response[i].dataFechamento, response[i].encerrado]);
          } else if (response[i].fkComponente == 2) {
            markings_total.ram.push([response[i].dataAbertura, response[i].dataFechamento, response[i].encerrado]);
          } else {
            markings_total.disco.push([response[i].dataAbertura, response[i].dataFechamento, response[i].encerrado]);
          }
        }
        console.log(markings_total)

        carregarDados();
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

function carregarDados() {
  let periodo = sel_periodo.value;
  let grupo = sel_grupo.value;
  if (periodo == "YEAR") {
    if (grupo == "hora" || grupo == "minuto") {
      grupo = "dia";
      sel_grupo.value = "dia";
    }
    opt_grupo_1.disabled = false;
    opt_grupo_2.disabled = false;
    opt_grupo_3.disabled = true;
    opt_grupo_4.disabled = true;
  } else if (periodo == "MONTH") {
    if (grupo == "mes" || grupo == "minuto") {
      grupo = "dia";
      sel_grupo.value = "dia";
    }
    opt_grupo_1.disabled = true;
    opt_grupo_2.disabled = false;
    opt_grupo_3.disabled = false;
    opt_grupo_4.disabled = true;
  } else if (periodo == "WEEK") {
    if (grupo == "mes" || grupo == "minuto") {
      grupo = "dia";
      sel_grupo.value = "dia";
    }
    opt_grupo_1.disabled = true;
    opt_grupo_2.disabled = false;
    opt_grupo_3.disabled = false;
    opt_grupo_4.disabled = true;
  } else {
    if (grupo == "mes" || grupo == "dia") {
      grupo = "hora";
      sel_grupo.value = "hora";
    }
    opt_grupo_1.disabled = true;
    opt_grupo_2.disabled = true;
    opt_grupo_3.disabled = false;
    opt_grupo_4.disabled = false;
  }

  fetch(`/Servidor/listarDados/${sel_servidor.value}-${periodo}-${grupo}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((response) => {
        labels_graph = [];
        markings_graph = {'cpu': [], 'ram': [], 'disco': []};
        dados_graph = {'cpu': [], 'ram': [], 'disco': []};
        curCpu = null;
        curRam = null;
        curDisco = null;

        for (let i = 0; i < response.length; i ++) {

          // console.log("Iniciando " + i);

          labels_graph.push([labels_graph.length, response[i].dataFormatada]);
          dados_graph.cpu.push([dados_graph.cpu.length, response[i].cpuUso]);

          // console.log("Label atual: " + labels_graph[i]);

          if (markings_total.cpu.length > 0) {
            if (curCpu != null && curCpu[1] <= response[i].maxDateDado) {
              markings_graph.cpu[markings_graph.cpu.length - 1].xaxis.from = i;
              
              curCpu = null;
              markings_total.cpu.splice(0, 1);
            } 
            if (curCpu == null && markings_total.cpu.length > 0 && markings_total.cpu[0][0] <= response[i].minDateDado) {
              curCpu = markings_total.cpu[0];
              markings_graph.cpu.push({ xaxis: { from: i, to: i }, color: "#FFBBBB"});
              if (curCpu[2] == 0) {
                markings_graph.cpu[markings_graph.cpu.length -1].xaxis.from = response.length - 1;
              }
            }
          }

          dados_graph.ram.push([dados_graph.ram.length, response[i].memoria]);

          if (markings_total.ram.length > 0) {
            if (curRam != null && curRam[1] <= response[i].maxDateDado) {
                markings_graph.ram[markings_graph.ram.length -1].xaxis.from = i;
            
            	curRam = null;
	        markings_total.ram.splice(0, 1);
            } 
            if (curRam == null && markings_total.ram.length > 0 && markings_total.ram[0][0] <= response[i].minDateDado) {
              curRam = markings_total.ram[0]
              markings_graph.ram.push({ xaxis: { from: i, to: i }, color: "#FFBBBB"});
              console.log(curRam);
              if (curRam[2] == 0) {
                markings_graph.ram[markings_graph.ram.length -1].xaxis.from = response.length - 1;
              }
            }
          }
          
          dados_graph.disco.push([dados_graph.disco.length, response[i].disco]);

          if (markings_total.disco.length > 0) {
            if (curDisco != null && curDisco[1] <= response[i].maxDateDado) {
                markings_graph.disco[markings_graph.disco.length -1].xaxis.from = i;

                curDisco = null;
                markings_total.disco.splice(0, 1);
            } 
            if ( curDisco == null && markings_total.disco.length > 0 && markings_total.disco[0][0] <= response[i].minDateDado) {
              curDisco = markings_total.disco[0]
              markings_graph.disco.push({ xaxis: { from: i, to: i }, color: "#FFBBBB"});
              if (curDisco[2] == 0) {
                markings_graph.disco[markings_graph.disco.length -1].xaxis.from = response.length - 1;
              }
            }
          }
        }

        console.log(markings_graph);

        obterMetricas();
        exibirGraficos();
        
        mudarDadosGrafico("cpu");
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
  fetch("/Servidor/listarAlertas/-", {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (resposta) {
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
        var notificacoes = document.getElementById("div_lista_alertas");

        notificacoes.innerHTML = '<h6 class="p-3 mb-0">Mensagens</h6>';
        if (resposta.length == 0) {
          span_qtde_alertas.classList.add("invisible");
          let aDropDown = document.createElement("a");
          let divConteudo = document.createElement("div");
          let pMensagem = document.createElement("p");

          aDropDown.classList.add("dropdown-item", "preview-item");
          divConteudo.classList.add("preview-item-content", "flex-grow");
          pMensagem.classList.add("text-small", "text-muted", "ellipsis", "mb-0");

          pMensagem.innerHTML = "Não há chamados no momento!";

          divConteudo.appendChild(pMensagem);
          aDropDown.appendChild(divConteudo);
          notificacoes.appendChild(aDropDown);

        } else {
          for (let i = 0; i < resposta.length; i++) {
  
            let aDropDown = document.createElement("a");
            let divConteudo = document.createElement("div");
            let spanTitulo = document.createElement("span");
            let pMensagem = document.createElement("p");
    
            let componente = "";
            if (resposta[i].fkComponente == 1) {
              componente = "CPU";
            } else if (resposta[i].fkComponente == 2) {
              componente = "RAM";
            } else {
              componente = "Disco";
            }
  
            spanTitulo.innerHTML = resposta[i].chaveJira;
            aDropDown.href = `https://graphcar-servers.atlassian.net/browse/${resposta[i].chaveJira}`;
            pMensagem.innerHTML = `Componente: ${componente}<br>
                Status: ${resposta[i].status}<br>
                Data Abertura: ${resposta[i].dataAbertura}`;
    
            aDropDown.classList.add("dropdown-item", "preview-item");
            divConteudo.classList.add("preview-item-content", "flex-grow");
            spanTitulo.classList.add("badge", "badge-pill");
  
            if (resposta[i].critico == 0) {
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

function obterMetricas() {
  fetch("/Servidor/listarTempoOcorrencias", {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((response) => {
        for (let i = 0; i < response.length; i++) {
          if (response[i].idComponente == 1) {
            span_ocorrencia_cpu.innerHTML = response[i].qtdeChamados;

            p_cpu_real.innerHTML = `${response[i].tempoPorcent} %`;
            if (response[i].tempoPorcent > 5) {
              p_cpu_real.style = "color: red";
            } else {
              p_cpu_real.style = "color: green";
            }
          } else if (response[i].idComponente == 2) {
            span_ocorrencia_ram.innerHTML = response[i].qtdeChamados;

            p_ram_real.innerHTML = `${response[i].tempoPorcent} %`;
            if (response[i].tempoPorcent > 10) {
              p_ram_real.style = "color: red";
            } else {
              p_ram_real.style = "color: green";
            }
          } else {
            span_ocorrencia_disco.innerHTML = response[i].qtdeChamados;
            p_disco_real.innerHTML = `${response[i].tempoPorcent} %`;
            if (response[i].tempoPorcent > 5) {
              p_disco_real.style = "color: red";
            } else {
              p_disco_real.style = "color: green";
            }
          }
        }
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

var flotPlot;
var dashDataUso;
var dados_graph = [];
var labels_graph = [];
var markings_total = [];
var markings_graph = [];
var dados_kpis = {};
var tickData = [];
span_nome_usuario.innerHTML = sessionStorage.NOME_USUARIO;
span_nome_usuario_bem_vindo.innerHTML = sessionStorage.NOME_USUARIO.split(" ")[0];
var grafico_atual = "";

sel_periodo.value = "MONTH";
sel_grupo.value = "dia";

carregarServidores();
atualizarNotificacoes();

function mudarDadosGrafico(parametro) {
  if (parametro == "cpu" && grafico_atual != "cpu") {
    // flotPlot.setData([
    //   {
    //     label: "Uso médio (%)",
    //     data: dados_graph.cpu,
    //     color: "rgba(99, 127, 253, 0.7)",
    //     lines: {
    //       fillColor: "rgba(99, 127, 253, 0.3)",
    //     },
    //   }
    // ]);
    grafico_atual = "cpu";
    div_card_cpu.classList.add("background-item-selected");
    div_card_ram.classList.remove("background-item-selected");
    div_card_disco.classList.remove("background-item-selected");
  } else if (parametro == "ram" && grafico_atual != "ram") {
    // flotPlot.setData([
    //   {
    //     label: "Uso médio (%)",
    //     data: dados_graph.ram,
    //     color: "rgba(99, 127, 253, 0.7)",
    //     lines: {
    //       fillColor: "rgba(99, 127, 253, 0.3)",
    //     },
    //   },
    // ]);
    grafico_atual = "ram";
    div_card_cpu.classList.remove("background-item-selected");
    div_card_ram.classList.add("background-item-selected");
    div_card_disco.classList.remove("background-item-selected");
  } else if (parametro == "disco" && grafico_atual != "disco") {
    // flotPlot.setData([
    //   {
    //     label: "Uso médio (%)",
    //     data: dados_graph.disco,
    //     color: "rgba(99, 127, 253, 0.7)",
    //     lines: {
    //       fillColor: "rgba(99, 127, 253, 0.3)",
    //     },
    //   },
    // ]);
    grafico_atual = "disco"
    div_card_cpu.classList.remove("background-item-selected");
    div_card_ram.classList.remove("background-item-selected");
    div_card_disco.classList.add("background-item-selected");
  } 
  exibirGraficos();
  flotPlot.setupGrid(true);
  flotPlot.draw();
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
        
        if (flotPlot != null) {
          flotPlot.destroy();
        }

        flotPlot = $.plot(
          "#flotChart",
          [
            {
              label: "Uso médio (%)",
              data: dados_graph[grafico_atual],
              color: "rgba(99, 127, 253, 0.7)",
              lines: {
                fillColor: "rgba(99, 127, 253, 0.3)",
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
              markings: markings_graph[grafico_atual],
            },
            yaxis: {
              show: true,
              color: "#fff",
              tickColor: "#eee",
              min: 0,
              max: 100,
              autoScale: false,
              labelWidth: 40,
            },
            xaxis: {
              show: true,
              color: "#fff",
              tickColor: "#eee",
              ticks: labels_graph,
            },
          }
        );
    
      });
    });
  })(jQuery);
}

function download() {
  const columnTitles = ['id', 'Data captura', 'Alerta cpu', 'Alerta gpu', 'Alerta bateria', 'Alerta total', 'Crítico cpu', 'Crítico gpu','Crítico bateria', 'Crítico total']; 

  const combinedData = [columnTitles];
  for (let i = 0; i < tickData.length; i++) {
    const row1 = tickData[i];
    const row2 = dashDataAlerta.cpu[i][1];
    const row3 = dashDataAlerta.gpu[i][1];
    const row4 = dashDataAlerta.bat[i][1];
    const row5 = dashDataAlerta.total[i][1];
    const row6 = dashDataUso.cpu[i][1];
    const row7 = dashDataUso.gpu[i][1];
    const row8 = dashDataUso.bat[i][1];
    const row9 = dashDataUso.total[i][1];
    combinedData.push([row1, row2, row3, row4,row5,row6,row7,row8,row9]);
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
