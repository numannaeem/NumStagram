const newMsgSound = (senderName) => {
  var prevTitle = document.title;
  const sound = new Audio('/light.mp3');
  if (sound) {
    sound.play();
  }
  if (senderName) {
    document.title = `🔔 New message from ${senderName}`;
  }
  if (document.visibilityState === 'visible') {
    setTimeout(() => {
      document.title = prevTitle;
    }, 5 * 1000);
  }
};

export default newMsgSound;
