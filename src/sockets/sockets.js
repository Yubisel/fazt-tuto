module.exports = function (io) {
    // intervalId = setInterval(() => {
    //     io.sockets.emit('new message', '<em>mensaje del servidor</em>');
    // }, 3000);

    io.on('connection', socket => {
        console.log('new connection');

        
    });
};