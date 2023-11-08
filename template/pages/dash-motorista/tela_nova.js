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
  
  valueTextGpu.textContent = formattedRate.replace(/(\.0*$|0+$)/, '') + "%";
} setInterval(exibirGPU, 1000);

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

  var formattedRate = parseFloat(frame3).toFixed(2);
  
  valueTextCpu.textContent = formattedRate.replace(/(\.0*$|0+$)/, '') + "%";
} setInterval(exibirGPU, 1000);

function rateToDegrees(taxaCPU) {
    var degrees = taxaCPU * 180 / 100 - 90;
    return degrees;
}

// bateria

navigator.getBattery()
.then(function (battery) {
  window.battery = battery;
  window.porcentagem = document.querySelector('#porcentagem');
  handleBattery();
});
  
function handleBattery() {
    if (battery) {
        battery.addEventListener('chargingchange', updateBatteryStatus);
        battery.addEventListener('levelchange', updateBatteryStatus);
        updateBatteryStatus();
    }
}
 
function updateBatteryStatus() {
    if (battery.level * 100 === 100 ) porcentagem.style.width =  '97%';
    else porcentagem.style.width = battery.level * 100 + '%';
    
    porcentagem.className = battery.charging ? 'charging' : 'notCharging';
}
