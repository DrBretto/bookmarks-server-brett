const express = require("express");
const logger = require("./logger");
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const { v4: uuid } = require("uuid");
const { bookmarks, lists } = require("./store");

bookmarkRouter
  .route("/bookmarks")
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    if (!rating) {
      logger.error(`Rating is required`);
      return res.status(400).send("Invalid data - rating");
    }

    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send("Invalid data - title");
    }

    if (!url) {
      logger.error(`URL is required`);
      return res.status(400).send("Invalid data - url");
    }

    if (!description) {
      logger.error(`Description is required`);
      return res.status(400).send("Invalid data - description");
    }

    // get an id
    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      description,
      rating,
    };

    bookmarks.push(bookmark);

    logger.info(`bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark.id);
  });

bookmarkRouter
  .route("/bookmarks/:id")
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((c) => c.id == id);

    // make sure we found a bookmark
    if (!bookmark) {
      logger.error(`bookmark with id ${id} not found.`);
      return res.status(404).send("bookmark Not Found");
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex((c) => c.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`bookmark with id ${id} not found.`);
      return res.status(404).send("Not found");
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`bookmark with id ${id} deleted.`);

    res.status(204).end();
  });

module.exports = bookmarkRouter;
