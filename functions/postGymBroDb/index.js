const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses/index');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async function(event, context) {

    const post = JSON.parse(event.body);
    
    const timestamp = new Date().getTime();

    post.id = `${timestamp}-${Math.floor(Math.random() * 1000)}`;

    try {
        await db.put({
            TableName: 'gymBroDB',
            Item: post
        }).promise();

        return sendResponse(200, {success: true, message: post});
    } catch (error) {
        return sendResponse(500, {success: false, message: error.message});
    }

}