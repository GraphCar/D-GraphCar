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
        span_alerta_cpu.innerHTML = response[0].cpuCritico;
        span_alerta_gpu.innerHTML = response[0].ramCritico;
        span_alerta_bat.innerHTML = response[0].bateriaCritico;
        span_ocorrencia_cpu.innerHTML = Number(response[0].cpuAlerta) + Number(response[0].cpuCritico);
        span_ocorrencia_gpu.innerHTML = Number(response[0].ramAlerta) + Number(response[0].ramCritico);
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

  fetch("/Dados/alertasConcatenados", {
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

var flotPlot;
var dashDataCrit;
var dashDataAlerta
var dados_graph = [];
var labels_graph = [];
var dados_kpis = {};
span_nome_usuario.innerHTML = sessionStorage.NOME_USUARIO;
span_nome_usuario_bem_vindo.innerHTML = sessionStorage.NOME_USUARIO.split(" ")[0];
carregarDados();

function mudarDadosGrafico(parametro) {
  if (parametro == "cpu") {
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
  } else if (parametro == "ram") {
    flotPlot.setData([
      {
        label: "Estado de Alerta",
        data: dashDataAlerta.ram,
        color: "rgba(253, 127, 99, 0.5)",
        lines: {
          fillColor: "rgba(253, 127, 99, 0.5)",
        },
      },
      {
        label: "Estado Crítico",
        data: dashDataCrit.ram,
        color: "rgba(204, 22, 22, 0.6)",
        lines: {
          fillColor: "rgba(204, 22, 22, 0.6)",
        },
      }
    ]);
  } else if (parametro == "bat") {
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
  } else if (parametro == "todos") {
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
  }
  flotPlot.setupGrid(false);
  flotPlot.draw();
}

function extrairDadosConcatenados(response) {

  let jsonAlertas = {}

  dados_kpis = {
    cpu: { carros: new Set(), alerta: 0, critico: 0 },
    ram: { carros: new Set(), alerta: 0, critico: 0 },
    bat: { carros: new Set(), alerta: 0, critico: 0 }
  };

  for (let i = 0; i < response.length; i++) {
    let dia = response[i]['dia'];
    let carro = response[i]['fkCarro'];
    if (!(dia in jsonAlertas)) {
      jsonAlertas[dia] = {
        cpuAlerta: 0,
        cpuCritico: 0,
        ramAlerta: 0,
        ramCritico: 0,
        batAlerta: 0,
        batCritico: 0,
      }
    }
    let arrayCpu = response[i]['cpuConcat'].split(',');
    let arrayRam = response[i]['memoriaConcat'].split(',');
    let arrayBat = response[i]['bateriaNivelConcat'].split(',');

    let cpuState = 0;
    let ramState = 0;
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

      if (ramState == 0 && arrayRam[j] == '1') {
        jsonAlertas[dia]['ramAlerta'] += 1;
        ramState = 1;
        dados_kpis.ram.carros.add(carro)
        dados_kpis.ram.alerta += 1;
      } else if ((ramState == 0 || ramState == 1) && arrayRam[j] == '2') {
        jsonAlertas[dia]['ramCritico'] += 1;
        jsonAlertas[dia]['ramAlerta'] += 1;
        ramState = 2;
        dados_kpis.ram.carros.add(carro)
        dados_kpis.ram.alerta += 1;
        dados_kpis.ram.critico += 1;
      } else if (ramState == 2 && arrayRam[j] == '1') {
        ramState = 1;
      } else if ((ramState == 1 || ramState == 2) && arrayRam[j] == '0') {
        ramState = 0;
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
    if (cont >= 0 && dados_graph[cont].dia == labels_graph[i]) {
      dados_graph[cont].tick = 29 - i;
      cont--;
    }
  }
  labels_graph = labels_graph.reverse();
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
        dashDataCrit = { "cpu": [], "ram": [], "bat": [], "total": [] };
        dashDataAlerta = { "cpu": [], "ram": [], "bat": [], "total": [] };
        var tickData = [];

        let cont = 0;
        for (let i = 0; i < 30; i++) {
          tickData.push([i, labels_graph[i]]);
          if (cont < dados_graph.length && dados_graph[cont].tick == i) {
            let dado = dados_graph[cont];
            dashDataAlerta.cpu.push([i, Number(dado.cpuAlerta)]);
            dashDataAlerta.ram.push([i, Number(dado.ramAlerta)]);
            dashDataAlerta.bat.push([i, Number(dado.batAlerta)]);
            dashDataAlerta.total.push([i, Number(dado.cpuAlerta) + Number(dado.ramAlerta) + Number(dado.batAlerta)]);

            dashDataCrit.cpu.push([i, Number(dado.cpuCritico)]);
            dashDataCrit.ram.push([i, Number(dado.ramCritico)]);
            dashDataCrit.bat.push([i, Number(dado.batCritico)]);
            dashDataCrit.total.push([i, Number(dado.cpuCritico) + Number(dado.ramCritico) + Number(dado.batCritico)]);
            cont++;
          } else {
            dashDataAlerta.cpu.push([i, 0]);
            dashDataAlerta.ram.push([i, 0]);
            dashDataAlerta.bat.push([i, 0]);
            dashDataAlerta.total.push([i, 0]);

            dashDataCrit.cpu.push([i, 0]);
            dashDataCrit.ram.push([i, 0]);
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
              labelMargin: 8,
            },
            yaxis: {
              show: true,
              color: "#fff",
              tickColor: "#eee",
              // min: 0,
              // max: 200,
              autoScale: "loose",
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