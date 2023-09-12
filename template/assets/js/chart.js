$(function() {
  /* ChartJS
   * -------
   * Data and config for chartjs
   */
  'use strict';
  var data = { // CPU e RAM
    labels: ["09:00", "10:00", "11:00"],
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
  var doughnutPieData = { // gráfico GPU
    datasets: [{
      data: [40, 89, 50, 100],
      backgroundColor: [
        'rgba(246,220,220, 0.8)'
      ],
      borderColor: [
        'rgba(204,22,22, 0.8)'
      ],
      borderWidth: 1,
      fill: true
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      '09:00',
      '10:00',
      '11:00',
    ]
  };
  var doughnutPieOptions = {
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
  var areaData = { // Disco
    labels: ['09:00', '10:00', '11:00'],
    datasets: [{
      data: [36, 40, 45, 60],
      backgroundColor: [
        'rgba(246,220,220, 0.8)'
      ],
      borderColor: [
        'rgba(204,22,22, 0.8)'
      ],
      borderWidth: 1,
      fill: true, // 3: no fill
    }]
  };

  var areaOptions = {
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

  // Get context with jQuery - using jQuery's .get() method.
  if ($("#barChart").length) {
    var barChartCanvas = $("#barChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChart = new Chart(barChartCanvas, {
      type: 'line',
      data: data,
      options: options
    });
  }

  if ($("#lineChart").length) {
    var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
    var lineChart = new Chart(lineChartCanvas, {
      type: 'line',
      data: data,
      options: options
    });
  }

  if ($("#doughnutChart").length) {
    var doughnutChartCanvas = $("#doughnutChart").get(0).getContext("2d");
    var doughnutChart = new Chart(doughnutChartCanvas, {
      type: 'line',
      data: doughnutPieData,
      options: doughnutPieOptions
    });
  }

  if ($("#areaChart").length) {
    var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
    var areaChart = new Chart(areaChartCanvas, {
      type: 'line',
      data: areaData,
      options: areaOptions
    });
  }
});