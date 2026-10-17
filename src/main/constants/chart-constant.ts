import Chart from 'chart.js';

function chartOptions() {
  // Options
  const options = {
    defaults: {
      global: {
        responsive: true,
        maintainAspectRatio: false,
        defaultColor: '#525f7f',
        defaultFontColor: '#525f7f',
        defaultFontFamily: 'Open Sans',
        defaultFontSize: 13,
        layout: {
          padding: 0,
        },
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 16,
          },
        },
        elements: {
          point: {
            radius: 0,
            backgroundColor: '#5e72e4',
          },
          line: {
            tension: 0.4,
            borderWidth: 4,
            borderColor: '#5e72e4',
            backgroundColor: 'transparent',
            borderCapStyle: 'rounded',
          },
          rectangle: {
            backgroundColor: '#fb6340',
          },
          arc: {
            backgroundColor: '#5e72e4',
            borderColor: '#32325d',
            borderWidth: 4,
          },
        },
        tooltips: {
          enabled: true,
          mode: 'index',
          intersect: false,
        },
      },
      doughnut: {
        cutoutPercentage: 83,
        legendCallback: function (chart: { data: any }) {
          const data = chart.data;
          let content = '';

          data.labels.forEach(function (label: string, index: string | number) {
            const bgColor = data.datasets[0].backgroundColor[index];

            content += '<span class="chart-legend-item">';
            content += '<i class="chart-legend-indicator" style="background-color: ' + bgColor + '"></i>';
            content += label;
            content += '</span>';
          });

          return content;
        },
      },
    },
  };

  // yAxes
  Chart.scaleService.updateScaleDefaults('linear', {
    gridLines: {
      borderDash: [2],
      borderDashOffset: 2,
      color: '#dee2e6',
      drawBorder: false,
      drawTicks: false,
      lineWidth: 1,
      zeroLineWidth: 1,
      zeroLineColor: '#dee2e6',
      zeroLineBorderDash: [2],
      zeroLineBorderDashOffset: 2,
    },
    ticks: {
      beginAtZero: true,
      padding: 10,
      callback: function (value: number) {
        if (!(value % 10)) {
          return value;
        }
      },
    },
  });

  // xAxes
  Chart.scaleService.updateScaleDefaults('category', {
    gridLines: {
      drawBorder: false,
      drawOnChartArea: false,
      drawTicks: false,
    },
    ticks: {
      padding: 20,
    },
  });

  return options;
}

// Parse global options
function parseOptions(parent: any, options: any) {
  for (const item in options) {
    if (typeof options[item] !== 'object') {
      parent[item] = options[item];
    } else {
      parseOptions(parent[item], options[item]);
    }
  }
}

export function parseDefaultOptions(parent: any) {
  return parseOptions(parent, chartOptions());
}
