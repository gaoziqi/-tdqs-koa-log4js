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
  .listen(8080);
