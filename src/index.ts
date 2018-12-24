/*
 * @Author: gzq
 * @Date: 2018-12-20 11:12:29
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-20 15:38:33
 */

import { Middleware } from 'koa';
import * as log4js from 'log4js';
import { getLogger } from './middleware';

declare module 'koa' {
  // tslint:disable-next-line:interface-name
  interface Context {
    log: log4js.Logger;
  }
}

export interface IOption {
  /** 项目名称 */
  name: string;
  /** 文件配置 */
  file: Partial<log4js.FileAppender>;
  /** 输出layout */
  layout: Partial<log4js.Layout>;
  /** 模式 */
  mode: 'debug' | 'default';
  /** 格式 */
  format: string;
  /** 正则url */
  nolog: RegExp | string;
}

function getLog(option: Partial<IOption>) {
  /** 默认配置 */
  const opt: Partial<IOption> = Object.assign(
    {
      format: '{status} {method} {url} ({request.ip}) {responseTime}ms',
      mode: 'default',
      name: 'app',
    } as IOption,
    option,
  );
  opt.layout = Object.assign(
    {
      pattern: '%d %p %m',
      type: 'pattern',
    } as log4js.Layout,
    option.layout,
  );
  opt.file = Object.assign(
    {
      filename: `/var/log/${opt.name}.log`,
      layout: opt.layout,
      type: 'file',
    } as log4js.FileAppender,
    option.file,
  );
  log4js.configure({
    appenders: {
      req: opt.file as log4js.FileAppender,
      stdout: {
        // 控制台输出
        layout: opt.layout,
        type: 'stdout',
      },
    },
    categories: {
      debug: { appenders: ['stdout', 'req'], level: 'debug' },
      default: { appenders: ['req'], level: 'info' },
    },
  });
  return opt;
}

export function koaLog(option: Partial<IOption> = {}): Middleware {
  const opt = getLog(option);
  return getLogger(log4js.getLogger(opt.mode), {
    format: opt.format,
    nolog: opt.nolog,
  });
}
