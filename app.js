// app.js
const http = require('http');
const port = 80;

const server = http.createServer((req, res) => {
  res.end("Hello from ECS Fargate!\n");
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
