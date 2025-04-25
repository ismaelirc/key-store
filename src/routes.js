const express = require("express");
const {KV} = require("./models");

const apiRouter = express.Router();

apiRouter.get("/kv", async (req, res) => {
  try {
    const kvs = await KV.findAll();
    return res.json({data: kvs});
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({error: e.message});
  }
});

apiRouter.get("/kv/:key", async (req, res) => {
  const {key} = req.params;
  try {
    const kv = await KV.findOne({where: {key: key}});

    if (kv) {
      return res.json({data: kv});
    }
    return res.status(404).json({error: "Key not found"});
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({error: e.message});
  }
});

apiRouter.post("/kv", async (req, res) => {
  const {key, value} = req.body;

  if (!key || !value) {
    return res.status(400).json({error: "Key and value are required"});
  }

  try {
    const existingKv = await KV.findOne({where: {key: key}});

    if (existingKv) {
      return res.status(400).json({error: "Key must be unique"});
    }

    const newKey = await KV.create({key, value});

    return res.status(201).json({data: newKey});
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({error: e.message});
  }
});

apiRouter.put("/kv/:key", async (req, res) => {
  const {key} = req.params;
  const {value} = req.body;

  if (!key || !value) {
    return res.status(400).json({error: "Key and value are required"});
  }

  try {
    const [updatedCount] = await KV.update({value}, {where: {key: key}});

    if (updatedCount > 0) {
      const updatedKv = await KV.findOne({where: {key}});
      if (updatedKv) return res.status(201).json({data: updatedKv});
    }

    return res.status(404).json({error: "Key not found"});
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({error: e.message});
  }
});

apiRouter.delete("/kv/:key", async (req, res) => {
  const {key} = req.params;

  if (!key) {
    return res.status(400).json({error: "Key are required"});
  }

  try {
    const deleted = await KV.destroy({where: {key: key}});

    if (deleted > 0) {
      return res.sendStatus(204);
    }

    return res.status(404).json({error: "Key not found"});
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({error: e.message});
  }
});

module.exports = apiRouter;
