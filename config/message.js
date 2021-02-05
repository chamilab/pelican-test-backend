function get(message) {
    return `${message} Successfully Recieved`;
}

function failGet(message) {
    return `${message} Recieving Failed`;
}
module.exports = {
    get,
    failGet,

};