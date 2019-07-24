'use strict';

const clearMessages = () => {
    messages.className = '';
    messages.innerHTML = '';
}
const showMessages = (type, msg) => {
    messages.className = 'alert alert-' + type;
    messages.innerHTML = msg;
}
