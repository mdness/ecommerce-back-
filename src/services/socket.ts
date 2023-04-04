/* eslint-disable @typescript-eslint/no-explicit-any */
import * as socketio from 'socket.io';
import * as http from 'http';
import { messagesAPI } from 'api/messages';
import { userAPI } from 'api/user';
import { logger } from './logger';
import { getSystemResponse } from 'utils/others';
import passport from 'middlewares/auth';
import { sessionMiddleware } from './server';

export const initWsServer = (server: http.Server): void => {
  const io: socketio.Server = new socketio.Server();
  io.attach(server);

  // Middleware Wrapper
  const wrap = (middleware: any) => (socket: socketio.Socket, next: any) =>
    middleware(socket.request, {}, next);

  // Middlewares to pass user information and the current session details to socket.request
  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  // Check if a logged-in user exists. If not return Error
  io.use((socket: any, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', async (socket: socketio.Socket) => {
    logger.info('New connection');

    socket.on('get messages', async (userEmail: string) => {
      try {
        const user = await userAPI.query(userEmail);
        const userMessages = await messagesAPI.get(user.id);
        socket.emit('messages', userMessages);
      } catch (e) {
        socket.emit('messages error', {
          error: e.error,
          message: e.message,
        });
      }
    });

    socket.on('new message', async newMessage => {
      try {
        const user = await userAPI.query(newMessage.email);
        await messagesAPI.save(user.id, newMessage.text, 'user');

        const response = await getSystemResponse(newMessage.text, user.id);
        await messagesAPI.save(user.id, response, 'system');

        const messagesList = await messagesAPI.get(user.id);
        socket.emit('new message saved', messagesList);
      } catch (e) {
        socket.emit('messages error', {
          error: e.error,
          message: e.message,
        });
      }
    });
  });
};
