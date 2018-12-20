/*
 * @Author: gzq
 * @Date: 2018-12-20 13:54:21
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-20 15:02:15
 */

import { Middleware } from 'koa';
import { levels, Logger } from 'log4js';

declare module 'koa' {
  // tslint:disable-next-line:interface-name
  interface Context {
    log: Logger;
  }
}

function createNoLogCondition(nolog: RegExp | string) {
  let regexp: RegExp;

  if (nolog) {
    if (nolog instanceof RegExp) {
      regexp = nolog;
    }

    if (typeof nolog === 'string') {
      regexp = new RegExp(nolog);
    }
  }
  return regexp;
}

export function getLogger(
  logger: Logger,
  options: { format?: string; nolog?: RegExp | string },
): Middleware {
  const nolog = options.nolog ? createNoLogCondition(options.nolog) : undefined;

  return (ctx, next) => {
    if (ctx.log || (nolog && nolog.test(ctx.url))) {
      return next();
    }

    const start = new Date().getTime();
    ctx.log = logger;

    // hook on end request to emit the log entry of the HTTP request.
    ctx.res.on('finish', () => {
      ctx.responseTime = new Date().getTime() - start;
      // status code response level handling
      const level =
        ctx.status >= 500
          ? levels.ERROR
          : ctx.status >= 400
          ? levels.WARN
          : levels.INFO;

      logger.log(
        level,
        options.format.replace(/\{([^\}]+)\}/g, (_, field: string) => {
          let res: any = ctx;
          field.split('.').map(o => {
            res = res[o];
          });
          return res;
        }),
      );
    });

    // ensure next gets always called
    return next();
  };
}
