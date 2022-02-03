
const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';

export const checkHasPotential = (kData: any) => {
  if (!kData?.kline?.length) {
    console.log('无k线数据');
    return false;
  }
  if (kData?.kline?.length < 2) {
    console.log('k线数据不足');
    return false;
  }
  let isGoodCode = false;
  const dea1 = kData.macd.deas[kData.kline.length - 1];
  const diff1 = kData.macd.diffs[kData.kline.length - 1];
  const dea2 = kData.macd.deas[kData.kline.length - 2];
  const diff2 = kData.macd.diffs[kData.kline.length - 2];
  const difference1 = dea1 - diff1;
  const difference2 = dea2 - diff2;
  const ratio = difference1 / difference2;
  const threshold = 0.9;
  console.log('checkHasPotential', diff1, dea1, diff2, dea2, difference1, difference2, ratio, threshold);
  console.log('cond 1', diff1 < dea1);
  console.log('cond 2', diff2 < dea2);
  console.log('cond 3', difference1 < difference2);
  console.log('cond 4', ratio < threshold);

  if (diff1 < dea1 &&
    diff2 < dea2 &&
    difference1 < difference2 &&
    ratio < threshold) {
    console.log('goodCode', diff1, dea1, diff2, dea2, difference1, difference2, ratio);
    isGoodCode = true;
  }
  return isGoodCode;
};

export const getMacdLineOption = (item: any) => {
  const rKData = item.kline.map((k: any[]) => ([k[0], k[1], k[2], k[4], k[3]]));
  console.log('rKData', rKData);
  
  const xAxisData = item.date;
  const seriesDeaData = item.macd.deas;
  const seriesDiffData = item.macd.diffs;
  const seriesMacdData = item.macd.bars;
  function splitData(rawData: any) {
    const categoryData = [];
    const values = [];
    for (let i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i].splice(0, 1)[0]);
      values.push(rawData[i]);
    }
    return {
      categoryData: categoryData,
      values: values
    };
  }
  const seriesKData = splitData(rKData);
  const kOption = {
    title: {
      text: 'k线',
      left: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['日K']
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: seriesKData.categoryData,
      scale: true,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      splitNumber: 20,
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 20,
        end: 100
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 20,
        end: 100
      }
    ],
    series: [
      {
        name: '日K',
        type: 'candlestick',
        data: seriesKData.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor
        },
        markPoint: {
          label: {
            formatter: function (param: any) {
              return param != null ? Math.round(param.value) + '' : '';
            }
          },
          data: [
            {
              name: 'Mark',
              coord: ['2013/5/31', 2300],
              value: 2300,
              itemStyle: {
                color: 'rgb(41,60,85)'
              }
            },
            {
              name: 'highest value',
              type: 'max',
              valueDim: 'highest'
            },
            {
              name: 'lowest value',
              type: 'min',
              valueDim: 'lowest'
            },
            {
              name: 'average value on close',
              type: 'average',
              valueDim: 'close'
            }
          ],
          tooltip: {
            formatter: function (param: any) {
              return param.name + '<br>' + (param.data.coord || '');
            }
          }
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            [
              {
                name: 'from lowest to highest',
                type: 'min',
                valueDim: 'lowest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              },
              {
                type: 'max',
                valueDim: 'highest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              }
            ],
            {
              name: 'min line on close',
              type: 'min',
              valueDim: 'close'
            },
            {
              name: 'max line on close',
              type: 'max',
              valueDim: 'close'
            }
          ]
        }
      },
    ]
  };
  const lineOption = {
    title: {
      text: 'MACD'
    },
    legend: {
      data: ['deas', 'diffs', 'bars']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'deas',
        stack: 'deas',
        type: 'line',
        data: seriesDeaData,
        color: ['#ff71FB']
      },
      {
        name: 'diffs',
        stack: 'diffs',
        type: 'line',
        data: seriesDiffData,
        color: ['#5971FB']
      },
      {
        name: 'bars',
        type: 'bar',
        data: seriesMacdData,
        color: ['#59ff59']
      }
    ],
  };
  return { lineOption, kOption };
};