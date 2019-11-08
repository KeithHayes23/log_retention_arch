import cdk = require('@aws-cdk/core');
import lambda = require("@aws-cdk/aws-lambda");
import iam = require('@aws-cdk/aws-iam');
import events = require('@aws-cdk/aws-events');
import targets = require('@aws-cdk/aws-events-targets');

export class BlueConstruct extends cdk.Construct{
    constructor(parent: cdk.Construct, id: string) {
        super(parent, id);

        /** IAM Policy for the Trigger Lambda Role */
        const lt_policy = new iam.PolicyStatement({
            resources: ['*'],
            actions: [
            "logs:CreateLogStream",
            "logs:PutRetentionPolicy",
            "logs:CreateLogGroup",
            "logs:PutLogEvents"
            ] 
        });
    
        /** Trigger Lambda Function */
        const lt_function = new lambda.Function(this, 'LogTriggerLambda', {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.asset('lambda/log_trigger'),
            handler: 'index.handler'
        })
    
        /** Attach the policy statement to the lambda functions execution role. */
        lt_function.addToRolePolicy(lt_policy);
    
        /** Trigger Event Pattern to filter the creation of log groups */
        const ep = {
            "source": [
            "aws.logs"
            ],
            "detail-type": [
            "AWS API Call via CloudTrail"
            ],
            "detail": {
            "eventSource": [
                "logs.amazonaws.com"
            ],
            "eventName": [
                "CreateLogGroup"
            ]
            }
        };
    
        /** Trigger Cloudwatch Event Rule */
        /** Adds the event pattern to the rule */
        const lt_event_rule = new events.Rule(this, 'LogTriggerEvent', {
            enabled: true,
            eventPattern: ep
        })

        /** Add the lambda function as the target to the rule */
        lt_event_rule.addTarget(new targets.LambdaFunction(lt_function));
    };
};