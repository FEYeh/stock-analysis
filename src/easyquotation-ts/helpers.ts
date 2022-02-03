import axios from 'axios';

const handle_stock_codes = (codeString: string) => {
  const text: string = codeString || '';
  const reg = /~([a-z0-9]*)`([a-z\u4e00-\u9fa5]*)`/ig;
  const matches = [...text.matchAll(reg)];
  const codes = matches.map(match => {
    return {
      code: match[1],
      name: match[2],
    };
  });
  return codes;
};

/**
 * 从接口获取所有股票
 */
export const get_stock_codes_from_net = async () => {
  const url = '/shdjt/js/lib/astock.js';
  const res = await axios.request({ url });
  return handle_stock_codes(res.data);
};

/**
 * 从本地文件获取所有股票
 */
export const get_stock_codes_from_file= async () => {
  const res = await import('./stockcodes');
  return handle_stock_codes(res.default);
};

/**
 * 获取所有股票
 * @param realtime true-实时获取,false-读取本地文件内容
 */
export const get_stock_codes = async (realtime = false) => {
  if (realtime) return await get_stock_codes_from_net();
  return get_stock_codes_from_file();
};

/**
 * 判断股票ID对应的证券市场
 * 匹配规则
 *  ['50', '51', '60', '90', '110'] 为 sh
 *  ['00', '13', '18', '15', '16', '18', '20', '30', '39', '115'] 为 sz
 *  ['5', '6', '9'] 开头的为 sh， 其余为 sz
 *  若以 'sz', 'sh' 开头直接返回对应类型，否则使用内置规则判断
 * @param stock_code 股票代码
 * @returns 加了前缀的股票代码
 */
export const get_stock_type = (stock_code: string) => {
  const sh_head = ['50', '51', '60', '90', '110', '113', '118', '132', '204', '5', '6', '9', '7'];
  const prefix = ['sg', 'sz', 'zz'];
  const isPrefixExisted = prefix.some(type => stock_code.startsWith(type));
  if (isPrefixExisted) {
    return '';
  }
  const isStartsWithSh = sh_head.some(type => stock_code.startsWith(type));
  if (isStartsWithSh) {
    return 'sh';
  }
  return 'sz';
};