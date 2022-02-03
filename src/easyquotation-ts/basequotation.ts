import axios from 'axios';
import { get_stock_type } from './helpers';
import promiseLimit from 'promise-limit';

const limit = promiseLimit(10);

export interface StockCode {
  code: string;
  name: string;
  params?: string;
}

export interface BaseQuotationOption {
  stock_codes?: StockCode[];
}

export default class BaseQuotation {
  max_num = 10; // 每次请求的最大股票数
  stock_api = '';
  stock_codes: StockCode[] = [];
  stock_list: StockCode[] = [];
  request_list: string[] = [];

  constructor(options: BaseQuotationOption) {
    this.stock_codes = options.stock_codes || [];
    this.stock_list = this.gen_stock_list(this.stock_codes);
  }

  protected _gen_stock_prefix(stock_codes: StockCode[]): StockCode[] {
    return stock_codes.map((stock_code: StockCode) => {
      stock_code.code  = get_stock_type(stock_code.code) + stock_code.code;;
      return stock_code;
    });
  }

  gen_stock_list(stock_codes: StockCode[]) {
    const stock_with_exchange_list: StockCode[] = this._gen_stock_prefix(stock_codes);
    return stock_with_exchange_list;
  }

  /**
   * 
   * 
   * @param stock_codes 
   * @param prefix 
   * @returns 
   */
  async real(stock_codes: StockCode[], prefix = false) {
    this.stock_list = this.gen_stock_list(stock_codes);
    return await this.get_stock_data(this.stock_list, prefix);
  }

  /**
   * 获取并格式化股票信息
   * @param stock_list 股票代码列表
   */
  async get_stock_data(stock_list: StockCode[], prefix: boolean) {
    const data = await this._fetch_stock_data(stock_list);
    return this.format_response_data(data, prefix);
  }

  /**
   * 获取股票信息
   * @param stock_list 股票代码列表
   */
  async _fetch_stock_data(stock_list: StockCode[]) {
    console.log('_fetch_stock_data', stock_list);
    
    const results = await Promise.all(stock_list.map((d) => {
      return limit(() => this.get_stocks_by_range(d));
    }));
    
    console.log('results:', results);
    return results;
  }

  async get_stocks_by_range(data: any) {
    return await axios.get(this.stock_api + (data.params || data.code)).then(res => {
      (res as any).stock = data;
      return res;
    });
  }

  format_response_data(data: any, prefix: boolean) {
    console.log('prefix', prefix);
    
    return data;
  }
}