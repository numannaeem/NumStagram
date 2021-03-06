const UserModel = require('../models/UserModel')
const NotificationModel = require('../models/NotificationModel')

const setNotificationToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId)
    if (user && !user.unreadNotification) {
      user.unreadNotification = true
      await user.save()
    }
    return
  } catch (error) {
    console.error(error)
  }
}

// const unsetNotificationToUnread = async (userId) => {
//     try {
//         const user = await UserModel.findById(userId)
//         if (user && user.unreadNotification) {
//             user.unreadNotification = false
//             await user.save()
//         }
//         return
//     } catch (error) {
//         console.error(error)
//     }
// }

const newLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
    const newNotification = {
      type: 'newLike',
      user: userId, //User who liked the post
      post: postId,
      date: Date.now()
    }

    await userToNotify.notifications.unshift(newNotification)
    await userToNotify.save()

    setNotificationToUnread(userToNotifyId)
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const removeLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: 'newLike',
            user: userId,
            post: postId
          }
        }
      }
    )
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const newCommentNotification = async (
  postId,
  userId,
  commentId,
  userToNotifyId,
  text
) => {
  try {
    const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
    const newNotif = {
      type: 'newComment',
      user: userId,
      post: postId,
      commentId,
      text,
      date: Date.now()
    }
    await userToNotify.notifications.unshift(newNotif)
    await userToNotify.save()
    setNotificationToUnread(userToNotifyId)
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const removeCommentNotification = async (postId, userId, commentId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: 'newComment',
            user: userId,
            post: postId,
            commentId
          }
        }
      }
    )
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const newReplyNotification = async (postId, userId, replyId, userToNotifyId, text) => {
  try {
    const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
    const newNotif = {
      type: 'newReply',
      user: userId,
      post: postId,
      replyId,
      text,
      date: Date.now()
    }
    await userToNotify.notifications.unshift(newNotif)
    await userToNotify.save()
    setNotificationToUnread(userToNotifyId)
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const removeReplyNotification = async (postId, userId, replyId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: 'newReply',
            user: userId,
            post: postId,
            replyId
          }
        }
      }
    )
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const newCommentLikeNotification = async (postId, text, userId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
    const newNotif = {
      type: 'newCommentLike',
      user: userId,
      post: postId,
      text,
      date: Date.now()
    }
    await userToNotify.notifications.unshift(newNotif)
    await userToNotify.save()
    setNotificationToUnread(userToNotifyId)
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const removeCommentLikeNotification = async (postId, text, userId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: {
            type: 'newCommentLike',
            user: userId,
            post: postId,
            text
          }
        }
      }
    )
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const newFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
    const newNotif = {
      type: 'newFollower',
      user: userId,
      date: Date.now()
    }

    await userToNotify.notifications.unshift(newNotif)
    await userToNotify.save()

    setNotificationToUnread(userToNotifyId)
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const removeFollowerNotification = async (userId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      { $pull: { notifications: { type: 'newFollower', user: userId } } }
    )

    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

const newFollowRequestNotification = async (userId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
    const newNotif = {
      type: 'newFollowRequest',
      user: userId,
      date: Date.now()
    }

    await userToNotify.notifications.unshift(newNotif)
    await userToNotify.save()

    setNotificationToUnread(userToNotifyId)
    return
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
  newFollowerNotification,
  removeFollowerNotification,
  newReplyNotification,
  removeReplyNotification,
  newFollowRequestNotification,
  newCommentLikeNotification,
  removeCommentLikeNotification
}
