// Grafico temperatura cpu

var indicator = document.querySelector("#indicator-Temperatura-Cpu");
var valueText = document.getElementById("value-temperatura-cpu");

function exibirCPU() {
    fetch(`/tablet/exibirCPU`)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (resposta) {
            console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
            arrayTablet = resposta;

            frame1 = arrayTablet[0].cpuUso;
            temperaturaCPU(frame1);

          });
        } else {
          console.error("Nenhum dado encontrado ou erro na API");
        }
      })
      .catch(function (error) {
        console.error(`Erro na obtenção dos dados p/ idEmpresa: ${error.message}`);
      });
    return false;
} setInterval(exibirCPU,7000)

function temperaturaCPU(taxaTemperaturaCPU) {
  var degrees = rateToDegrees(taxaTemperaturaCPU);
  indicator.style.transform = "rotate(" + degrees + "deg)";
  frame1 = taxaTemperaturaCPU;

  var formattedRate = parseFloat(frame1).toFixed(1);
  
  valueText.textContent = formattedRate.replace(/(\.0*$|0+$)/, '') + "%";

  frame3 = frame1 * 4;

  var divElement = document.getElementById('exibirAlertaDados');

    if (frame3 > 60) {
   
      void divElement.offsetWidth;
  
      divElement.classList.add('pulsar');
  
      divElement.querySelector('h3').textContent = 'Assuma o controle do volante 🚨';

      divElement.style.animation = 'pulse 4s infinite'
    
    } else{

      divElement.style.animation = 'none'

      divElement.querySelector('h3').textContent = 'Nenhum alerta';

    }

    CPU(frame3);

} 

function rateToDegrees(taxaTemperaturaCPU) {
    var degrees = taxaTemperaturaCPU * 180 / 100 - 90;
    return degrees;
}

// Grafico temperatura gpu

var indicatorGpu = document.querySelector("#indicator-Temperatura-Gpu");
var valueTextGpu = document.getElementById("value-temperatura-gpu");

var chartTemperaturaCPU; 

const exibirAlertaTemperaturaCPU = document.getElementById('exibirAlertaTemperaturaCPU');
const alertaTemperaturaCPU = document.getElementById('alertaTemperaturaCPU');
const fecharAlertaTemperaturaCPU = document.getElementById('fecharAlertaTemperaturaCPU');

exibirAlertaTemperaturaCPU.addEventListener('click', () => {
    alertaTemperaturaCPU.style.display = 'block';
});

fecharAlertaTemperaturaCPU.addEventListener('click', () => {
    alertaTemperaturaCPU.style.display = 'none';
});

function exibirGPU() {
    fetch(`/tablet/exibirGPU`)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (resposta) {
            console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
            dadosTemperaturaCPU = resposta;

            frame2 = (dadosTemperaturaCPU[0].memoria) * 0.6;
            temperaturaGPU(frame2);

          });
        } else {
          console.error("Nenhum dado encontrado ou erro na API");
        }
      })
      .catch(function (error) {
        console.error(
          `Erro na obtenção dos dados p/ idEmpresa: ${error.message}`
        );
      });
    return false;
  } 

function temperaturaGPU(taxaTemperaturaGPU) {
  var degrees = rateToDegrees(taxaTemperaturaGPU);
  indicatorGpu.style.transform = "rotate(" + degrees + "deg)";
  frame2 = taxaTemperaturaGPU;

  var formattedRate = parseFloat(frame2).toFixed(1);

  frame4 = frame2 * 1.3;
    GPU(frame4);
  
  valueTextGpu.textContent = formattedRate.replace(/(\.0*$|0+$)/, '') + "%";
} 

function rateToDegrees(taxaTemperaturaGPU) {
    var degrees = taxaTemperaturaGPU * 180 / 100 - 90;
    return degrees;
}

// Grafico cpu

var indicatorCpu = document.querySelector("#indicatorCpu");
var valueTextCpu = document.getElementById("valueCpu");

function CPU(taxaCPU) {
  var degrees = rateToDegrees(taxaCPU);
  indicatorCpu.style.transform = "rotate(" + degrees + "deg)";
  frame3 = taxaCPU;

  var formattedRate = parseFloat(frame3).toFixed(1);
  
  valueTextCpu.textContent = formattedRate.replace(/(\.0*$|0+$)/, '') + "%";

} 

function rateToDegrees(taxaCPU) {
    var degrees = taxaCPU * 180 / 100 - 90;
    return degrees;
}

// Grafico GPU 

var indicator_GPU = document.querySelector("#indicator_GPU");
var valueText_GPU = document.getElementById("value_GPU");

function GPU(taxaGPU) {
  var degrees = rateToDegrees(taxaGPU);
  indicator_GPU.style.transform = "rotate(" + degrees + "deg)";
  frame4 = taxaGPU;

  var formattedRate = parseFloat(frame4).toFixed(1);
  
  valueText_GPU.textContent = formattedRate.replace(/(\.0*$|0+$)/, '') + "%";
} 

function rateToDegrees(taxaGPU) {
    var degrees = taxaGPU * 180 / 100 - 90;
    return degrees;
}

// bateria

var arrayTablet = []; 

function exibirBateria() {
  fetch(`/tablet/exibirBateria`)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (resposta) {
          console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
          arrayTablet = resposta;

          batteryPercentage = arrayTablet[0].bateriaNivel.toString().slice(0, 3)
          initBattery(batteryPercentage)

        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/ idEmpresa: ${error.message}`);
    });
  return false;
}

function initBattery(){
    const batteryLiquid = document.querySelector('.battery__liquid'),
          batteryStatus = document.querySelector('.battery__status'),
          batteryHTML = document.querySelector('#batteryPercentage')

          let level = Math.floor(batteryPercentage)
          batteryHTML.innerHTML = level + '%'

            batteryLiquid.style.height = `${parseInt(batteryPercentage )}%`

            if(batteryPercentage == 100){ 
                batteryStatus.innerHTML = `Full battery <i class="ri-battery-2-fill green-color"></i>`
                batteryLiquid.style.height = '103%' 
            }
            else if(batteryPercentage <= 20 &! batteryPercentage.charging){ 
                batteryStatus.innerHTML = `Low battery <i class="ri-plug-line animated-red"></i>`
            }
            else if(batteryPercentage.charging){ 
                batteryStatus.innerHTML = `Charging... <i class="ri-flashlight-line animated-green"></i>`
            }
            else{
                batteryStatus.innerHTML = ''
            }
            
            if(batteryPercentage <=20){
                batteryLiquid.classList.add('gradient-color-red')
                batteryLiquid.classList.remove('gradient-color-orange','gradient-color-yellow','gradient-color-green')
            }
            else if(batteryPercentage <= 40){
                batteryLiquid.classList.add('gradient-color-orange')
                batteryLiquid.classList.remove('gradient-color-red','gradient-color-yellow','gradient-color-green')
            }
            else if(batteryPercentage <= 80){
                batteryLiquid.classList.add('gradient-color-yellow')
                batteryLiquid.classList.remove('gradient-color-red','gradient-color-orange','gradient-color-green')
            }
            else{
                batteryLiquid.classList.add('gradient-color-green')
                batteryLiquid.classList.remove('gradient-color-red','gradient-color-orange','gradient-color-yellow')
            }
        } 

// grafico CPU
  
const exibirAlertaCPU = document.getElementById('exibirAlertaCPU');
const alertaCPU = document.getElementById('alertaCPU');
const fecharAlertaCPU = document.getElementById('fecharAlertaCPU');

exibirAlertaCPU.addEventListener('click', () => {
    alertaCPU.style.display = 'block';
});

fecharAlertaCPU.addEventListener('click', () => {
    alertaCPU.style.display = 'none';
});

//  dados
var dadosDahTemperaturaCPU = [];
var chart; 
var chartGPU; 
var chartTemperaturaCPU; 

function dadosDahTemperaturaCpu() {
  fetch(`/tablet/dadosDahTemperaturaCpu`)
    .then(function (response) {
      console.log(response)
      if (response.ok) {
        response.json().then(function (resposta) {
          console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
          dadosDahTemperaturaCPU = resposta;

          var valores_cpu = dadosDahTemperaturaCPU.map(function (dado) {
            return parseFloat(dado.cpuUso);
          }).reverse(); 

          chart.updateSeries([{ data: valores_cpu }]);

          var valores_gpu = dadosDahTemperaturaCPU.map(function (dadoGPU) {
            return parseFloat((dadoGPU.cpuUso) * 4).toFixed(1);
          }).reverse(); 

          chartGPU.updateSeries([{ data: valores_gpu }]);

        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/ idEmpresa: ${error.message}`);
    });
  return false;
}

// data

function dataDashTemperaturaCpu() {
  fetch(`/tablet/dataDashTemperaturaCpu`)
    .then(function (response) {
      console.log(response)
      if (response.ok) {
        response.json().then(function (resposta) {
          console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
          datasDashTemperaturaCPU = resposta;

          var datas_cpu = datasDashTemperaturaCPU.map(function (data) {
            return data.hora; 
          }).reverse();

          chart.updateOptions({
            xaxis: {
              categories: datas_cpu
            }
          });

          var datas_GPU = datasDashTemperaturaCPU.map(function (data) {
            return data.hora; 
          }).reverse();

          chartGPU.updateOptions({
            xaxis: {
              categories: datas_GPU
            }
          });

          var datas_TemperaturaCPU = datasDashTemperaturaCPU.map(function (data) {
            return data.hora; 
          }).reverse();

          chartTemperaturaCPU.updateOptions({
            xaxis: {
              categories: datas_TemperaturaCPU
            }
          });

          var datas_TemperaturaGPU = datasDashTemperaturaCPU.map(function (data) {
            return data.hora; 
          }).reverse();

          chartTemperaturaGPU.updateOptions({
            xaxis: {
              categories: datas_TemperaturaGPU
            }
          });

        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/ idEmpresa: ${error.message}`);
    });
  return false;
}

// plotar grafico

function criarGraficoCpu() {
  var options = {
    chart: {
      height: 380,
      width: 800,
      type: "area"
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        name: "Series 1",
        data: []
      }
    ],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: []
    }
  };

  chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
  
}

criarGraficoCpu();

setInterval(dadosDahTemperaturaCpu, 1000);
setInterval(dataDashTemperaturaCpu, 1000);
setInterval(dadosDahTemperaturaGpu, 1000);

// grafico gpu

const exibirAlertaGPU = document.getElementById('exibirAlertaGPU');
const alertaGPU = document.getElementById('alertaGPU');
const fecharAlertaGPU = document.getElementById('fecharAlertaGPU');

exibirAlertaGPU.addEventListener('click', () => {
    alertaGPU.style.display = 'block';
});

fecharAlertaGPU.addEventListener('click', () => {
    alertaGPU.style.display = 'none';
});

function criarGraficoGPU() {
  var options = {
    chart: {
      height: 380,
      width: 800,
      type: "area"
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        name: "GPU Usage",
        data: []
      }
    ],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: []
    }
  };

  chartGPU = new ApexCharts(document.querySelector("#chartGPU"), options);
  chartGPU.render();
}

criarGraficoGPU();

// temperatura cpu

function dadosDahTemperaturaGpu() {
  fetch(`/tablet/dadosDahTemperaturaGpu`)
    .then(function (response) {
      console.log(response)
      if (response.ok) {
        response.json().then(function (resposta) {
          console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
          dadosTemperaturaGpu = resposta;

         var valores_Temperatura_cpu = dadosTemperaturaGpu.map(function (dado3) {
              return parseFloat((dado3.memoria) * 0.6).toFixed(1);
            }).reverse(); 
  
          chartTemperaturaCPU.updateSeries([{ data: valores_Temperatura_cpu }]);

          var valores_Temperatura_GPU = dadosTemperaturaGpu.map(function (dado3) {
            return parseFloat(((dado3.memoria) * 0.6) * 1.3).toFixed(1);
          }).reverse(); 

        chartTemperaturaGPU.updateSeries([{ data: valores_Temperatura_GPU }]);
          

        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/ idEmpresa: ${error.message}`);
    });
  return false;
}

  function criarGraficoTemperaturaCPU() {
    var options = {
      chart: {
        height: 380,
        width: 800,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      series: [
        {
          name: "GPU Usage",
          data: []
        }
      ],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: []
      }
    };
  
    chartTemperaturaCPU = new ApexCharts(document.querySelector("#chartTemperaturaCPU"), options);
    chartTemperaturaCPU.render();
  }
  
  criarGraficoTemperaturaCPU();

// temperatura GPU

const exibirAlertaTemperaturaGPU = document.getElementById('exibirAlertaTemperaturaGPU');
const alertaTemperaturaGPU = document.getElementById('alertaTemperaturaGPU');
const fecharAlertaTemperaturaGPU = document.getElementById('fecharAlertaTemperaturaGPU');

exibirAlertaTemperaturaGPU.addEventListener('click', () => {
    alertaTemperaturaGPU.style.display = 'block';
});

fecharAlertaTemperaturaGPU.addEventListener('click', () => {
    alertaTemperaturaGPU.style.display = 'none';
});


function criarGraficoTemperaturaGPU() {
  var options = {
    chart: {
      height: 380,
      width: 800,
      type: "area"
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        name: "GPU Usage",
        data: []
      }
    ],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: []
    }
  };

  chartTemperaturaGPU = new ApexCharts(document.querySelector("#chartTemperaturaGPU"), options);
  chartTemperaturaGPU.render();
}

  
criarGraficoTemperaturaGPU();


// alertas
