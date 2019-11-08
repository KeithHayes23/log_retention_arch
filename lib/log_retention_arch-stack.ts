import cdk = require('@aws-cdk/core');
import { BlueConstruct } from './blue_construct';
import { GreenConstruct } from './green_construct';
import { CommonConstruct } from './common_construct';

export class LogRetentionArchStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const LOG_ARCHIVE_BUCKET_NAME = 'jackfish-log-archive';
    const LOG_ARCHIVE_BUCKET_REGION = 'us-east-1';

    new BlueConstruct(this, 'BlueConstruct');
    new GreenConstruct(this, 'GreenConstruct', {
      s3_bucket_name: LOG_ARCHIVE_BUCKET_NAME,
      s3_bucket_region: LOG_ARCHIVE_BUCKET_REGION
    });
    new CommonConstruct(this, 'CommonConstruct', {
      log_bucket_name: LOG_ARCHIVE_BUCKET_NAME
    });
  }
}