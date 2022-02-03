import BaseQuotation, { StockCode } from './basequotation';
import { get_stock_type } from './helpers';

export default class DayKline extends BaseQuotation {
  stock_api = '/gtimg/appstock/app/fqkline/get?_var=kline_dayqfq&param=';

  protected _gen_stock_prefix(stock_codes: StockCode[], day=100) {
    return stock_codes.map((stock_code: StockCode) => {
      const fullCode = get_stock_type(stock_code.code) + stock_code.code;
      stock_code.params = `${fullCode},day,,,${day},qfq`;
      return stock_code;
    });
  }

  format_response_data(results: any, prefix: any) {
    const objRes = results.map((res: any) => {
      const obj = JSON.parse(res.data.replace('kline_dayqfq=', ''));
      console.log('DayKline:format_response_data', obj);
      
      const keys = Object.keys(obj.data);
      if (keys.length > 0) {
        const item = obj.data[keys[0]];
        item.stock = res.stock;
        return item;
      }
      return null;
    });
    console.log('DayKline:format_response_data2', objRes);

    // const stock_dict = {};
    // for (let index = 0; index < rep_data.length; index++) {
    //   const item = rep_data[index];
      
    // }
    return objRes;
    //     for raw_quotation in rep_data:
    //         raw_stocks_detail = re.search(r"=(.*)", raw_quotation).group(1)
    //         stock_details = json.loads(raw_stocks_detail)
    //         for stock, value in stock_details["data"].items():
    //             stock_code = stock[2:]
    //             if "qfqday" in value:
    //                 stock_detail = value["qfqday"]
    //             else:
    //                 stock_detail = value.get("day")
    //             if stock_detail is None:
    //                 print("stock code data not find %s"%stock_code)
    //                 continue
    //             stock_dict[stock_code] = stock_detail
    //             break

    //     return stock_dict
    //   }
  }
}