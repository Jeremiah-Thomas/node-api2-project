// implement your posts router here
const express = require("express");

const Posts = require("./posts-model");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.find()
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then((comment) => {
      if (comment.length > 0) {
        res.json(comment);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  if (req.body.title == null || req.body.contents == null) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert(req.body)
      .then((post) => {
        Posts.findById(post.id).then((newPost) => {
          res.status(201).json(newPost);
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.put("/:id", (req, res) => {
  if (req.body.title == null || req.body.contents == null) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.update(req.params.id, req.body)
      .then((post) => {
        Posts.findById(req.params.id).then((post) => {
          if (post == null) {
            res.status(404).json({
              message: "The post with the specified ID does not exist",
            });
          } else {
            res.status(200).json(post);
          }
        });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "The post information could not be modified" });
      });
  }
});

router.delete("/:id", (req, res) => {
  Posts.findById(req.params.id).then((post) => {
    if (post == null) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      Posts.remove(req.params.id)
        .then((result) => {
          res.json(post);
        })
        .catch((err) => {
          res.status(500).json({
            message: "The comments information could not be retrieved",
          });
        });
    }
  });
});

module.exports = router;
