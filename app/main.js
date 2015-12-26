var userId = localStorage.getItem("userId") || randomId();
localStorage.setItem("userId", userId);
console.info("User: " + userId);
var messageCache;

function randomId() {
  return Math.floor(Math.random() * 1e11);
}

var socket = io.connect('http://localhost:8080', {'forceNew': true});
socket.on("messages", function(data) {
  console.info(data);
  messageCache = data;

  var html = data.map(function(data, index) {
    return (`
      <form class="message" onsubmit="return likeMessage(messageCache[${index}]);">
        <div class='name'>
          ${data.userName}
        </div>
        <a href=${data.content.link} class='message' target='_blank'>
          ${data.content.text}
        </a>
        <input type=submit class="likes-count" value="${data.likedBy.length} likes" />
      </form>
    `);
  }).join(" ");

  document.getElementById('messages').innerHTML = html;
});

function addMessage(e) {
  var payload = {
    userName:  document.getElementById('username').value,
    content: {
      text: document.getElementById('message').value,
      link: document.getElementById('linkAddress').value,
    },
    likedBy: [],
    ts: Date.now()
  };
  socket.emit("new-message", payload);

  return false;
}
