import app from './app';
// import routes from './routes';

// eslint-disable-next-line no-var
var http = require('http').createServer(app);
const io = require('socket.io')(http);

// app.listen(3000);

http.listen(3333);

io.on('connection', socket => {
  socket.on('novaEntrega', () => {
    io.emit('respostaNovaEntrega', 'funcionou');
  });

  socket.on('libVeiculo', () => {
    io.emit('respApontamento', 'funfou');
  });
});
