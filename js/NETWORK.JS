/*A component used to send messages from the client to
 the server and return responses from the server to the client*/
class Network {
    constructor() {
        this.server=new Server();
    }
    /*The network "receives" messages to be forwarded from the client 
    to the server, and similarly also responses from the server to the client.
    The network "delivers" the messages to the appropriate recipient (server or client)*/
    sendRequest(request, usersData, data) {
      let server = this.server;
      let result = server.receiveRequest(request, usersData, data);//When the server finishes handling the request - the server "returns" a response to the client through the communication network
      console.log("network result"+"  "+result);
      if (result != null) {
        return result;
      }
    }
  }