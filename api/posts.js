const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const UserModel = require('../models/UserModel')
const PostModel = require('../models/PostModel')
const uuid = require('uuid').v4
const FollowerModel = require('../models/FollowerModel')
const {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
  newReplyNotification,
  removeReplyNotification
} = require('../utilsServer/notificationActions')

//TEST ROUTE

router.put('/test', async (req, res) => {
  try {
    UserModel.updateMany({ private: { $exists: false } }, { private: true })
    const doc = await UserModel.findOne({ name: 'admin' })
    doc.private = false
    await doc.save()
    return res.status(200).send(doc)
  } catch (error) {
    console.error(error)
    return res.status(500).send('Server Error')
  }
})

// CREATE A POST

router.post('/', authMiddleware, async (req, res) => {
  const { text, location, picUrl } = req.body

  if (text.length < 1) return res.status(401).send('Text must be atleast 1 character')

  try {
    const newPost = {
      user: req.userId,
      text
    }
    if (location) newPost.location = location
    if (picUrl) newPost.picUrl = picUrl

    const post = await new PostModel(newPost).save()

    const postCreated = await PostModel.findById(post._id).populate('user')

    return res.json(postCreated)
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

// GET ALL POSTS

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req
    const { pageNumber } = req.query
    const user = await UserModel.findById(userId)
    const number = Number(pageNumber)
    const size = 8
    let posts = []
    const skips = size * (number - 1)
    if (user.role === 'root') {
      posts = await PostModel.find()
        .skip(skips)
        .limit(size)
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('comments.user')
        .populate('comments.replies.user')
      return res.json(posts)
    }

    const loggedUser = await FollowerModel.findOne({ user: userId }).select('-followers')

    if (loggedUser.following.length > 0) {
      posts = await PostModel.find({
        user: { $in: [userId, ...loggedUser.following.map((f) => f.user)] }
      })
        .skip(skips)
        .limit(size)
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('comments.user')
        .populate('comments.replies.user')
    } else {
      posts = await PostModel.find({ user: userId })
        .skip(skips)
        .limit(size)
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('comments.user')
        .populate('comments.replies.user')
    }

    return res.json(posts)
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

// GET POST BY ID

router.get('/:postId', authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate('user')
      .populate('comments.user')
      .populate('comments.replies.user')

    if (!post) {
      return res.status(404).send('Post not found')
    }

    return res.json(post)
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

// DELETE POST

router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req

    const { postId } = req.params

    const post = await PostModel.findById(postId)
    if (!post) {
      return res.status(404).send('post not found')
    }

    const user = await UserModel.findById(userId)

    if (post.user.toString() !== userId) {
      if (user.role === 'root') {
        await post.remove()
        return res.status(200).send('Post deleted Successfully')
      } else {
        return res.status(401).send('Unauthorized')
      }
    }

    await post.remove()
    return res.status(200).send('Post deleted Successfully')
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

// LIKE A POST

router.post('/like/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params
    const { userId } = req

    const post = await PostModel.findById(postId)
    if (!post) {
      return res.status(404).send('No Post found')
    }

    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length > 0

    if (isLiked) {
      return res.status(401).send('Post already liked')
    }

    await post.likes.unshift({ user: userId })
    await post.save()

    if (post.user.toString() !== userId) {
      await newLikeNotification(userId, postId, post.user.toString())
    }

    return res.status(200).send('Post liked')
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

// UNLIKE A POST

router.put('/unlike/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params
    const { userId } = req

    const post = await PostModel.findById(postId)
    if (!post) {
      return res.status(404).send('No Post found')
    }

    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length === 0

    if (isLiked) {
      return res.status(401).send('Post not liked before')
    }

    const index = post.likes.map((like) => like.user.toString()).indexOf(userId)

    await post.likes.splice(index, 1)
    await post.save()

    if (post.user.toString() !== userId) {
      await removeLikeNotification(userId, postId, post.user.toString())
    }

    return res.status(200).send('Post Unliked')
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

// GET ALL LIKES OF A POST

router.get('/like/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params

    const post = await PostModel.findById(postId).populate('likes.user')
    if (!post) {
      return res.status(404).send('No Post found')
    }

    return res.status(200).json(post.likes)
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

// CREATE A COMMENT

router.post('/comment/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params
    const { userId } = req
    const { text } = req.body

    if (text.length < 1)
      return res.status(401).send('Comment should be atleast 1 character')

    const post = await PostModel.findById(postId)

    if (!post) return res.status(404).send('Post not found')

    const newComment = {
      _id: uuid(),
      text,
      user: req.userId,
      date: Date.now(),
      replies: []
    }

    await post.comments.unshift(newComment)
    await post.save()
    if (post.user.toString() !== userId) {
      await newCommentNotification(
        postId,
        userId,
        newComment._id,
        post.user.toString(),
        text
      )
    }

    return res.status(200).json(newComment._id)
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

//REPLY TO A COMMENT
router.post('/reply/:postId/:commentId', authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params
    const { userId } = req
    const { text } = req.body

    if (text.length < 1) return res.status(401).send('Reply cannot be empty')

    const post = await PostModel.findById(postId)

    if (!post) return res.status(404).send('Post not found')

    const comment = post.comments.find((comment) => comment._id === commentId)
    if (!comment) {
      return res.status(404).send('No comment found')
    }

    const newReply = {
      _id: uuid(),
      text,
      user: req.userId,
      date: Date.now()
    }
    if (!comment.replies) {
      comment.replies = []
    }
    await comment.replies.push(newReply)

    await post.save()
    if (comment.user.toString() !== userId) {
      await newReplyNotification(
        postId,
        userId,
        newReply._id,
        comment.user.toString(),
        text
      )
    }

    return res.status(200).json(newReply._id)
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

// DELETE A COMMENT

router.delete('/:postId/:commentId', authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params
    const { userId } = req

    const post = await PostModel.findById(postId)
    if (!post) return res.status(404).send('Post not found')

    const comment = post.comments.find((comment) => comment._id === commentId)
    if (!comment) {
      return res.status(404).send('No Comment found')
    }

    const user = await UserModel.findById(userId)
    if (comment.user.toString() !== userId && user.role !== 'root') {
      return res.status(401).send('Unauthorized')
    }

    const indexOf = post.comments.map((comment) => comment._id).indexOf(commentId)

    await post.comments.splice(indexOf, 1)

    await post.save()

    if (post.user.toString() !== userId) {
      await removeCommentNotification(postId, userId, commentId, post.user.toString())
    }

    return res.status(200).send('Deleted Successfully')
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

//DELETE A REPLY

router.delete('/:postId/:commentId/:replyId', authMiddleware, async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params
    const { userId } = req

    const post = await PostModel.findById(postId)
    if (!post) return res.status(404).send('Post not found')

    const comment = post.comments.find((comment) => comment._id === commentId)
    if (!comment) {
      return res.status(404).send('No Comment found')
    }
    const reply = comment.replies.find((reply) => reply._id === replyId)
    if (!reply) {
      return res.status(404).send('No reply found')
    }

    const user = await UserModel.findById(userId)
    if (reply.user.toString() !== userId && user.role !== 'root') {
      return res.status(401).send('Unauthorized')
    }

    const indexOf = comment.replies.indexOf(reply)

    await comment.replies.splice(indexOf, 1)

    await post.save()

    if (comment.user.toString() !== userId) {
      await removeReplyNotification(postId, userId, replyId, comment.user.toString())
    }

    return res.status(200).send('Deleted Successfully')
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

module.exports = router
