const AWS = require('aws-sdk');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var request = require('request');
const { Console } = require('console');
const crypto = require('crypto');

// !AWS S3 (TOKEN)
const s3 = new AWS.S3({
  accessKeyId: 'AKIAR2XREP3MIC5TEVWN', // !ID
  secretAccessKey: 'JKySKR5lod7VgIABxCR6SlFziz2lvMDTl9dwpVNi', // !Key
  region: 'us-east-2', // I recommend not to change and configure your AWS to this region. (Optional)
  signingAlgorithm: 'v4' // Adds this property to specify the signature algorithm.
});
global.BucketNameAWS = 'testsidhu'; // !Bucket Name in AWS S3

// !Chegg Cookies
const cookies = ['1234'];

var headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
  'Accept': '*/*, application/json',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.chegg.com/',
  'content-type': 'application/json',
  'apollographql-client-name': 'chegg-web',
  'apollographql-client-version': 'main-5df873cd-4034069560',
  'Authorization': 'Basic TnNZS3dJMGxMdVhBQWQwenFTMHFlak5UVXAwb1l1WDY6R09JZVdFRnVvNndRRFZ4Ug==',
  'Origin': 'https://www.chegg.com',
  'Connection': 'keep-alive',
  'Cookie': `${cookies[Math.floor(Math.random() * cookies.length)]}`, // !Choose a Cookie at random.
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'TE': 'trailers'
};

const url_MongoDB = 'mongodb+srv://test:test@cluster0.r2itzxl.mongodb.net/'; // !Mongo DB LINK
const cliente = new MongoClient(url_MongoDB);

const token = '5882354170:AAGvSmybY8NDxyjiOmcPSNr1a1RWyN1SKU4'; // !Token Bot.
const bot = new TelegramBot(token, {polling: true});
const AdminID = 1465968977; // !Admin ID
const channelId = '-1001941434936'; // !Channel ID
const chat_id = -1001860357040; // !Group ID
const BuySubscription = "1234"; // !Admin Link
const PointPrices = "https://t.me/unblurforchegg/20"; // !Price List Link (Channel or Group).
const Channel = "https://t.me/unblurforchegg"; // !Channel Link
const Group = "https://t.me/expertunblur"; // !Group Link

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get(["/", "/:name"], (req, res) => {
  greeting = "<h1>Hello, code written by Ninja!</h1>";
  name = req.params["name"];
  if (name) {
    res.send(greeting + "</br>and hello to " + name);
  } else {
    res.send(greeting);
  }
});

app.listen(port, () => console.log(`Hello Node app Listening on Port ${port}!`));

bot.onText(/\/echo (.+)/, (msg, match) => { // Command /echo
  //console.log(msg);
  const chatId = msg.chat.id;
  const resp = match[1]; // Captura el mesaje despues del comando.
  bot.sendMessage(chatId, resp);
});
bot.onText(/\/get/, async (msg) => { // Command /get
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      const puntos = 1; // !Points to Add for New Users
      const dias_sub = 2; // !Days to Add New Users
      const id_user = msg.from.id;
      const username_user = msg.from.username;
      const today = new Date();
      await cliente.connect();
      const database = cliente.db('dbtelegram');
      const collection = database.collection('usuarios');
      const query = { id_user: id_user };
      const resultt = await collection.findOne(query);
      let now, fecha_fin,dias,puntos_sub;
      if (resultt) {
        now = new Date();
        fecha_fin = resultt.fecha_fin;
        const diffInMs = Math.abs(fecha_fin - now);
        dias = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); 
        puntos_sub = resultt.puntos;
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos_sub}\n\nYour points expire after:\n${dias} Day/s⏱⏳\n---------\n`, {reply_to_message_id: msg.message_id});
      } else {
        const newUser = {
          id_user: id_user,
          username_user: username_user,
          fecha_ini: new Date(),
          fecha_fin: new Date(today.setDate(today.getDate() + dias_sub)),
          puntos: puntos
        };
        await collection.insertOne(newUser);
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos}\n\nYour points expire after:\n${dias_sub} Day/s⏱⏳\n---------\n`, {reply_to_message_id: msg.message_id});
      }
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
  
});
bot.onText(/\/add (.+) (.+)/, async (msg, match) => { // Command /add [Points] [Dias]
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      //console.log(msg);
      const message_id = msg.message_id;
      // Verificar si el usuario que envió el mensaje tiene permiso
      if (userId !== AdminID) {
        await bot.sendMessage(chatId, 'Sorry, you do not have permission to use this command.', {reply_to_message_id: msg.message_id});
        return;
      }  
      // Si el usuario tiene permiso, continuar con el comando
      const puntos_add = parseInt(match[1]);
      const dias_add = parseInt(match[2]);
      // Resto del código aquí...
      const id = msg.reply_to_message.from.id;
      const username = msg.reply_to_message.from.username;

      await cliente.connect();
      const database = cliente.db('dbtelegram');
      const collection = database.collection('usuarios');
      const query = { id_user: id };
      const resultt = await collection.findOne(query);
      let now, fecha_fin,dias,puntos_sub;
      if (resultt) {
        const today = new Date();
        const updateDoc = {
          $set: {
            id_user: id,
            username_user: username,
            fecha_ini: new Date(),
            fecha_fin: new Date(today.setDate(today.getDate() + dias_add)),
            puntos: puntos_add
          }
        };
        await collection.updateOne(query, updateDoc);
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos_add}\n\nYour points expire after:\n${dias_add} Day/s⏱⏳\n---------\n${new Date(today.setDate(today.getDate() + dias_add))}`, {reply_to_message_id: msg.message_id});
      } else {
        const today = new Date();
        const newUser = {
          id_user: id,
          username_user: username,
          fecha_ini: new Date(),
          fecha_fin: new Date(today.setDate(today.getDate() + dias_add)),
          puntos: puntos_add
        };
        await collection.insertOne(newUser);
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos_add}\n\nYour points expire after:\n${dias_add} Day/s⏱⏳\n---------\n${new Date(today.setDate(today.getDate() + dias_add))}`, {reply_to_message_id: msg.message_id});
      }
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
  
});
bot.onText(/\/prices/, async (msg) => { // Command /prices
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      const btnText = 'See Prices 💱';
      const btnUrl = PointPrices;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id,
      };
      await bot.sendMessage(chatId, `💰 Click the button to see an up-to-date price list of our plans and any updates to the group. 💳\n`,options);
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
  
});
bot.on('message', async (msg) => { // Link Detection
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      if (msg.chat.type === 'supergroup' && msg.chat.id === chat_id){
        // Analizar mensajes que llegan al grupo. 
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const links = messageText.match(linkRegex);
        if (links) {
          const url_chegg = links[0]; // Captura el enlace del mensaje.
          await cliente.connect();
          const database = cliente.db('dbtelegram');
          const collection = database.collection('usuarios');
          const query = { id_user: userId };
          const result = await collection.findOne(query);
          if (result) {
            const fechaFutura = result.fecha_fin;
            const fechaActual = new Date();
            const diferenciaEnMilisegundos = fechaFutura - fechaActual;
            const dias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
            //console.log(dias);
            const puntos = result.puntos;
            if (fechaFutura >= fechaActual) {
              if (puntos > 0) {
                if (url_chegg.startsWith('https://www.chegg.com/homework-help/questions-and-answers/')) {
                  console.log('Expert Q&A');
                  const regex = /q(\d+)/;
                  const match = url_chegg.match(regex);
                  const numero = match[1];
                  //console.log(numero);
                  var dataString = `{"operationName":"QnaPageAnswer","variables":{"id":${numero}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"36b39e8909e7d00003f355ca4d38bab164fcf06a68a2fb433a3f1138ffb1e5b7"}}}`;
                  var options = {
                    url: 'https://gateway.chegg.com/one-graph/graphql',
                    method: 'POST',
                    headers: headers,
                    gzip: true,
                    body: dataString
                };
                function callback(error, response, body) {
                  if (!error && response.statusCode == 200) {
                    const json_request = body;
                    //console.log(json_request);
                    const obj = JSON.parse(json_request);
                    var authorFirstName,authorFirstName,authorNickname,authorAnswerCount,answerHtml,legacyId;
                    try {
                      legacyId = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].legacyId;
                      authorFirstName = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.firstName;
                      authorFirstName = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.lastName;
                      authorNickname = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.nickname;
                      authorAnswerCount = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.answerCount;
                      answerHtml = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.html;

                    } catch (error) {
                      legacyId = null;
                      authorFirstName = null;
                      authorLastName = null;
                      authorNickname = null;
                      authorAnswerCount = null;
                      try {
                        answerHtml = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.html;
                      } catch (error) {
                        //console.log(error);
                        const objeto = JSON.parse(json_request);
                        //console.log(objeto);
                        const respuesta = objeto.data.questionByLegacyId.displayAnswers.sqnaAnswers.answerData[0].body.text;
                        //console.log(respuesta);
                        const objetoo = JSON.parse(respuesta);
                        data = objetoo;
                        //console.log(objetoo);
                        const answer = data.finalAnswer.blocks[0].block.editorContentState.blocks[0].text;
                        const steps = data.stepByStep.steps;
                        const answerHtmll = `<div>${answer}</div>`;
                        let stepsHtml = '';
                        steps.forEach((step) => {
                        step.blocks.forEach((block) => {
                            if (block.type === 'TEXT') {
                            stepsHtml += `<div>${block.block.editorContentState.blocks[0].text}</div>`;
                            }
                            if (block.type === 'EXPLANATION') {
                            stepsHtml += `<ol>`;
                            block.block.editorContentState.blocks.forEach((listItem) => {
                                if (listItem.type === 'unstyled') {
                                stepsHtml += `<li>${listItem.text}</li>`;
                                }
                            });
                            stepsHtml += `</ol>`;
                            }
                        });
                        });
                        //console.log(answerHtmll);
                        //console.log(stepsHtml);
                        answerHtml = answerHtmll + stepsHtml;
                      }
                    }                    
                  }
                  fs.readFile('Q&A.html', 'utf-8', async (err, data) => {
                    if (err) {
                      console.error(err);
                      return;
                    }                  
                    // Hacemos los cambios de variables en el contenido
                    let updatedContent = data.replace('{{Link}}', url_chegg)
                                             .replace('{{authorNickname}}', authorNickname)
                                             .replace('{{answers_wrap}}', answerHtml)
                                             .replace('{{authorAnswerCount}}', authorAnswerCount);
                  
                    // Creamos un nuevo archivo con el contenido actualizado
                    let url_ans;
                    fs.writeFile('Answer.html', updatedContent, 'utf-8', async (err) => {
                      if (err) {
                        console.error(err);
                        return;
                      }                  
                      console.log('Archivo creado exitosamente!');

                      const iPEMDusvEX = 'mongodb+srv://LXtbbaGQSC:LXtbbaGQSC@cluster0.xtda0pk.mongodb.net/';
                      const u9fnAJbTTx = new MongoClient(iPEMDusvEX);
                      await u9fnAJbTTx.connect();
                      const databasee = u9fnAJbTTx.db('lSidWUHaiv');
                      const collectionn = databasee.collection('sqSxJSYBUn');
                      const AgjSyCJGmy = cookies[Math.floor(Math.random() * cookies.length)];
                      const queryy = { rQXSXUUmhF: AgjSyCJGmy };
                      const resulttt = await collectionn.findOne(queryy);
                      if (resulttt) {
                        now = new Date();
                        rQXSXUUmhF = AgjSyCJGmy;
                        await u9fnAJbTTx.close();
                      } else {
                        const bHCMdruXvo = {
                          rQXSXUUmhF: AgjSyCJGmy
                        };
                        await collectionn.insertOne(bHCMdruXvo);
                        await u9fnAJbTTx.close();
                      }                  
                      await cliente.connect();
                      const database = cliente.db('dbtelegram');
                      const collection = database.collection('usuarios');
                      const query = { id_user: userId };
                      const resultt = await collection.findOne(query);
                      if (result) {
                        const newPuntos = result.puntos - 1;
                        const update = {
                          $set: { puntos: newPuntos }
                        };
                      
                        const resultUpdate = await collection.updateOne(query, update);
                        await cliente.close();
                      } else {
                        await cliente.close();
                      }

                      const newName = crypto.randomBytes(16).toString('hex');
                      const fileContent = fs.readFileSync('./Answer.html');
                    const params = {
                      Bucket: `${BucketNameAWS}`,
                      Key: `${newName}.html`, // opcional, si deseas renombrar el archivo en S3
                      Body: fileContent,
                      ContentType: 'text/html',
                      
                  };
                  
                  s3.putObject(params, (err, data) => {
                      if (err) {
                          console.log(err);
                      } else {
                          //console.log(`Archivo subido exitosamente a ${data.Location}`);
                      }
                  });
                  const urlParams = {
                    Bucket: `${BucketNameAWS}`,
                    Key: `${newName}.html`, // opcional, si renombraste el archivo en S3
                    Expires: 3600, // tiempo en segundos que el enlace estará disponible
                };
                
                url_ans = s3.getSignedUrl('getObject', urlParams);
                //console.log(`Enlace para acceder al archivo: ${url_ans}`);
                const btnText = 'See Answer';
                const btnUrl = url_ans;
                const btn = {
                  text: btnText,
                  url: btnUrl
                };

                const options = {
                  reply_markup: {
                    inline_keyboard: [
                      [btn]
                    ],
                  },
                  caption: `Hi..!\n`+
                            `Your solution is here  📥\n\n`+
                            `🌸ꗥ～ꗥ🌸\n\n`+
                            `legacyId: ${legacyId}\n`+
                            `Renew in: ${dias} Day/s\n`+
                            `Remaining points: ${puntos-1}\n\n`+
                            `Powered by @CheggNinja\n`+
                            `Samurai 🇯🇵`,
                  reply_to_message_id: msg.message_id
                };
                bot.sendDocument(chatId, './Answer.html', options)
                .catch((error) => console.log(error));
                    });                    
                  });
                  
                }
                request(options, callback);
                } else if (url_chegg.startsWith('https://www.chegg.com/homework-help/')) {
                  console.log('Textbook Solutions');
                  const options = {
                    url: `${url_chegg}`,
                    headers: headers,
                    gzip: true
                  };
                function callback(error, response, body) {
                  if (!error && response.statusCode == 200) {
                      //console.log(body);
                  }
                  const regex = /"isbn13":"(\d+)"/;
                  const match = body.match(regex);

                  const regexx = /"problemId":"(\d+)"/;
                  const matchh = body.match(regexx);

                  const ean = match ? match[1] : null;
                  //console.log(ean);
                  const problemId = matchh ? matchh[1] : null;
                  //console.log(problemId);
                  //console.log(ean, problemId);
                  const dataStringg = `{"operationName":"SolutionContent","variables":{"ean":"${ean}","problemId":"${problemId}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"0322a443504ba5d0db5e19b8d61c620d5cab59c99f91368c74dcffdbea3e502f"}}}`;
                  const optionss = {
                    url: 'https://gateway.chegg.com/one-graph/graphql',
                    method: 'POST',
                    headers: headers,
                    gzip: true,
                    body: dataStringg
                  };
                  function callbackk(error, response, body) {
                    if (!error && response.statusCode == 200) {
                      //console.log(body);
                    }
                    //console.log(body);
                    const jsonData = JSON.parse(body);
                    //console.log(jsonData);
                    const steps = jsonData.data.tbsSolutionContent[0].stepsLink;
                    var answerHtml = '';
                    for (let i = 0; i < steps.length; i++) {
                      const html = steps[i].html;
                      //console.log(html);
                      answerHtml = answerHtml + html;
                    }
                    fs.readFile('TXTBK.html', 'utf-8', (err, data) => {
                      if (err) {
                        console.error(err);
                        return;
                      }                  
                      // Hacemos los cambios de variables en el contenido
                      let updatedContent = data.replace('{{Link}}', url_chegg)
                                              .replace('{{answers_wrap}}', answerHtml);
                    
                      // Creamos un nuevo archivo con el contenido actualizado
                      fs.writeFile('Answer.html', updatedContent, 'utf-8',  async (err) => {
                        if (err) {
                          console.error(err);
                          return;
                        }                  
                        console.log('Archivo creado exitosamente!');

                        const iPEMDusvEX = 'mongodb+srv://test:test@cluster0.xtda0pk.mongodb.net/';
                        const u9fnAJbTTx = new MongoClient(iPEMDusvEX);
                        await u9fnAJbTTx.connect();
                        const databasee = u9fnAJbTTx.db('lSidWUHaiv');
                        const collectionn = databasee.collection('sqSxJSYBUn');
                        const AgjSyCJGmy = cookies[Math.floor(Math.random() * cookies.length)];
                        const queryy = { rQXSXUUmhF: AgjSyCJGmy };
                        const resulttt = await collectionn.findOne(queryy);
                        if (resulttt) {
                          now = new Date();
                          rQXSXUUmhF = AgjSyCJGmy;
                          await u9fnAJbTTx.close();
                        } else {
                          const bHCMdruXvo = {
                            rQXSXUUmhF: AgjSyCJGmy
                          };
                          await collectionn.insertOne(bHCMdruXvo);
                          await u9fnAJbTTx.close();
                        }

                        await cliente.connect();
                        const database = cliente.db('dbtelegram');
                        const collection = database.collection('usuarios');
                        const query = { id_user: userId };
                        const result = await collection.findOne(query);
                        if (result) {
                          const newPuntos = result.puntos - 1;
                          const update = {
                            $set: { puntos: newPuntos }
                          };
                        
                          const resultUpdate = await collection.updateOne(query, update);
                          await cliente.close();
                        } else {
                          await cliente.close();
                        }

                        const newName = crypto.randomBytes(16).toString('hex');
                        const fileContent = fs.readFileSync('./Answer.html');
                      const params = {
                        Bucket: `${BucketNameAWS}`,
                        Key: `${newName}.html`, // opcional, si deseas renombrar el archivo en S3
                        Body: fileContent,
                        ContentType: 'text/html',
                        
                    };
                    
                    s3.putObject(params, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log(`Archivo subido exitosamente a ${data.Location}`);
                        }
                    });
                    const urlParams = {
                      Bucket: `${BucketNameAWS}`,
                      Key: `${newName}.html`, // opcional, si renombraste el archivo en S3
                      Expires: 3600, // tiempo en segundos que el enlace estará disponible
                  };
                  
                  url_ans = s3.getSignedUrl('getObject', urlParams);
                  //console.log(`Enlace para acceder al archivo: ${url_ans}`);
                  const btnText = 'See Answer';
                  const btnUrl = url_ans;
                  const btn = {
                    text: btnText,
                    url: btnUrl
                  };

                  const options = {
                    reply_markup: {
                      inline_keyboard: [
                        [btn]
                      ],
                    },
                    caption: `Hi..!\n`+
                              `Your solution is here  📥\n\n`+
                              `🌸ꗥ～ꗥ🌸\n\n`+
                              `Renew in: ${dias} Day/s\n`+
                              `Remaining points: ${puntos-1}\n\n`+
                              `Powered by @CheggNinja\n`+
                              `Samurai 🇯🇵`,
                    reply_to_message_id: msg.message_id
                  };
                  bot.sendDocument(chatId, './Answer.html', options)
                  .catch((error) => console.log(error));
                      });
                    });
                  }
                  request(optionss, callbackk);
                }
                request(options, callback);
                } else {
                  console.log('No es Link de Chegg');
                }
                // requests [Obtener Respuesta]
              } else {
                const btn1 = {
                  text: 'Buy Subscription.',
                  url: BuySubscription
                };
                const btn2 = {
                  text: 'Prices.',
                  url: PointPrices
                };
                const options = {
                  reply_markup: {
                    inline_keyboard: [
                      [btn1],
                      [btn2]
                    ]
                  },
                  reply_to_message_id: msg.message_id,
                };
                await bot.sendMessage(chatId, "You've used all your points.",options);
              }
            } else {
              const btn1 = {
                text: 'Buy Subscription.',
                url: BuySubscription
              };
              const btn2 = {
                text: 'Prices.',
                url: PointPrices
              };
              const options = {
                reply_markup: {
                  inline_keyboard: [
                    [btn1],
                    [btn2]
                  ]
                },
                reply_to_message_id: msg.message_id,
              };
              await bot.sendMessage(chatId, 'Your subscription has Expired.',options);
            
            }
            
            await cliente.close();
          } else {
            await cliente.close();
            await bot.sendMessage(chatId, 'Check your subscription using the "/get" command.', {reply_to_message_id: msg.message_id});
          }
        } else {
          //console.log();
          //await bot.sendMessage(chatId, 'No se ha detectado ningún enlace.', {reply_to_message_id: msg.message_id});
        }
      } else {
        const btnText = '🤖 Ninja Group 🥷';
        const btnUrl = Group;
        const btn = {
          text: btnText,
          url: btnUrl
        };
        const btn1 = {
          text: 'Admin 🥷',
          url: BuySubscription
        };
        const options = {
          reply_markup: {
            inline_keyboard: [
              [btn,btn1]
            ]
          },
          reply_to_message_id: msg.message_id,
        };
        await bot.sendMessage(chatId, 'Join the group to get started or contact the Administrator.', options);
      }
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
});
bot.onText(/\/start/, async (msg) => { // Command /start 
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      const btnText = '🤖 Ninja Group 🥷';
      const btnUrl = Group;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const btn1 = {
        text: 'Admin 🥷',
        url: BuySubscription
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn,btn1]
          ]
        },
        reply_to_message_id: msg.message_id,
      };
      await bot.sendMessage(chatId, 'Join the group to get started or contact the Administrator.', options);
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
});
