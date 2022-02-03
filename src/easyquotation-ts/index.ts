import BaseQuotation from "./basequotation";
import DayKline from "./daykline";

export enum ApiType {
  DAY_KLINE = 'daykline',
}

class QuotationFactory {
  public static createQuotation(apiType: ApiType): BaseQuotation {

    try {
      if (apiType === ApiType.DAY_KLINE) {
        return new DayKline({});
      }
    } catch (e) {
      console.error('Create failed!');
    }

    return new BaseQuotation({});
  }
}

export default QuotationFactory;