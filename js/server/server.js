// --------db--------------------
const db = require("../db/db");
const { v4 } = require("uuid");
// db.Users.create({
//   id: v4(),
//   name: { type: String },
//   password: { type: String, required: true },
//   email: { type: String, required: true },
// }).save();



db.Users.create({
  id: v4(),
  name: "chen",
  password: "chen1234" ,
  email: "chen@email.com" ,
}).save();








class Request {
  headers = {};
  params = {};
  body = {};
}

class Response {
  status = 200;
  headers = {};
  body = {};
}

class Server {
  // [path]: { [method]: handler function}
  routes = {};

  /**
   *
   * @param {string} path
   * @param {(req: Request, res: Response) => { }} handler
   */
  get(path, handler) {}

  /**
   *
   * @param {string} path
   * @param {(req: Request, res: Response) => { }} handler
   */
  post(path, handler) {}

  /**
   *
   * @param {string} path
   * @param {(req: Request, res: Response) => { }} handler
   */
  put(path, handler) {}

  /**
   *
   * @param {string} path
   * @param {(req, res) => any | Promise<any>} handler
   */
  delete(path, handler) {}
}

const server = new Server();

// GET /users
server.get("/users", (req, res) => {
  db.Users.find();
});
