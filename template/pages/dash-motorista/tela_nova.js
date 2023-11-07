var indicator = document.querySelector("#indicator");
var valueText = document.querySelector("#value-text");
var randomBtn = document.querySelector("#random");
var gauge = document.querySelector(".gauge");

function exibirCPU() {
    fetch(`/tablet/exibirCPU`)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (resposta) {
            console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
            arrayTablet = resposta;
  
            cardCPU.innerHTML += `<p>${arrayTablet[0].cpuUso}</p>`;
            const frame1 = parseFloat(arrayTablet[0].cpuUso.replace(',', '.')); // Converte para número usando parseFloat
            goTo1(frame1); // Chama goTo1 com o valor recebido como frame1
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

document.querySelector("#value-form").addEventListener("submit", function(e) {
  e.preventDefault();

  changeRate(document.querySelector(frame1).value);
});

randomBtn.addEventListener("click", function() {
  let randomNum = Math.round(Math.random() * 100);
  changeRate(randomNum);
});

function rateToDegrees(rate) {
  var degrees = rate * 180 / 100 - 90;
  return degrees;
}

function changeRate(rate) {
  var degrees = rateToDegrees(rate);
  indicator.style.transform = "rotate(" + degrees + "deg)";
  changeText(valueText, rate);
}

function changeText(item, value) {
  var current = parseInt(item.innerHTML.slice(0, item.innerHTML.length - 1));
  if (current > value) {
    invertedIterate(current, value);
  } else {
    iterate(current, value);
  }
}

function iterate(i, n) {
  if (i <= n) {
    valueText.innerHTML = i + "%";
    setTimeout(iterate, 10, i + 1, n);
  }
}
function invertedIterate(i, n) {
  if (i >= n) {
    valueText.innerHTML = i + "%";
    setTimeout(invertedIterate, 10, i - 1, n);
  }
}

function docReady(fn) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
