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
    this.selectRoomOnChangeEventHandler = this.selectRoomOnChangeEventHandler.bind(this);
    this.submitButtonOnClickEventHandler = this.submitButtonOnClickEventHandler.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.setMessageForm = this.setMessageForm.bind(this);

    // Fetch data
    this.server = 'http://parse.atx.hackreactor.com/chatterbox/classes/messages';
    this.serverData = this.fetch();

    // Initialize
    this.init();
    
  }

  test() {
    console.log(this.serverData);
  }

  selectRoomOnChangeEventHandler(event) {
    this.roomname = event.target.value;
    this.renderRoom(this.roomname);
  }

  submitButtonOnClickEventHandler(event) {
    event.preventDefault();
    var message = {
      username: this.username,
      text: $('#messageField').val(),
      roomname: this.roomname
    };
    console.log(message.text);
    this.send(message);
    this.renderRoom(this.roomname);
  }

  setUsername() {
    // Grab username from window.location.search in url bar.
    var userString = window.location.search;
    var equalIndex = userString.indexOf('=');
    this.username = userString.slice(equalIndex + 1);
  }

  setMessageForm() {
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

    $roomSelect.on('change', this.selectRoomOnChangeEventHandler);

    // Creates text field, button, and form.
    var $textField = $('<input id="messageField" type="text" name="messageField"></input>');
    var $sendButton = $('<button name="messageField">Send</button>');
    var $form = $('<form name="messageField" ></form>');

    // Gives button functionality to send message.
    $sendButton.click(this.submitButtonOnClickEventHandler);

    // Add textfield and send button to form
    $form.append([$roomSelect, $textField, $sendButton]);

    // Append form to main.
    $('#main').append($form);
  }

  init() {
    this.setUsername();
    this.setMessageForm();
    this.renderRoom(this.roomname);
  }

  runTimeout() {
    setTimeout(function() {
      this.send("LOL"), 1000
    });
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
    for (var n = 0; n < 1000; n++) {
      console.log(n, this.serverData.results[n]);
      var message = this.serverData.results[n];
      var $message = $('<p>' + JSON.stringify(JSON.stringify(message.username)) + ': ' + (message.text) + '</p>');
      $('#chats').append($message);
    }


    // var chats = document.getElementById('chats');
    // for (var i = 0; i < 10; i++) {
    //   //console.log(i);
    //   var $element = $('<div id=' + i + '></div>');
    //   for (var n = (100 * i); n < (100 * i) + 100; n++) {
    //     var message = this.serverData.results[n];
    //     var $message = $('<p>' + JSON.stringify(message.username) + ': ' + JSON.stringify(message.text) + '</p>');
    //     $element.append($message);
    //   }
    //   chats.appendChild('')
    //   //debugger;
    //   //$chats.append($element);
    // }

    // this.serverData = this.fetch();
    // this.clearMessages();
    // console.log(this.serverData.results.length);
    // for (var n = 0; n < this.serverData.results.length; n++) {
    //   this.renderMessage(this.serverData.results[n]);
    // }
    // console.log('room rendered');

  }
  
  fetch() {
    var fetched = {};
    var arr = [];
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {
        limit: 10000,
        order: '-createdAt',
        where: {
          'roomname': this.roomname
        }
      },
      success: function(data) {
        fetched = data;
        console.log(data);
      },
      error: function(data) {
        console.log('error');
      },
      async: false
    });
    return fetched;

    // $.ajax({
    // // This is the url you should use to communicate with the parse API server.
    //   url: this.server,
    //   type: 'GET',
    //   data: {
    //     'order': '-createdAt',
    //     'where': {
    //       'roomname': this.roomname
    //     }
    //   },
    //   success: function(serverData) {
    //     fetched = serverData;
    //     // Success message.
    //     console.log('Chatterbox: Fetching data...');
    //   },
    //   error: function (data) {
    //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    //     console.error('Chatterbox: Failed to receive data', data);
    //   },
    //   async: false
    // }); 
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
