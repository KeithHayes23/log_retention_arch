import cdk = require('@aws-cdk/core');
import lambda = require("@aws-cdk/aws-lambda");
import events = require('@aws-cdk/aws-events');
import targets = require('@aws-cdk/aws-events-targets');
import sfn = require('@aws-cdk/aws-stepfunctions');
import sfn_tasks = require('@aws-cdk/aws-stepfunctions-tasks');
import iam = require('@aws-cdk/aws-iam');

export class GreenConstruct extends cdk.Construct{
    constructor(parent: cdk.Construct, id: string, props:any) {
        super(parent, id);

        /** IAM Policy for Retention Lambda Role */
    const lr_policy = new iam.PolicyStatement({
        resources: ['*'],
        actions: [
            "logs:DescribeLogGroups", 
            "logs:CreateLogGroup",
            "logs:PutLogEvents",
            "logs:CreateExportTask",
            "logs:DescribeExportTasks",
            "logs:CreateLogStream",
            "s3:ListBucketByTags",
            "s3:ListAllMyBuckets",
            "s3:PutBucketPolicy",
            "s3:HeadBucket",
            "s3:ListBucket",
            "s3:GetBucketAcl",
            "s3:GetBucketPolicy",
        ] 
      });
      
      /** Log Rentention Lambda Function */
      const lr_function = new lambda.Function(this, 'LogRetentionLambda', {
        runtime: lambda.Runtime.NODEJS_10_X,
        code: lambda.Code.asset('lambda/log_retention'),
        handler: 'index.handler',
        environment: {
          S3_BUCKET_NAME: props.s3_bucket_name
        }
      })
      
      /** Attach the policy statement to the lambda functions execution role. */
      lr_function.addToRolePolicy(lr_policy);
  
      /** Step Function State Machine */
      const createExportTask = new sfn.Task(this, 'CreateExportTask', {
        task: new sfn_tasks.InvokeFunction(lr_function),
      });

      /** Create the states and chain them togather */
      const isAllLogsExported = new sfn.Choice(this, 'IsAllLogsExported');
      const successState = new sfn.Succeed(this, 'SuccessState');
      const chain = sfn.Chain
              .start(createExportTask)
              .next(isAllLogsExported
                .when(sfn.Condition.booleanEquals('$.continue', true), createExportTask)
                .otherwise(successState)
              );
              
      /* Create a new State Machine */
      const stateMachine = new sfn.StateMachine(this, 'LogRetentionStateMachine', {
        definition: chain
      });
  
      /** Log Retention Schedule */
      const lr_event_rule = new events.Rule(this, 'LogRetentionSchedule', {
        schedule: events.Schedule.expression('cron(0 10 * * ? *)'),
      });
  
      /** Configuration Input Sent to the State Machine */
      const lr_target_object = {
        "region":props.s3_bucket_region,
        "logGroupFilter":"prod",
        "s3BucketName":props.s3_bucket_name,
        "logFolderName":"cloudwatch"
      };
      
       /** Add the lambda function as the target to the rule */
      lr_event_rule.addTarget(new targets.SfnStateMachine(stateMachine, {
        input: events.RuleTargetInput.fromObject(lr_target_object)
      }));
    };
};