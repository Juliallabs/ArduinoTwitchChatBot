tmi = require('tmi.js')
 
const BOT_NOME = 'Eletro-Julia';
const BOT_CHAVE = 'sua chave da twitch aqui'







































//----------------------------------------------------------------------------------------------
//-------------------------------------------_CHAVEEEE------------------------------------------






var five = require("johnny-five");
//var board = new five.Board();
const { Board, Led } = require("johnny-five");

const board = new Board();



const options = {
  
  options:{
    debug: true 
   },

identity:{
  username: BOT_NOME,
  password: BOT_CHAVE
},

channels: ['julialabs']

};

board.on("ready", function() {
  const pino = new Led(11);

  const client = new tmi.client(options);
  client.connect();
  
  /*client.on('message',function(channel,userstate,message,self){
  
    if (self) return;
    //console.log(message);

  });
*/
  client.on("raw_message", (messageCloned, message) => {
   // console.log(message);
      if( message.tags["msg-id"]== 'highlighted-message'){ 
       
        if('!liga' == message.params[1]){
          client.say (message.params[0], "ELETROBLOCKS ON")
          pino.pulse();
          
        }
      
        if ('!desliga'== message.params[1]){
          client.say (message.params[0], "ELETROBLOCKS OFF")
          pino.stop().off();    
      
        }
      }
});

    
//'msg-id': 'highlighted-message',
// message.tags
  
    /*client.on('join', (channel, username, selfs) => {
    
      if (self) return;

      client.say (channel,"bem vindo ao Lab " + username)
  
      pino.pulse();
  
      board.wait(1000, () => {
        pino.stop().off();
      });
  
  });*/
  


});

