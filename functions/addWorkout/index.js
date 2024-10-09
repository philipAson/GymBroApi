const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const { nanoid } = require('nanoid');
const { sendResponse } = require('../../responses/index');

async function createWorkout(userId, workoutId, workoutName, exercises, date) {
    try {
        await db.put({
            TableName: 'gymBroDB',
            Item: {
                userId: userId,
                id: workoutId,
                workoutName: workoutName,
                exercises: exercises,
                date: date
            }
        }).promise();

        return {success: true, message: 'Workout added successfully', workoutId: workoutId};
    } catch (error) {
        console.log('Error adding workout', error);
        return {success: false, message: 'Workout addition failed', error: error.message};
    }
}

async function addWorkout(userId, workoutName, exercises, date) {
    const workoutId = nanoid();
    const result = await createWorkout(userId, workoutId, workoutName, exercises, date);
    return result;
    
}

exports.handler = async (event) => {

    const { userId, workoutName, exercises, date } = JSON.parse(event.body);

    try {
        await db.scan({
        TableName: 'accountsGymBroDB',
        Key: {
            userId: userId
        }
    }).promise();

} catch (error) {
    console.log('Error getting user', error);
    return sendResponse(400, {success: false, message: 'User not found'});
}
    const result = await addWorkout(userId, workoutName, exercises, date);

    if (result.success) 
        return sendResponse(200, result);
    else
        return sendResponse(400, result);

}