/*The mechanism for simulating the communication between 
the client and the server and handling the responses returned from the server*/
class FXMLHttpRequest{

  constructor(){
      this.request=null;
      this.data=null;
      this.network=new Network();//The client "sends" the request to the server through the communication network
      this.response=null;
  }

  create_request(request,data=null){
      this.request=request;
      this.data=data;
  }

  send(callback=null){
      setTimeout(()=>{          
          console.log("type of callback "+typeof(mycallback))
          this.response= this.network.sendRequest(this.request,this.data);
          // callbak
          if (callback==DisplayList){
              try
              {
                  JSON.parse(this.response);
                  callback(JSON.parse(this.response));
              }
              catch(error){
                  callback(this.response);
              }
          }else if (callback==RemoveTemplate){
              callback()
          }
          
              

      },1000)
  }
  
  getResponse(){
      
      return this.response;
  }
}