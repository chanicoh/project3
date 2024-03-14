/* Software that accepts requests from appropriate 
client applications to access and change information in its database*/
class Server{
    constructor(){
        this.db =new DataBase();

    }

    receiveRequest(request,usersData,data=null){
        if(request=== "GETALL"){
            return this.getAll();
        }
        else if(request=== "GET"){
            return this.get(usersData);
        }
        else if(request=== "POST"){
            return this.post(usersData,data);
        }
        else if(request=== "PUT"){
            return this.put(usersData,data);
        }
        else if(request=== "DELETE"){
            return this.del(usersData);
        }
        else{
            alert("wrong request : "+ request)
            return false;
        }  
    }

    get(usersData) {
        return this.db.get(usersData);
    }
    getAll() {
        return this.db.getAll();
    }
    post(usersData, data) {
        this.db.post(usersData, data);
    }
    put(usersData, data) {
        this.db.put(usersData, data);
    }
    del(usersData) {
        this.db.deletee(usersData);
    }     
}