# **@tdqs/koa-log4js**

The MIT License (MIT)

@tdqs/koa-log4js koa middleware.

### Table of Contents

**[Installation](#installation)**  
**[API documentation](#api-documentation)**  
**[Example](#example)**

## **Installation**

```
    $ npm install @tdqs/koa-log4js
```

## **API documentation**

#### Getting Started

```ts
import * as Koa from 'koa';
import { resolve } from 'path';
import { koaLog } from '@tdqs/koa-log4js';

const app = new Koa();

app.use(koaLog({ mode: 'debug' })).listen(8080);

// default path /var/log/app.log
```

#### Options

```ts
export interface IOption {
  /** project name */
  name: string;
  /** FileAppender */
  file: Partial<log4js.FileAppender>;
  /** Layout */
  layout: Partial<log4js.Layout>;
  /** mode */
  mode: 'debug' | 'default';
  /** format */
  format: string;
  /** regexp url */
  nolog: RegExp | string;
}
```

## **Example**

Following example could be found inside `/tests` directory.
