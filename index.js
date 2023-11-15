const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');
const nodemailer = require('nodemailer'); // npm install nodemailer
const readline = require('readline');
 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-contraseña'
  }
});
 
async function run() {
  try {
    client.on('qr', qr => {
      qrcode.generate(qr, { small: true });
    });
 
    client.on('ready', () => {
      console.log('¡Bien! WhatsApp conectado.');
    });
 
    await client.initialize();
 
    function cumprimentar() {
      const dataAtual = new Date();
      const hora = dataAtual.getHours();
 
      let salunat;
 
      if (hora >= 6 && hora < 12) {
        salunat = "Hola Muy buenos días! 🌞 Te Saluda Natalia 👩🏻‍💻";
      } else if (hora >= 12 && hora < 17) {
        salunat = "Hola buenas tardes! 🖼️ Te Saluda Natalia 👋🏻";
      } else {
        salunat = "Hola buenas noches 🌒! Te Saluda Natalia 👋🏻";
      }
 
      return salunat;
    }
 
    function obtenerFechaHora() {
      const fechaHoraActual = new Date();
      return `La Hora Y la fecha actual Son: ${fechaHoraActual}`;
    }

    function despedirse() {
      return "Gracias por comunicarte con NatBot 🌻👩🏻‍💻 vuelve pronto!";
    }
 
    const menunat = `
    Bienvenido al *NatBot* 👩🏻‍💻🌻 Por favor elija su servicio :
    1. Quiero Un Saludo 👋🏻
    2. ¿Que hora y que fecha es? ⏰🕰️
    3. Finalizar 🤞🏻
    `;
 
    const delay = ms => new Promise(res => setTimeout(res, ms));
 
    client.on('message', async msg => {
      if (
        msg.body.match(/(buenas noches|buenos dias|buenas tardes|hola|dia|informacion|Imagen|videos|audios|teste)/i) &&
        msg.from.endsWith('@c.us')
      ) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        await delay(500);
        const saudacoes = cumprimentar();
        await client.sendMessage(msg.from, `${menunat} `);


      } 
      
      else if (msg.body.match(/(1|saludo)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const saudacoes = cumprimentar();
        await client.sendMessage(msg.from, saudacoes);
        await client.sendMessage(msg.from, `${menunat} `);

      } 
      
      else if (msg.body.match(/(2|fecha y hora)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const fechaHora = obtenerFechaHora();
        await client.sendMessage(msg.from, fechaHora);
        await client.sendMessage(msg.from, `${menunat} `);

      }

      else if (msg.body.match(/(3|despedida)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const despedidaMensaje = despedirse();
        await client.sendMessage(msg.from, despedidaMensaje);
        await client.sendMessage(msg.from, `${menunat} `);
      }


       else if (msg.body.match(/menu/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        await client.sendMessage(msg.from, menu);

      }

    });
 
    function waitForResponse() {
      return new Promise((resolve, reject) => {
        client.on('message', async msg => {
          if (msg.from.endsWith('@c.us')) {
            resolve(msg);
          }
        });
      });
    }
  } catch (error) {
    console.error('Error en la ejecución:', error);
  }
}
 
run().catch(err => console.error(err));