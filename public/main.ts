// import express from 'express';
// import path from 'path';
// import * as io from 'socket.io';

// const app = express();
// const PORT = 5555;

// const server = app.listen(PORT, () => {
//   console.log(`App running on port ${PORT}`);
// });

// const SocketIO = io.listen(server);

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.render('index');
// });

// SocketIO.on('connection', socket => {
//   console.log('a user connected');
//   socket.on('chatter', message => {
//     console.log('chatter : ', message);
//     SocketIO.emit('chatter', message);
//   });
// });
