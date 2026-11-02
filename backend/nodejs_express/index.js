
const http = require('http');
const app = require('./server');
const cors = require('cors');

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

// Configuración CORS
app.use(cors({
  origin: [
     'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With'
  ]
}));

// Manejar solicitudes preflight
app.options('*', cors());

app.set('port', port);

const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Accesible en la red local en http://${getLocalIp()}:${port}`);
});

// Obtener IP local
function getLocalIp() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return 'localhost';
}
