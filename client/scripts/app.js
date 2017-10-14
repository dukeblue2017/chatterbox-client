class App { 
  constructor(message, username) {
    // Configure room settings
    this.username = "lobbyJo";
    this.roomname = 'lobby';
    this.rooms = {};

    // Bind methods
    this.init = this.init.bind(this);
    this.clearMessages = this.clearMessages.bind(this);
    this.send = this.send.bind(this);
    this.fetch = this.fetch.bind(this);
    this.renderRoom = this.renderRoom.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.selectOnChangeEventHandler = this.selectOnChangeEventHandler.bind(this);

    // Fetch data
    this.server = 'http://parse.atx.hackreactor.com/chatterbox/classes/messages';
    this.serverData = this.fetch();

    // Initialize and render room
    this.init();
    this.renderRoom(this.roomname);
    
  }

  test() {
    console.log(this.roomname);
  }

  selectOnChangeEventHandler(event) {
    this.roomname = event.target.value;
  }

  init() {
    // Grab username from window.location.search in url bar.
    var userString = window.location.search;
    var equalIndex = userString.indexOf('=');
    this.username = userString.slice(equalIndex + 1);

    // For loop to grab all possible room names.
    var currentRoomName = '';
    var $options = [];
    for (var n = 0; n < this.serverData.results.length; n++) {
      currentRoomName = this.serverData.results[n].roomname;
      if (!this.rooms.hasOwnProperty(currentRoomName)) {
        this.rooms[currentRoomName] = [];
        var $optionElement = $('<option value="' + currentRoomName + '"">' + currentRoomName + '</option>');
        $options.push($optionElement);
      }
    }

    // Create room select.
    var $roomSelect = $('<select name="roomSelect"></select>');
    $roomSelect.append($options);

    $roomSelect.on('change', this.selectOnChangeEventHandler);


    // Creates text field, button, and form.
    var $textField = $('<input type="text" name="messageField"></input>');
    var $sendButton = $('<button name="messageField">Send</button>');
    var $form = $('<form name="messageField" ></form>');

    var send = this.send.bind(this);
    var renderRoom = this.renderRoom.bind(this);
    var fetch = this.fetch.bind(this);;
    var username = this.username;

    // Gives button functionality to send message.
    $sendButton.click(function(event) {
      event.preventDefault();
      var message = {
        username: username,
        text: $textField.val(),
        roomname: this.roomname
      };
      
      send(message);
      
      renderRoom(this.roomname);
    });

    // Add textfield and send button to form
    $form.append([$roomSelect, $textField, $sendButton]);

    // Append form to main.
    $('#main').append($form);
  }

  clearMessages() {
    $('#chats').empty();
  }

  send(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: message,
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      },
      async: false
    });
  }

  renderRoom(roomname) {

    this.serverData = this.fetch();
    this.clearMessages();

    console.log(this.serverData.results.length);
    for (var n = 0; n < this.serverData.results.length; n++) {
      this.renderMessage(this.serverData.results[n]);
        if (this.serverData.results[n].roomname === roomname) {
         this.renderMessage(this.serverData.results[n]);
      }
    }
    console.log("room rendered");

  }
  
  fetch() {
    var fetched = {};
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      data: {
        'order': '-createdAt'
      },
      success: function(serverData) {
        fetched = serverData;
        // Success message.
        console.log("Chatterbox: Fetching data...");
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('Chatterbox: Failed to receive data', data);
      },
      async: false
    }); 
    return fetched;
  }

  renderMessage(message) {
    var $message = $('<p>' + JSON.stringify(message.username) + ': ' + JSON.stringify(message.text) + '</p>');
    $('#chats').append($message);
  }


}

var app;
$(document).ready(function() {
  app = new App();
});
