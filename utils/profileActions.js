import axios from 'axios'
import baseUrl from './baseUrl'
import Cookies from 'js-cookie'
import catchErrors from './catchErrors'
import Router from 'next/router'

const Axios = axios.create({
  baseURL: `${baseUrl}/api/profile`,
  headers: { Authorization: Cookies.get('token') }
})

export const acceptRequest = async (userToFollowId, setUserFollowStats) => {
  try {
    await Axios.post(`/acceptRequest/${userToFollowId}`)
    setUserFollowStats((prev) => ({
      ...prev,
      followers: [...prev.followers, { user: userToFollowId }]
    }))
  } catch (error) {
    alert(catchErrors(error))
  }
}

export const rejectRequest = async (userSentReqId) => {
  try {
    await Axios.delete(`/rejectRequest/${userSentReqId}`)
  } catch (error) {
    alert(catchErrors(error))
  }
}

export const sendRequest = async (userToSendReqId, setFollowRequestSent) => {
  try {
    await Axios.post(`/sendRequest/${userToSendReqId}`)
    setFollowRequestSent(true)
  } catch (error) {
    alert(catchErrors(error))
  }
}

export const followUser = async (userToFollowId, setUserFollowStats) => {
  try {
    await Axios.post(`/follow/${userToFollowId}`)
    setUserFollowStats((prev) => ({
      ...prev,
      following: [...prev.following, { user: userToFollowId }]
    }))
  } catch (error) {
    alert(catchErrors(error))
  }
}

export const unfollowUser = async (userToUnfollowId, setUserFollowStats) => {
  try {
    await Axios.put(`/unfollow/${userToUnfollowId}`)
    setUserFollowStats((prev) => ({
      ...prev,
      following: prev.following.filter((f) => f.user !== userToUnfollowId)
    }))
  } catch (error) {
    alert(catchErrors(error))
  }
}

export const profileUpdate = async (profile, setLoading, setError, profilePicUrl) => {
  try {
    const { bio, facebook, instagram, twitter, youtube } = profile
    await Axios.post(`/update`, {
      bio,
      facebook,
      instagram,
      twitter,
      youtube,
      profilePicUrl
    })
    setLoading(false)
    Router.reload()
  } catch (error) {
    setError(catchErrors(error))
    setLoading(false)
  }
}

export const passwordUpdate = async (setSuccess, userPasswords) => {
  try {
    const { currentPassword, newPassword } = userPasswords
    await Axios.post('/settings/password', { currentPassword, newPassword })
    setSuccess(true)
  } catch (error) {
    throw error
  }
}

export const toggleMessagePopup = async (popupSetting, setPopupSetting, setSuccess) => {
  try {
    await Axios.post(`/settings/messagePopup`)
    setPopupSetting(!popupSetting)
    setSuccess(true)
  } catch (error) {
    throw error
  }
}

export const deleteAccount = async (password) => {
  try {
    await Axios.post('/delete', { password })
    Cookies.remove('token')
    Cookies.remove('userEmail')
    Router.push('/login')
    Router.reload()
  } catch (error) {
    throw error
  }
}
