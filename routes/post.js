const express = require('express');
const { 
    createPost, 
    getPosts, 
    postsByUser, 
    postById, 
    isPoster, 
    deletePost, 
    updatePost, 
    photo, 
    singlePost,
    like,
    unlike,
    comment, 
    uncomment, } = require('../controllers/post');
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { createPostValidator } = require('../validator');

const router = express.Router();
router.get('/posts', getPosts);

//like and unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

//comments
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);

router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);

router.get("/posts/by/:userId", postsByUser); //to get userid
router.get("/post/:postId", singlePost);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

//photo
router.get("/post/photo/:postId", photo);


//any route containing :userId, our app will first execute userById()
router.param("userId", userById)
//any route containing :postId, our app will first execute postById()
router.param("postId", postById)

module.exports = router;