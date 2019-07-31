const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();


/********************************************************
 *                           GET                        *
 ********************************************************/
router.get('/', (req, res) => {
    Posts.find()
      .then(posts => {
        res.status(200).json({
          success: true,
          posts
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          message: 'The posts information could not be retrieved',
          err
        });
      });
  });
  
  /********************************************************
   *                          POST /                      *
   ********************************************************/
  router.post('/', (req, res) => {
    const post = req.body;
  
    if (!post.title || !post.contents) {
      const missingField =
        !post.title && !post.contents
          ? 'a title and contents'
          : !post.title
          ? 'a title'
          : 'contents';
  
      res.status(400).json({
        success: false,
        errorMessage: `Please provide ${missingField} for the post.`
      });
    } else {
      Posts.insert(post)
        .then(post => {
          res.status(201).json({
            success: true,
            post
          });
        })
        .catch(err => {
          res.status(500).json({
            success: false,
            errorMessage:
              'There was an error while save the post to the database',
            err
          });
        });
    }
  });
  
  /********************************************************
   *                    POST /:id/comments                *
   ********************************************************/
  router.post('/:id/comments', async (req, res) => {
    const text = req.body.text;
    const post_id = req.params.id;
    console.log(text);
  
    const post = await Posts.findById(post_id);
  
    if (post.length === 0) {
      res.status(404).json({
        success: false,
        errorMessage: 'The post with the specificed ID does not exist.'
      });
    } else if (!text) {
      res.status(400).json({
        success: false,
        erroMessage: 'Please provide text for the comment.'
      });
    } else {
      Posts.insertComment({
        text,
        post_id
      })
        .then(comment => {
          res.status(201).json({
            success: true,
            comment
          });
        })
        .catch(err => {
          res.status(500).json({
            errorMessage:
              'There was an error while saving the comment to the database',
            err
          });
        });
    }
  });
  /********************************************************
   *                    GET /:id/comments                 *
   ********************************************************/
  router.get('/:id/comments', async (req, res) => {
    const post_id = req.params.id;
  
    const post = await Posts.findById(post_id);
  
    if (post.length === 0) {
      res.status(404).json({
        success: false,
        errorMessage: 'The post with the specificed ID does not exist.'
      });
    } else {
      Posts.findPostComments(post_id)
        .then(comments => {
          res.status(200).json({
            success: true,
            comments
          });
        })
        .catch(err => {
          res.status(500).json({
            success: false,
            errorMessage: 'The comments information could not be retrieved',
            err
          });
        });
    }
  });
  
  module.exports = router;