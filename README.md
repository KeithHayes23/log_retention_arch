## About

This is the repo for a step by step tutorial I wrote on automated log management within Amazon Web Services (AWS).
It uses the Amazon Web Services Cloud Development Kit (CDK) to build out the infrastructure.

Of course you will need an AWS account with command line tools installed and the CDK.

Check out the [getting started guide](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) to get started.

Here is the link to the blog tutorial. [AWS Automated Log Management](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

Here is what we are going to build.

<img src="assets/arch.png" width="600">


# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk destroy`     destroys the stack except for the s3 bucket