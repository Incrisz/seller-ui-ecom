(() => {
  const textMuted = config.colors.textMuted;
  const headingColor = config.colors.headingColor;
  const borderColor = config.colors.borderColor;
  const fontFamily = config.fontFamily || 'Inter';
  const isDark = isDarkStyle;

  const renderChart = (selector, options) => {
    const element = document.querySelector(selector);
    if (element) {
      new ApexCharts(element, options).render();
    }
  };

  renderChart('#salesStatChart', {
    chart: {
      height: 250,
      type: 'area',
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    series: [
      {
        name: 'Sales',
        data: [620000, 780000, 710000, 940000, 1180000, 1320000]
      }
    ],
    colors: [config.colors.primary],
    fill: {
      type: 'gradient',
      gradient: {
        shade: isDark ? 'dark' : 'light',
        shadeIntensity: 0.4,
        opacityFrom: 0.35,
        opacityTo: 0.08,
        stops: [0, 90, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor,
      strokeDashArray: 6,
      padding: {
        left: 8,
        right: 8,
        top: -12,
        bottom: -8
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: textMuted,
          fontFamily
        }
      }
    },
    yaxis: {
      labels: {
        formatter: value => `₦${Math.round(value / 1000)}k`,
        style: {
          colors: textMuted,
          fontFamily
        }
      }
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: value => `₦${value.toLocaleString()}`
      }
    }
  });

  renderChart('#categoryWiseChart', {
    chart: {
      height: 220,
      type: 'bar',
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    series: [
      {
        name: 'Products',
        data: [42, 31, 22, 18, 15]
      }
    ],
    colors: [config.colors.primary],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: '48%'
      }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor,
      strokeDashArray: 6,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: {
        top: -10,
        right: 8,
        left: 4,
        bottom: -10
      }
    },
    xaxis: {
      categories: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Office'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: textMuted,
          fontFamily
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: textMuted,
          fontFamily
        }
      }
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: value => `${value} products`
      }
    }
  });

  renderChart('#ordersBreakdownChart', {
    chart: {
      height: 255,
      type: 'donut'
    },
    series: [34, 6, 19, 83],
    labels: ['New Order', 'Cancelled', 'On Delivery', 'Delivered'],
    colors: [
      config.colors.primary,
      config.colors.danger,
      config.colors.warning,
      config.colors.success
    ],
    stroke: {
      width: 6,
      colors: [config.colors.cardColor]
    },
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontFamily,
      labels: {
        colors: textMuted
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 18,
              fontFamily,
              color: textMuted
            },
            value: {
              show: true,
              offsetY: -12,
              fontFamily,
              color: headingColor,
              formatter: value => `${Math.round(value)}`
            },
            total: {
              show: true,
              label: 'Orders',
              fontFamily,
              color: textMuted,
              formatter: () => '142'
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: value => `${value} orders`
      }
    }
  });
})();
