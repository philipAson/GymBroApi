const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendResponse } = require('../../responses/index');

async function getUser(email) {

    try {
        const user = await db.get({
            TableName: 'accountsGymBroDB',
            Key: {
                email: email
            }
        }).promise();

        if (user.Item) 
            return user.Item
        else 
            return false
        
    } catch (error) {
        console.log('Error getting user', error);
        return false;
    }
}

async function login(email, password) {
    const user = await getUser(email);  

    if (!user) 
        return {success: false, message: 'Incorrect email or password'};

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) 
        return {success: false, message: 'Incorrect email or password'};

    // Put secret in a difrent file and .gitIgnore that file and change the secret in middleware/auth.js
    const token = jwt.sign({email: user.email, userId: user.userId}, 'secret', {expiresIn: 3600000});

    return {success: true, message: 'Login successful', token: token};
}

exports.handler = async (event) => {

    const { email, password } = JSON.parse(event.body);

    const result = await login(email, password);

    return sendResponse(result.success ? 200 : 400, result);
}