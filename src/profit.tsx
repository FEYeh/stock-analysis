import * as React from 'react';
import { Spin } from 'antd';
import * as table2json from 'table2json';
import EchartsReact from './components/EchartsReact';
import Api from './api';

interface TotalIncomeState {
  isLoading: boolean
  option: any
  profits: any
}
interface TotalIncomeProp {
  code: string
}
export default class TotalIncome extends React.Component<TotalIncomeProp, TotalIncomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      // 正在加载数据
      isLoading: false,
      // 数据
      option: {},
      // profits
      profits: null,
    };
  }
  componentDidMount() {
    this.loadData();
  }
  loadData() {
    if (this.state.isLoading) {
      return;
    }
    this.setState({ isLoading: true });
    Api.getProfit({ code: this.props.code }).then(res => {
      console.log('res', res.data);
      const { data } = res;
      const html = unescape(data);
      const startStr = '<table width="775px" id="Table1">';
      const endStr = '</table>';
      const tableStart = html.substring(html.indexOf(startStr) + startStr.length);
      const tableInnerHTML = tableStart.substring(0, tableStart.indexOf(endStr));
      console.log('tableInnerHTML', tableInnerHTML);
      const table = document.createElement('table');
      table.innerHTML = tableInnerHTML;
      const tableJson = table2json.parse(table);
      console.log('tableJson', tableJson);
      const profits = tableJson.map((t: { [s: string]: unknown; } | ArrayLike<unknown>) => {
        return Object.values(t);
      });
      const xAxisData = profits.map((k: any[]) => k[0]).reverse();
      const seriesData = profits.map((k: string[]) => parseInt((k[1] + '').replace(/,/g, ''), 10)).reverse();
      console.log('profits', profits);
      const option = {
        title: {
          text: '净利润'
        },
        legend: {
          data: ['dea', 'diff', 'macd']
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
            name: 'dea',
            stack: 'dea',
            type: 'line',
            data: seriesData,
            color: ['#ff71FB']
          }
        ],
      };
      this.setState({ option, profits });
    }).finally(() => {
      this.setState({ isLoading: false });
    });
  }
  render() {
    const { option, isLoading, profits } = this.state;
    return (
      <Spin spinning={isLoading}>
        {profits && profits.length > 0 && <EchartsReact option={option} />}
      </Spin>
    );
  }
}

