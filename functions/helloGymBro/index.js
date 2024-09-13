const { sendResponse } = require('../../responses/index');

var message = "Hello Gym Bro!";

exports.handler = async function(event, context) {    
    return sendResponse(200, message);
}