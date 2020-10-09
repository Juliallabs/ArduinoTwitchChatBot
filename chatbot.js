/**
 * @description Importaçao de blibiotecas
 * 
 * @requires johnny-five
 * @requires tmi.js
 * @requires fs
 * 
 */
const { Board, Piezo, Led, Pin } = require("johnny-five");
const tmi = require('tmi.js')
const fs = require('fs');

/**
 * @description Construção de Objetos
 */
const board = new Board();
const options = JSON.parse(fs.readFileSync('options.json'));

/**
 * @description Eventos (Funções Callback)
 * @throws Erro quando arduino não conectado corretamente
 */
board.on("ready", function() {

	/**
	 * @description Configuração do micro controlador
	 */
	const pino = new Led(11);
	const piezo = {
		vcc: new Pin(5),
		gnd: new Pin(7),
		pin: new Piezo(6)
	};

	/**
	 * @description Configuração e Conexão com API da Twitch.TV
	 */
	const client = new tmi.client(options);
	client.connect();

	/**
	 * @description Quando menssagem enviada
	 * @see raw_message tem os dados brutos de qualquer evento de chat da live (messangem, highlight, host, raid)
	 */
	client.on("raw_message", (messageCloned, message) => {
		
		// ignorar quando não for uma menssagem no chat
		if (message.command != "PRIVMSG") {
			return;
		}

		// preparar para executar comandos
		let is_highlight = message.tags["msg-id"] == 'highlighted-message';
		let channel = message.params[0];
		let params = message.params[1].slice(1).split(' ');
		let command = params.shift().toLowerCase(); 
	 
		if (command == "rei") {
			// confirmar no chat o comando que recebeu, enviando uma mensagem!
			client.say (channel, "IHA!");

			// isso foi usado para conectar o modulo buzzer direto no arduino,
			// pode ser removido caso usar alimentação com vcc e gnd ao invez das GPIO's
			piezo.vcc.high();
			piezo.gnd.low();

			// tocar música rei do gado
			piezo.pin.play({tempo: 156, song: [["D5",  1],[null,  1],["F5",  1],[null,  1],["A#5", 1],[null,  1],["D6",  1],[null,  1],["A#5", 1],[null,  1],["F5",  1],[null,  1],["G5",  1],[null,  3]["D6",  1],[null,  3],["C6",  1],[null,  3],["D6",  1],[null,  1]]});
		}

		if (command == "stop") {
			piezo.pin.off();
		}
		
		// comando que requer destacar a menssagem
		if (command == "liga" && is_highlight) {
			client.say (message.params[0], "ELETROBLOCKS ON")
			pino.pulse();
		}
		
		if (command == "desliga" && is_highlight) {
			client.say (message.params[0], "ELETROBLOCKS OFF")
			pino.stop().off();    
		}
	});
});