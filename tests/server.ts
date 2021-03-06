import * as Koa from 'koa';
import { resolve } from 'path';
import { koaLog } from '../src/index';

const app = new Koa();

app
  .use(
    koaLog({
      file: {
        filename: resolve(__dirname, 'app.log'),
      },
    }),
  )
  .use(ctx => {
    ctx.log.info(`${ctx.path}`);
  })
  .listen(8080);
