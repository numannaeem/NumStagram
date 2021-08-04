const newMsgSound = (senderName, playSound) => {
  var prevTitle = document.title
  if (playSound) {
    const sound = new Audio('/light.mp3')
    sound?.play()
  }
  if (senderName) {
    document.title = `🔔 New message from ${senderName}`
  }
  if (document.visibilityState === 'visible') {
    setTimeout(() => {
      document.title = prevTitle
    }, 5 * 1000)
  }
}

export default newMsgSound
