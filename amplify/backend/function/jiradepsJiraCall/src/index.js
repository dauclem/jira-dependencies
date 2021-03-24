const request = require("request");

function downloadPage(options) {
    return new Promise((resolve, reject) => {
        
        request(options, function (error, response, body) {
            if (error) {
                throw new Error(error);
            }

            resolve(body);
        });
    });
}

exports.handler = async (event) => {
    const options = {
        method: 'GET',
        url: `${event.arguments.url}?fields=key&maxResults=5000`, 
        auth: { username: event.arguments.user, password: event.arguments.password },
        headers: {
        'Accept': 'application/json'
        }
    };
  
    return await downloadPage(options);
};
