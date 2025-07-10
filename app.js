const http = require('http');
const port = 80;
const server = http.createServer((req, res) => {
  res.end("Hello from ECS Fargate!\n");
});
server.listen(port);
