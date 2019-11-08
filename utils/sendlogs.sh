#!/bin/bash

export AWS_DEFAULT_REGION=us-east-1

Mess="${1:-'Hello World!'}"
LogGroupName="YOUR_LOG_GROUP_NAME"
LogStreamName="sample-logs"
UploadSequenceToken=$(aws logs describe-log-streams --log-group-name "$LogGroupName" --query 'logStreams[?logStreamName==`'$LogStreamName'`].[uploadSequenceToken]' --output text)
echo $UploadSequenceToken

TimeStamp=`date -u "+%s000"`
TimeStamp=`expr $TimeStamp`
echo $TimeStamp
if [ "$UploadSequenceToken" != "None" ]
then
  aws logs put-log-events --log-group-name "$LogGroupName" --log-stream-name "$LogStreamName" --log-events timestamp=$TimeStamp,message="$Mess" --sequence-token $UploadSequenceToken
else
  # An upload in a newly created log stream does not require a sequence token.
  aws logs put-log-events --log-group-name "$LogGroupName" --log-stream-name "$LogStreamName" --log-events timestamp=$TimeStamp,message="$Mess"
fi