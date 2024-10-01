const { nanoid } = require('nanoid');
const { sendResponse } = require('../../responses/index');
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

async function createAccount( userId, username, hashedPassword, firstname, lastname, email, isAdmin) {

    try {
        await db.put({
            TableName: 'accountsGymBroDB',
            Item: {
                userId : userId,
                username : username,
                password: hashedPassword,
                firstname: firstname,
                lastname : lastname,
                email : email,
                isAdmin : isAdmin
            }
        }).promise();

        return {success: true, message: 'Account createdd successfully', userId: userId};
    } catch (error) {
        console.log('Error creating account', error);
        return {success: false, message: 'Account creation failed', error: error.message};
    }
    
}

async function signUp(username, password, firstname, lastname, email, isAdmin) {

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = nanoid();

    const result = await createAccount(userId, username, hashedPassword, firstname, lastname, email, isAdmin); 
    return result; 
}

exports.handler = async (event) => {
    const { username, password, firstname, lastname, email, isAdmin } = JSON.parse(event.body);

    const result = await signUp(username, password, firstname, lastname, email, isAdmin);

    if (result.success) 
        return sendResponse(200, result);
    else
        return sendResponse(400, result);
};