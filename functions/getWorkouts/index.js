const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require('../../responses/index');
const middy = require('@middy/core');
const {validateToken} = require('../../middleware/auth');

const getWorkouts = async (event, context) => {
    if (event?.error && event.error === '401')
        return sendResponse(401, {success: false, message: 'Unauthorized'});

    const userId = event.id;

    let params = {
        TableName: 'gymBroDB',
        FilterExpression: 'userId = :userId',
        // KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };

    try {
        // const {Items} = await db.query(params).promise(); ?????????
        const {Items} = await db.scan(params).promise();
        if (!Items) {
            return sendResponse(404, {success: false, message: 'Error getting workouts'});
        }
        return sendResponse(200, {success: true, workouts: Items});
    } catch (error) {
        console.log('Error getting workouts', error);
        return sendResponse(500, {success: false, message: error.message});
    }
}

const handler = middy(getWorkouts)
        .use(validateToken)  

module.exports = { handler };