import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import Config from 'config';
import cors from 'cors';
import path from 'path';
import * as http from 'http';
import routes from 'routes';
import { unknownEndpoint } from 'middlewares/unknownEndpoint';
import { errorHandler } from 'middlewares/errorHandler';
import { clientPromise } from 'services/mongodb';
import passport from 'middlewares/auth';
import fileUpload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express';
import docs from 'docs';
import { initWsServer } from './socket';

const app: express.Application = express();

export const sessionMiddleware = session({
  secret: Config.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  rolling: true,
  store: MongoStore.create({
    clientPromise: clientPromise(),
    stringify: false,
    autoRemove: 'interval',
    autoRemoveInterval: 1,
  }),
  cookie: {
    maxAge: Config.SESSION_COOKIE_TIMEOUT_MIN * 1000 * 60,
    httpOnly: false,
  },
});

app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');

app.get('/api/chat', (req, res) => {
  res.render('index');
});

app.use(express.static('public'));
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
);

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

app.use(errorHandler);
app.use(unknownEndpoint);

const Server: http.Server = http.createServer(app);
initWsServer(Server);

export default Server;
