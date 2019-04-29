module.exports = function(io){

  let users = {};
  let rooms = {};

  io.on('connection', function (socket) {

    // Registrar usuário
    users[socket.id] = {id: socket.id};

    /**
     * Mensagem de boas-vindas
     */
    socket.emit('sm', { // SM: System Message      
      body: 'Bem-vindo(a)!'
    })

    /**
     * join-request: Solicitação de entrada em sala
     * 
     * addr Endereço da sala
     */
    socket.on('join-request', function (payload) {
      rooms[payload.addr] = {addr: payload.addr};
      socket.currentRoom = payload.addr;

      // Atualizar dados do usuário
      setUserData(socket.id, payload.user);

      // Entrar
      socket.join(payload.addr);
      socket.emit('join-accepted', { addr: payload.addr });

      // Notificar demais participantes
      socket.to(roomId).emit('sm',{body: users[socket.id].user.username + ' entrou da sala'});
      io.in(socket.currentRoom).emit('users', getUsers(socket.currentRoom));
    });

    /**
     * um: Mensagem gerada por usuário
     * 
     * sender
     * room
     * body
     */
    socket.on('um', function (payload) {
      let responsePayload = Object.assign(payload, {
        socket: socket.id
      });

      socket.to(payload.room).emit('um', responsePayload);
      socket.emit('um', responsePayload);
    });

    /**
     * userData: Dados de usuário
     * 
     * user
     */
    socket.on('userData', function (payload) {
      setUserData(socket.id, payload.user);
    });

     /**
     * users: Usuários conectados
     * 
     * user
     */
    socket.on('users', function (payload) {
      //socket.emit('users', getUsers(socket.currentRoom));
    });

    /**
     * Notifica salas de que usuário saiu
     */
    socket.on('disconnecting', function(){
      for (roomId in socket.rooms){
        if(roomId == socket.id){continue;}

          let allUsers = getUsers(socket.currentRoom);
          let remainingUsers = allUsers.filter((user) => user.id != socket.id);

          socket.to(roomId).emit('sm',{body: users[socket.id].user.username + ' saiu da sala'});
          io.in(socket.currentRoom).emit('users', remainingUsers);

      }
    });

    /**
     * Limpa variáveis ao desconectar
     */
    socket.on('disconnected', function () {
      delete users[socket.id];
    });

    function setUserData(socketId, userData){
      users[socketId].user = userData;
    }
    
    function getUsers(room){      
      return Object.keys(socket.adapter.rooms[room].sockets).map((socketId) => users[socketId] );
    }

  });

}