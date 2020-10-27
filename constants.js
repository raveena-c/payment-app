private_api_key=process.env.private_key;
var headers = {
    'Authorization': private_api_key,
    'Simulator': 'EXTERNAL',
    'Content-Type': 'application/json'
}
module.exports.headers = headers;