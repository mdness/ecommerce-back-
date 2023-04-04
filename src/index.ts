import os from 'os';
import cluster from 'cluster';
import Config from 'config';
import Server from 'services/server';
import { logger } from 'services/logger';

const PORT = Config.PORT || 8080;
const numCPUs = os.cpus().length;

if (Config.MODE === 'cluster' && cluster.isMaster) {
  logger.info(`CPUs Number ==> ${numCPUs}`);
  logger.info(`PID MASTER ${process.pid}, ${new Date()}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', worker => {
    logger.warn(`Worker ${worker.process.pid} died at ${Date()}`);
    cluster.fork();
  });
} else {
  Server.listen(PORT, () => {
    logger.info(
      `Server initialized in http://localhost:${PORT} - PID WORKER ${process.pid}`,
    );
  });
  Server.on('error', error => logger.info(`Server error: ${error}`));
}
