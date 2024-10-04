const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const { nanoid } = require('nanoid');
const { sendResponse } = require('../../responses/index');

async function createExercise(userId, exerciseId, exerciseName, sets, reps, weight, date) {
    try {
        await db.put({
            TableName: 'gymBroDB',
            Item: {
                userId: userId,
                id: exerciseId,
                exerciseName: exerciseName,
                sets: sets,
                reps: reps,
                weight: weight,
                date: date
            }
        }).promise();

        return {success: true, message: 'Exercise added successfully', exerciseId: exerciseId};
    } catch (error) {
        console.log('Error adding exercise', error);
        return {success: false, message: 'Exercise addition failed', error: error.message};
    }
}

async function addExercise(userId, exerciseName, sets, reps, weight, date) {
    const exerciseId = nanoid();
    const result = await createExercise(userId, exerciseId, exerciseName, sets, reps, weight, date);
    return result;
    
}

exports.handler = async (event) => {
   
    const { userId, exerciseName, sets, reps, weight, date } = JSON.parse(event.body);

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
    const result = await addExercise(userId, exerciseName, sets, reps, weight, date);

    if (result.success) 
        return sendResponse(200, result);
    else
        return sendResponse(400, result);

}