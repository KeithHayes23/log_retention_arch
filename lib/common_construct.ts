import cdk = require('@aws-cdk/core');
import lambda = require("@aws-cdk/aws-lambda");
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');

export class CommonConstruct extends cdk.Construct{
    constructor(parent: cdk.Construct, id: string, props:any) {
        super(parent, id);
        
        
        /** S3 Bucket for archiving logs with encryption, and a lifecycle policy */
        const bucket = new s3.Bucket(this, props.log_bucket_name, {
            encryption: s3.BucketEncryption.KMS_MANAGED,
            bucketName: props.log_bucket_name,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            publicReadAccess: false,
            lifecycleRules: [{
                expiration: cdk.Duration.days(365),
                transitions: [{
                    storageClass: s3.StorageClass.GLACIER,
                    transitionAfter: cdk.Duration.days(90)
                }]
            }]
        });
        
        
         /** S3 Bucket Policy */
        const accessStatement1 = new iam.PolicyStatement({
            resources: ["arn:aws:s3:::"+ bucket.bucketName],
            actions: ["s3:GetBucketAcl"]
        });
        accessStatement1.addServicePrincipal('logs.us-east-1.amazonaws.com');
    
        const accessStatement2 = new iam.PolicyStatement({
            resources: ["arn:aws:s3:::"+ bucket.bucketName+"/*"],
            actions: ["s3:PutObject"],
            conditions: {
            'StringEquals':{
                "s3:x-amz-acl": "bucket-owner-full-control"
            }
            }
        });
        
        /** Setup the bucket policy */
        accessStatement2.addServicePrincipal('logs.us-east-1.amazonaws.com');
        bucket.addToResourcePolicy(accessStatement1);
        bucket.addToResourcePolicy(accessStatement2);
        
        //bucket.grantWrite(lr_function);
    };
};