#!/usr/bin/env node

import { run, flush, handle } from '@oclif/core';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

run()
  .then(() => flush())
  .catch((error) => handle(error));