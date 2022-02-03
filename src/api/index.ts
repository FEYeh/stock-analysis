import Constants from '@/utils/constants';
import axios from 'axios';
import iconv from 'iconv-lite';
import fetchJsonp from 'fetch-jsonp';
import moment from 'moment';
import JSON5 from 'json5';
import utils from '@/utils';

/**
 * 获取沪深股票
 */
const getStockBasics = async () => {
  // const url = `https://money.finance.sina.com.cn/quotes_service/api/jsonp_v2.php/myback/Market_Center.getHQNodeDataNew?page=1&num=5000&sort=nmc&asc=0&node=hs_a`;
  const url = 'https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?page=1&num=5000&sort=nmc&asc=0&node=hs_a&_s_r_a=sort';
  const result = await axios(url);
  return {
    code: 0,
    data: result.data
  };
};

/**
 * 百度股票日线数据
 * @param {string} code 股票完整代码，如sz300162
 * @param {int} count 距离今天多少天的数据
 * @param {string} fq 复权：front为前复权，no为不复权
 * @param {boolean} index 指数标志，true代表是指数，默认false
 */
 const getKDataFromBaidu = async (params: any) => {
  const { code, count = 160, fq = 'front', index = false } = params;
  const symbol: any = index ? Constants.INDEX_SYMBOL[code] : Constants.codeToSymbol(code);
  const url = Constants.BAIDU_K_DATA_URL(Constants.P_TYPE['https'],
    symbol, count, fq, +(new Date()));
  const result = await fetch(url);
  return JSON5.parse(result.toString());
};

// 根据代码获取股票信息
const getKDataFromSohu = async (params: any) => {
  const { code } = params;
  const url = `http://q.stock.sohu.com/hisHq?code=cn_${code}&start=${moment(new Date()).subtract(30, 'days').format('YYYYMMDD')}&end=${moment(new Date()).format('YYYYMMDD')}&stat=1&order=D&period=d&rt=json`;
  // console.log('url', url)
  const result = await fetch(url);
  return JSON5.parse(result.toString());
};

// 根据代码获取股票营业总收入
const getTotalIncome = async (params: any) => {
  // const { code } = params;
  // const url = `http://vip.stock.finance.sina.com.cn/corp/view/vFD_FinanceSummaryHistory.php?stockid=${code}&type=BIZTOTINCO&cate=liru0`;
  // let totalIncome;
  // try {
  //   const result: any = await fetch(url).then(async (res) => {
  //     return await res.text();
  //   });
  //   console.log('result', result);

  //   const html = iconv.decode(result, 'GBK');
  //   totalIncome = escape(html);
  // } catch (error) {
  //   totalIncome = '';
  // }
  // return {
  //   code: 0,
  //   data: totalIncome
  // };
  return {
    code: 0,
    data: ''
  };
};

// 根据代码获取股票净利润
const getProfit = async (params: any) => {
  const { code } = params;
  const url = `http://vip.stock.finance.sina.com.cn/corp/view/vFD_FinanceSummaryHistory.php?stockid=${code}&type=NETPROFIT&cate=liru0`;
  let totalIncome;
  try {
    const result: any = await fetch(url).then(async (res) => {
      return await res.text();
    });
    console.log('result', result);

    const html = iconv.decode(result, 'GBK');
    totalIncome = escape(html);
  } catch (error) {
    totalIncome = '';
  }
  return {
    code: 0,
    data: totalIncome
  };
};


export default {
  getStockBasics,
  getKDataFromBaidu,
  getKDataFromSohu,
  getTotalIncome,
  getProfit,
};
