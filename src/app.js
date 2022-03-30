const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function validId(request, response, next) {
  const { id } = request.params
  if(!isUuid(id)){
    return response.status(400).json({ error: "Don't valid id" })
  }
  return next()
}

const repositories = [];

app.get("/repositories", (request, response) => {
  const { id } = request.query
  const results = id
      ? repositories.filter(rep=> rep.id.includes(id))
      : repositories
  return response.json(results)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repositorie = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 }
  repositories.push(repositorie)
  return response.json(repositorie)
});

app.put("/repositories/:id", validId, (request, response) => {
  const { id } = request.params
  const { title, url, techs, likes } = request.body
  const repositorie = repositories.findIndex(rep => rep.id === id)

  const reposit = {
    id, title, url, techs, likes: repositories[repositorie].likes
  }
  repositories[repositorie] = reposit
  return response.json(reposit)
});

app.delete("/repositories/:id", validId, (request, response) => {
  const { id } = request.params
  const repositorie = repositories.findIndex(rep => rep.id === id)

  repositories.splice(repositorie, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", validId, (request, response) => {
  const { id } = request.params
  const repository = repositories.find((rep) => rep.id === id)

  repository.likes++  

  return response.json(repository)
});

module.exports = app;
