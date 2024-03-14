const dbLocal = require("db-local");
const { Schema } = new dbLocal({ path: "./databases" });

export const Users = Schema("Users", {
    id: { type: String, required: true },
    name: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true }
});

export const Todos = Schema("Todos", {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true},
    status: { type: String, required: true}
});


