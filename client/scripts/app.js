class App { 
  
  constructor() {
    this.server = 'http://parse.atx.hackreactor.com/chatterbox/classes/messages';
  }

  init() {
    return 'hello';
  }
  
  send(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: message,
      /*contentType: 'application/json',*/
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  }
  
  fetch() {
    
    $.ajax({
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: "That\'s so fetch"');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Quit trying to make "Fetch" happen, Gretchen');
      }
    });
  }
}


var app = new App();