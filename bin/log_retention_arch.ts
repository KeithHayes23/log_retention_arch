#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { LogRetentionArchStack } from '../lib/log_retention_arch-stack';

const app = new cdk.App();
new LogRetentionArchStack(app, 'LogRetentionArchStack');
