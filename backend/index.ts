import http from 'http';
import stoppable from 'stoppable';

import app from './app';

function getServerPort(): string | number | false {
  const value = process.env.PORT;

  if (!value) {
    return false;
  }

  const port = parseInt(value, 10);

  if (Number.isNaN(port)) {
    return value;
  }
  if (port >= 0) {
    return port;
  }

  return false;
}

const port = getServerPort();

app.set('port', port);

const server = stoppable(http.createServer(app));

server.on('error', (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Requires elevated privileges to run server!`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`Port ${error.port} is already in use!`);
      process.exit(1);
    default:
      throw error;
  }
});

server.on('listening', () => {
  console.info(`Server is listening on ${port}`);
});

process.on('SIGINT', () => {
  server.stop();
  process.exit();
});
process.on('SIGTERM', () => {
  server.stop();
  process.exit();
});

server.listen(port);
