import { useState, memo, useEffect } from "react";
import {
  Table, Form, InputNumber, Button, message,
  Modal, Spin, Row, Col
} from 'antd';
import { get_stock_codes, get_stock_type } from './easyquotation-ts/helpers';
import { MACD } from './easyquotation-ts/indicator';
import QuotationFactory, { ApiType } from './easyquotation-ts';
import { StockCode } from "./easyquotation-ts/basequotation";
import EchartsReact from "./components/EchartsReact";
import { checkHasPotential, getMacdLineOption } from "./utils/stock";



export default memo(function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAjaxing, setIsAjaxing] = useState<boolean>(false);
  const [hasPotential, setHasPotential] = useState<boolean>(false);
  const [showMacdModal, setShowMacdModal] = useState<boolean>(false);
  const [codes, setCodes] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [lineOption, setLineOption] = useState<any>([]);
  const [kOption, setKOption] = useState<any>([]);

  const columns = [
    {
      title: '代码',
      dataIndex: 'code',
    }, {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      width: '15%',
      render: (_: any, record: any) => {
        return (
          <div>
            <Button onClick={getDayKline(record)}>获取日K线</Button>
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    const list = await get_stock_codes();
    console.log('codes', list);
    setCodes(list);
    setFilterData(list);
    setIsLoading(false);
  };

  const getDayKline = (record: StockCode) => async () => {

    setIsAjaxing(true);
    const quotation = QuotationFactory.createQuotation(ApiType.DAY_KLINE);
    const res = await quotation.real([record]);
    setIsAjaxing(false);
    const ds = res.map((d: any) => {
      const list = (d.qfqday || []).map((q: any) => q[2]);
      const date = (d.qfqday || []).map((q: any) => q[0]);
      const macd = MACD(list);
      const item = {
        code: d.qt.zjlx[0],
        name: d.qt.zjlx[12],
        kline: (d.qfqday || []),
        macd,
        date
      };
      return item;
    });
    console.log('getDayKline', ds[0]);
    if (ds && ds.length > 0) {
      // 获取K线
      const { lineOption, kOption } = getMacdLineOption(ds[0]);
      setLineOption(lineOption);
      setKOption(kOption);
      // 判断是否为潜在股
      const potential = checkHasPotential(ds[0]);
      setHasPotential(potential);
      setShowMacdModal(true);
    }
  };

  const handlePotentialStockSearch = (values: any) => {
    startPotentialStockSearch(values);
  };

  const startPotentialStockSearch = async (values: any) => {
    try {
      const { start, end } = values;
      const filterCodes = codes.slice(start, end);
      setIsAjaxing(true);
      const quotation = QuotationFactory.createQuotation(ApiType.DAY_KLINE);
      const res = await quotation.real(filterCodes);
      setIsAjaxing(false);
      const potentials = res.map((d: any) => {
        const list = (d.qfqday || []).map((q: any) => q[2]);
        const date = (d.qfqday || []).map((q: any) => q[0]);
        const macd = MACD(list);
        const item = {
          code: d.qt.zjlx ? d.qt.zjlx[0] : get_stock_type(d.stock?.code) + d.stock?.code,
          name: d.qt.zjlx ? d.qt.zjlx[12] : d.stock?.name,
          kline: (d.qfqday || []),
          macd,
          date
        };
        return item;
      }).filter((d: any) => {
        const res = checkHasPotential(d);
        return res;
      });
      setFilterData(potentials);
    } catch (error) {
      message.error('出错啦~!');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Spin spinning={isAjaxing}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ start: 0, end: 500 }}
          onFinish={handlePotentialStockSearch}
          autoComplete="off"
        >
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                label="开始位置"
                name="start"
                rules={[{ required: true, message: '请输入开始位置' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="结束位置"
                name="end"
                rules={[{ required: true, message: '请输入结束位置' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  筛选潜在股
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* <Button onClick={handlePotentialStockSearch}>筛选潜在股</Button> */}
        <Table rowKey="code" loading={isLoading} columns={columns} dataSource={filterData} />
        <Modal
          style={{ top: 30 }}
          title="macd"
          visible={showMacdModal}
          onCancel={() => {
            setShowMacdModal(false);
          }}
          footer={null}
        >
          <div>短期是否有上升趋势：{hasPotential ? <span className="green">是</span> : <span className="red">否</span>}</div>
          <EchartsReact option={kOption} />
          <EchartsReact option={lineOption} />
        </Modal>
      </Spin>
    </div>
  );
});
