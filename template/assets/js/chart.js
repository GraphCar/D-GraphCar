$(function() {
  /* ChartJS
   * -------
   * Data and config for chartjs
   */
  'use strict';

  // CPU

  var dataCPU = {
    labels: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
    datasets: [{
      data: [30, 20, 50, 30, 15, 100],
      backgroundColor: [
        'rgba(246,220,220, 0.8)'
      ],
      borderColor: [
        'rgba(204,22,22, 0.8)'
      ],
      borderWidth: 1,
      fill: true
    }]
  };
  var options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    }

  };

// RAM

  var dataRAM = {
    labels: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
    datasets: [{
      data: [10, 53, 22, 65, 15, 96],
      backgroundColor: [
        'rgba(246,220,220, 0.8)'
      ],
      borderColor: [
        'rgba(204,22,22, 0.8)'
      ],
      borderWidth: 1,
      fill: true
    }]
  };
  
// DISCO

  var dataDisco = {
    labels: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
    datasets: [{
      data: [75, 34, 80, 12, 39, 56],
      backgroundColor: [
        'rgba(246,220,220, 0.8)'
      ],
      borderColor: [
        'rgba(204,22,22, 0.8)'
      ],
      borderWidth: 1,
      fill: true
    }]
  };

// GPU

  var dataGPU = {
    labels: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
    datasets: [{
      data: [50, 20, 70, 54, 23, 37],
      backgroundColor: [
        'rgba(246,220,220, 0.8)'
      ],
      borderColor: [
        'rgba(204,22,22, 0.8)'
      ],
      borderWidth: 1,
      fill: true
    }]
  };
  
  // Get context with jQuery - using jQuery's .get() method.
  if ($("#cpuChart").length) {
    var cpuChartCanvas = $("#cpuChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var cpuChart = new Chart(cpuChartCanvas, {
      type: 'line',
      data: dataCPU,
      options: options
    });
  }

  if ($("#ramChart").length) {
    var ramChartCanvas = $("#ramChart").get(0).getContext("2d");
    var ramChart = new Chart(ramChartCanvas, {
      type: 'line',
      data: dataRAM,
      options: options
    });
  }

  if ($("#discoChart").length) {
    var discoChartCanvas = $("#discoChart").get(0).getContext("2d");
    var discoChart = new Chart(discoChartCanvas, {
      type: 'line',
      data: dataDisco,
      options: options
    });
  }

  if ($("#gpuChart").length) {
    var gpuChartCanvas = $("#gpuChart").get(0).getContext("2d");
    var gpuChart = new Chart(gpuChartCanvas, {
      type: 'line',
      data: dataGPU,
      options: options
    });
  }
});