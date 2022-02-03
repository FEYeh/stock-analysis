import * as React from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';

interface PropType {
  option: any;
  width?: string;
  height?: string;
}
export default class EchartsReact extends React.Component<PropType> {
  ID: any = React.createRef();
  constructor(props: any) {
    super(props);
    this.initPie = this.initPie.bind(this);
  }
  // 初始化
  initPie() {
    const { option = {} } = this.props;
    // 初始化echarts
    const myChart = echarts.init(this.ID);
    // 设置options
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  }
  componentDidMount() {
    this.initPie();
  }
  componentDidUpdate() {
    // console.log('componentDidUpdate');
    this.initPie();
  }
  render() {
    const { width = '100%', height = '300px' } = this.props;
    return <div ref={ID => { this.ID = ID; }} style={{ width, height }} />;
  }
}
