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
} 

function temperaturaCPU(taxaTemperaturaCPU) {
  var degrees = rateToDegrees(taxaTemperaturaCPU);
  indicator.style.transform = "rotate(" + degrees + "deg)";
  frame1 = taxaTemperaturaCPU;

  var formattedRate = parseFloat(frame1).toFixed(2);
  
  valueText.textContent = formattedRate.replace(/(\.0*$|0+$)/, '') + "%";

  frame3 = frame1 * 1.2;
    CPU(frame3);

} setInterval(exibirCPU, 1000);

function rateToDegrees(taxaTemperaturaCPU) {
    var degrees = taxaTemperaturaCPU * 180 / 100 - 90;
    return degrees;
}

// Grafico temperatura gpu

var indicatorGpu = document.querySelector("#indicator-Temperatura-Gpu");
var valueTextGpu = document.getElementById("value-temperatura-gpu");

function exibirGPU() {
    fetch(`/tablet/exibirGPU`)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (resposta) {
            console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
            arrayTablet = resposta;

            frame2 = arrayTablet[0].memoria;
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

  var formattedRate = parseFloat(frame2).toFixed(2);

  frame4 = frame2 * 1.2;
    GPU(frame4);
  
  valueTextGpu.textContent = formattedRate.replace(/(\.0*$|0+$)/, '') + "%";
} setInterval(temperaturaGPU, 1000);

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

} setInterval(CPU, 1000);

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
} setInterval(GPU, 1000);

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
          
          batteryPercentage = arrayTablet[0].bateriaNivel.toString().slice(0, 2)
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

initBattery()

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
        } setInterval(initBattery,10000)
// alertas

// grafico
  
const exibirAlerta = document.getElementById('exibirAlerta');
const alerta = document.getElementById('alerta');
const fecharAlerta = document.getElementById('fecharAlerta');

exibirAlerta.addEventListener('click', () => {
    alerta.style.display = 'block';
});

fecharAlerta.addEventListener('click', () => {
    alerta.style.display = 'none';
});

// Gráfico
var options = {
    chart: {
        height: 390,
        width: 800,
        type: "area"
    },
    dataLabels: {
        enabled: false
    },
    series: [
        {
            name: "Series 1",
            data: [45, 52, 38, 45, 19, 23, 2]
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
        categories: [
            "01 Jan",
            "02 Jan",
            "03 Jan",
            "04 Jan",
            "05 Jan",
            "06 Jan",
            "07 Jan"
        ]
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();



