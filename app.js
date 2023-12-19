const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "todoApplication.db");

db = null;

const instalazation = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server is running on http://localhost:3000/covid-19/");
    });
  } catch (e) {
    console.log(`error ${e.message}`);
    process.exit(1);
  }
};

instalazation();

const hasPriorityAndSatus = (obj) => {
  return obj.priority !== undefined && obj.status !== undefined;
};

const hasPriority = (obj) => {
  return obj.priority !== undefined;
};
const hasStatus = (obj) => {
  return obj.status !== undefined;
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let API1Q = "";
  const { search_q = "", priority, status } = request.query;
  switch (true) {
    case hasPriorityAndSatus(request.query):
      API1Q = `
          SELECT * FROM 
          todo
          WHERE 
          todo LIKE '%${search_q}%'
          AND priority = '${priority}'
          AND status = '${status}'
          `;
      break;
    case hasPriority(request.query):
      API1Q = `
          SELECT * FROM 
          todo
          WHERE 
          todo LIKE '%${search_q}%'
          AND priority = '${priority}'
          
          `;
      break;

    case hasStatus(request.query):
      API1Q = `
          SELECT * FROM 
          todo
          WHERE 
          todo LIKE '%${search_q}%'
          
          AND status = '${status}'
          `;
      break;

    default:
      API1Q = `
          SELECT * FROM 
          todo
          WHERE 
          todo LIKE '%${search_q}%'
          
          `;
  }

  data = await db.all(API1Q);
  response.send(data);
});

module.exports = app;

/// API 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todo = await db.get(getBookQuery);
  response.send(todo);
});

/// API 3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const API3Q = `
    INSERT INTO 
    todo (id,todo,priority,status)
    VALUES(${id},'${todo}','${priority}','${status}')
    

    `;
  await db.run(API3Q);
  response.send("Todo Successfully Added");
});

/// API 4

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updatedC = "";
  const body1 = request.body;
  switch (true) {
    case body1.status !== undefined:
      updatedC = "status";

      break;

    case body1.priority !== undefined:
      updatedC = "priority";

      break;
    case body1.todo !== undefined:
      updatedC = "todo";

      break;
  }

  const prevousQ = `
  SELECT * FROM WHERE id = ${todoId}
  `;
  const previousTodo = await db.get(prevousQ);

  const {
    todo = previousTodo.todo,
    priority = previousTodo.priority,
    status = previousTodo.status,
  } = request.body;

  const API4Q = `
  UPDATE todo
  SET 
  todo = '${todo}',
  priority = '${priority}',
  status = '${status}'
  WHERE 
  id = ${todoId}
  `;
  await db.run(API4Q);
  response.send(`${updatedC} Updated`);
});

/// API 5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const API5Q = `
    DELETE FROM todo
    WHERE 
    id = ${todoId}
    `;
  await db.run(API5Q);
  response.send("Todo Deleted");
});
