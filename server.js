const app = require('express')()
const bodyParser = require('body-parser')
const logger = require('morgan')
const request = require('request')

const port = process.env.PORT || 3000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('*', (req, res) => {
  res.send('This is the Alpha version of the USSD Application for AdeM')
})

/*
const openvpnmanager = require('node-openvpn');

const opts = {
  host: 'localhost',
  port: 4000,
  timeout: 1500, //timeout for connection - optional, will default to 1500ms if undefined
  logpath: 'log.txt' //optional write openvpn console output to file, can be relative path or absolute
};/*
const auth = {
  user: '{{add user name}}',
  pass: '9c359ad1ebeec200',
};
const openvpn = openvpnmanager.connect(opts)


 openvpn.on('connected', () => {
   console.log("Connected to VPN successfully...");
 });
*/
app.post('*', (req, res) => {
  let {sessionId, serviceCode, phoneNumber, text} = req.body
  let clientID = ''
  let parClient = ''

  const result = request('https://localhost:4000/users/'.concat(phoneNumber.replace('+', '')), function (error, resp, body) {
      console.log(error)
      console.log(resp)
      //clientID = body.substring(body.indexOf(':', 1)+1, body.indexOf(',', body.indexOf(':', 1)+1));

    if (resp.statusCode == 200) {
        let txtCheck = text.split('*')

        if (text == '' || text.endsWith('*9')) {            
            // This is the first request. Note how we start the response with CON
            response = `CON Aguas de Maputo 
            
            1. Consulta de Facturas
            2. Pagamento de Facturas
            3. Compra de Recargas Pré-pago
            4. Fornecimento de Leituras
            5. Serviços AdeM
            6. Promoções
            
            0. Sair`
      
            res.send(response)
        } else if (text == '1' || text.endsWith('*9*1')) {
            // Business logic for first level response
            response = `CON Consulta de Facturas:
      
            1. Factura Corrente
            2. Ultimas 5 Facturas em Aberto
            3. Saldo da dívida
            
            9. Voltar ao Menu Principal
            0. Sair`
      
            res.send(response)
          } else if (text == '1*1' || text.endsWith('*9*1*1')) {
            request('http://localhost:4000/invoices/1/'.concat(clientID), function (errorInv, resInv, bodyInv) {

                if (resInv.statusCode == 200) {
                    response = `END Factura Corrente
                    
                    `.concat(bodyInv)
                    res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END Factura corrente não está disponível.
                    Por favor, tente mais tarde.`

                    res.send(response)
                } else {

                }
            });    
        } else if (text == '1*1*2' || text.endsWith('*9*1*1*2')) {  
            //Fetch current Invoice for the user's ClientID
            response = `CON Introduza o código do cliente: 
            
            ` 
            res.send(response)   
        } else if (text.startsWith('1*1*1*') /*|| text.endsWith('*9*1*1*1')*/) {  
            //Fetch current Invoice for the user's ClientID
            clientID = text.substring(6, text.length);
            console.log(clientID);

            request('http://localhost:4000/invoices/1/'.concat(clientID), function (errorInv, resInv, bodyInv) {

                if (resInv.statusCode == 200) {
                    response = `END Factura Corrente
                    
                    `.concat(bodyInv)
                    res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END A factura corrente não está disponível.
                    Por favor, tente mais tarde.`

                    res.send(response)
                } else {

                }
            });    
        } else if (text == '1*2' || text.endsWith('*9*1*2')) {
            //Business logic for the second level response
            //Fetch Open Invoices for the ClientID
            request('http://localhost:4000/invoices/5/'.concat(clientID), function (errorInv, resInv, bodyInv) {
                const data = bodyInv

                if (resInv.statusCode == 200) {
                  response = `END Facturas em Aberto
                  
                  `.concat(bodyInv)
                  res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END Tem todas as Facturas regularizadas.
                    Obrigado!.`

                    res.send(response)
                } else {

                }
            });    
        } else if (text == '1*2*2' || text.endsWith('*9*1*2*2')) {  
            //Fetch current Invoice for the user's ClientID
            response = `CON Introduza o código do cliente: 
            
            ` 
            res.send(response)   
        } else if (text.startsWith('1*2*2*') /*|| text.endsWith('*9*1*2*2')*/) {  
            //Fetch current Invoice for the user's ClientID
            clientID = text.substring(6, text.length);
            console.log(clientID);
            
            request('http://localhost:4000/invoices/5/'.concat(clientID), function (errorInv, resInv, bodyInv) {

                if (resInv.statusCode == 200) {
                    response = `END Factura Corrente
                    
                    `.concat(bodyInv)
                    res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END Factura corrente não está disponível.
                    Por favor, tente mais tarde.`

                    res.send(response)
                } else {

                }
            });    
      } else if (text == '1*3' || text.endsWith('*9*1*3')) {
            //Business logic for the second level response
            //Fetch current Invoice for the user's ClientID
            request('http://localhost:4000/invoices/bal/'.concat(clientID), function (errorInv, resInv, bodyInv) {

                if (resInv.statusCode == 200) {
                    response = `END O seu saldo é de :                     
                    `.concat(bodyInv, '\n\rObrigado!')
                    res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END Ocorreu um erro com o seu pedido.
                    Por favor, tente mais tarde.`

                    res.send(response)
                } else {

                }
            });    
      } else if (text == '1*3*2' || text.endsWith('*9*1*3*2')) {  
            //Fetch current Invoice for the user's ClientID
            response = `CON Introduza o código do cliente: 
            
            ` 
            res.send(response)   
      } else if (text.startsWith('1*3*2*') /*|| text.endsWith('*9*1*3*2')*/) {  
            //Fetch current Invoice for the user's ClientID
            clientID = text.substring(6, text.length);
            request('http://localhost:4000/invoices/bal/'.concat(clientID), function (errorInv, resInv, bodyInv) {

                if (resInv.statusCode == 200) {
                    response = `END O saldo do cliente `.concat(clientID, ' é: \n\r', bodyInv, '\n\rObrigado!')
                    res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END Ocorreu um erro com o seu pedido.
                    Por favor, tente mais tarde.`

                    res.send(response)
                } else {

                }
            });    
      } else if (text == '2' || text.endsWith('*9*2')) {
            // Business logic for first level response
            response = `CON Pagamento de Facturas:
                
            1. M-Pesa
            2. m-Kesh
            3. e-Mola
            4. Ponto24
            6. IZI
            7. Quiq Mola
            
            9. Voltar ao Menu Principal
            0. Sair`
            
            res.send(response)
        } else if (text == '3' || text.endsWith('*9*3')) {
            // Business logic for first level response
            response = `CON Compra de Recargas:
                
            1. M-Pesa
            2. m-Kesh
            3. e-Mola
            4. Ponto24
            6. IZI
            7. Quiq Mola
            
            9. Voltar
            0. Sair`

            res.send(response)
        } else if (text == '4' || text.endsWith('*9*4')) {
          // Business logic for first level response
          response = `CON Fornecimento de Leituras:
    
          1. Meu contador
          2. Outro contador
          
          9. Voltar
          0. Sair`
          res.send(response)
        } else if (text == '4*1' || text.endsWith('*9*4*1')) {
          response = `CON Introduza o valor da leitura:
          `
          res.send(response)
        } else if (text.startsWith('4*1*') && text.indexOf('*', 4) == -1) {          
            // Business logic for first level response
            let value = text.substring(4, text.length);
            let options = {
                'method': 'POST',
                'url': 'http://localhost:4000/readings/',
                'headers': {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                  'client': clientID,
                  'value': value,
                  'datetime': new Date().toISOString().slice(0,10)
                  //'entity': entityID 
                }
            };

            request(options, function(errL, resL, bodyL){
                if (!errL && resL.statusCode == 200) {
                    response = `END Leitura submetida com sucesso.`
                } else {
                    response = `END `.concat(errL)
                    console.log(body)
                }

                res.send(response)
            });

              //res.send(response)
        } else if (text == '4*2' && txtCheck.length == 2/*|| text.endsWith('*9*4*2')*/) {
          // Business logic for first level response
          response = `CON Introduza o código do cliente:
          `
          res.send(response)
        } else if (text.startsWith('4*2*') && txtCheck.length == 3 /*|| text.endsWith('*9*4*2*2')*/) {
            response = `CON Introduza o valor da leitura:
            `
            res.send(response)
        } else if (text.startsWith('4*2*')  && txtCheck.length == 4/*.concat(parClient), '*'), reading*/) {
            // Business logic for first level response
            console.log(text)
            clientID = txtCheck[2]; //text.substring(4, text.indexOf('*', 5));
            let value = txtCheck[3]; //text.substring(4, text.length);
            let options = {
                'method': 'POST',
                'url': 'http://localhost:4000/readings/',
                'headers': {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                  'client': clientID,
                  'value': value,
                  'datetime': new Date().toISOString().slice(0,10)
                  //'entity': entityID 
                }
            };
          
            request(options, function(errL, resL, bodyL){
              if (!errL && resL.statusCode == 200) {
                  response = `END Leitura submetida com sucesso.`
              } else {
                  response = `END `.concat(errL)
                  console.log(body)
              }

              res.send(response)
          });
          
          //res.send(response)
        } else if (text == '5' || text.endsWith('*9*5')) {
            // Business logic for first level response
            response = `CON Serviços AdeM:
                
            1. Custo de Ligações
            2. Requisitos para novas ligações
            3. Reclamações
            
            9. Voltar
            0. Sair`

            res.send(response)
        } else if (text == '6' || text.endsWith('*9*6')) {
            // Business logic for first level response
            response = `CON Promoções:
                
            1. Consulta de cupões
            2. Ver última extracção
            
            9. Voltar
            0. Sair`
            res.send(response)
        } else if (text == '6*1' || text.endsWith('*9*6*1')) {
        /*    request('http://192.168.30.248/api/getCoupon?clientNumber='.concat(clientID), function (errorInv, resInv, bodyInv) {

                if (resInv.statusCode == 200) {
                  let apiResult = JSON.parse(bodyInv)
                  let jsonResult = ''
                  
                  for (i = 0; i < apiResult.data.length; i++) {
                    if(i == 0) {
                      jsonResult += "Cliente: " + apiResult.data[i]["cliente"] + '\n\r';
                    }

                    jsonResult += "Data: ".concat(apiResult.data[i]["data_registo_externo"], ' - Cupão: ', apiResult.data[i]["id"], '\n\r');
                  }
                    response = `END Consulta de Cupões
                    
                    `.concat(jsonResult)
                    res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END Não tem cupões disponíveis.
                    Por favor, tente mais tarde.`

                    res.send(response)
                } else {

                }
            }); */
            request('http://localhost:4000/promotions/'.concat(clientID), function (errorInv, resInv, bodyInv) {
                res.send(bodyInv)
                /*if (resInv.statusCode == 200) {
                    response = `END O saldo do cliente `.concat(clientID, ' é: \n\r', bodyInv, '\n\rObrigado!')
                    res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END Ocorreu um erro com o seu pedido.
                    Por favor, tente mais tarde.`

                    res.send(response)
                } else {

                }*/
            });    

        } else if (text == '6*2' || text.endsWith('*9*6*2')) {
            /*request('http://192.168.30.248/api/getWinCoupon', function (errorInv, resInv, bodyInv) {

                if (resInv.statusCode == 200) {
                  //let i = 0
                  let apiResult = JSON.parse(bodyInv)
                  let jsonResult = ''
                  
                  for (i = 0; i < apiResult.data.length; i++) {
                    if(i == 0) {
                      jsonResult += "Data do Sorteio: " + apiResult.data[i]["data_extracao"] + '\n\r';
                    }

                    jsonResult += "Prémio ".concat(apiResult.data[i]["numero_premio"], ' - Cupão: ', apiResult.data[i]["cupaos_id"]) + "\n\r";
                  }

                  response = `END Resultado de Sorteio                    
                    `.concat(jsonResult)
                    res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END Resultados da extração não estão disponíveis.
                    Por favor, tente mais tarde.`

                    res.send(response)
                } else {

                }
            });*/   
            request('http://localhost:4000/promotions/', function (errorInv, resInv, bodyInv) {
                res.send(bodyInv)
            /*    if (resInv.statusCode == 200) {
                    response = `END O saldo do cliente `.concat(clientID, ' é: \n\r', bodyInv, '\n\rObrigado!')
                    res.send(response)
                } else if (resInv.statusCode == 404) {
                    response = `END Ocorreu um erro com o seu pedido.
                    Por favor, tente mais tarde.`

                    res.send(response)
                } else {

                }*/
            });    

        } else if (text.endsWith('*0')) {
            //Business logic for the second level response
            response = `END Obrigado por usar o nosso serviço! 
            Volte sempre.`
        
            res.send(response)
      } else if (text == '2*1' || text.endsWith('*9*2*1')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '2*2' || text.endsWith('*9*2*2')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '2*3' || text.endsWith('*9*2*3')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '2*4' || text.endsWith('*9*2*4')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '2*5' || text.endsWith('*9*2*5')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '2*6' || text.endsWith('*9*2*6')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '2*7' || text.endsWith('*9*2*7')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '3*1' || text.endsWith('*9*3*1')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '3*2' || text.endsWith('*9*3*2')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '3*3' || text.endsWith('*9*3*3')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '3*4' || text.endsWith('*9*3*4')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '3*5' || text.endsWith('*9*3*5')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '3*6' || text.endsWith('*9*3*6')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '3*7' || text.endsWith('*9*3*7')) {
            //Business logic for the second level response
            response = `END O serviço selecionado ainda não está disponível.
            Por favor, tente mais tarde.`
        
            res.send(response)
      } else if (text == '5*1' || text.endsWith('*9*5*1')) {
            //Business logic for the second level response
            response = `END Obrigado! Em breve receberá uma SMS com a informação solicitada.`
        
            res.send(response)
      } else if (text == '5*2' || text.endsWith('*9*5*2')) {
            //Business logic for the second level response
            response = `CON Selecione uma das opções:
            
            1. Domésticos
            2. Comércio Serviços
            
            9. Voltar ao Menu Principal
            0. Sair`
            res.send(response)
      } else if (text == '5*3' || text.endsWith('*9*5*3')) {
          //Business logic for the second level response
          response = `CON Reclamações:
            
          1. Fugas na rede
          2. Fugas no contador
          3. Roubo de água
          4. Consumos altos
          5. Fraca pressão
          6. Falta de água
          7. Roubo de contador
          8. Outras
          
          9. Voltar ao Menu Principal
          0. Sair`
      
          res.send(response)
      } else if (text == '5*3*1' || text.endsWith('*9*5*3*1')) {
          //Business logic for the second level response
          response = `END Obrigado.
          A AdeM entrará em contacto consigo para mais esclarecimentos.`   

          res.send(response)
      } else if (text == '5*3*2' || text.endsWith('*9*5*3*2')) {        
          //Business logic for the second level response
          response = `END Obrigado.
          A AdeM entrará em contacto consigo para mais esclarecimentos.`   
             
          res.send(response)
      } else if (text == '5*3*3' || text.endsWith('*9*5*3*3')) {
          //Business logic for the second level response
          response = `END Obrigado.
          A AdeM entrará em contacto consigo para mais esclarecimentos.`   
             
          res.send(response)
      } else if (text == '5*3*4' || text.endsWith('*9*5*3*4')) {
          //Business logic for the second level response
          response = `END Obrigado.
          A AdeM entrará em contacto consigo para mais esclarecimentos.`   
             
          res.send(response)
        } else if (text == '5*3*5' || text.endsWith('*9*5*3*1')) {
          //Business logic for the second level response
          response = `END Obrigado.
          A AdeM entrará em contacto consigo para mais esclarecimentos.`   

          res.send(response)
      } else if (text == '5*3*6' || text.endsWith('*9*5*3*2')) {        
          //Business logic for the second level response
          response = `END Obrigado.
          A AdeM entrará em contacto consigo para mais esclarecimentos.`   
             
          res.send(response)
      } else if (text == '5*3*7' || text.endsWith('*9*5*3*3')) {
          //Business logic for the second level response
          response = `END Obrigado.
          A AdeM entrará em contacto consigo para mais esclarecimentos.`   
             
          res.send(response)
      } else if (text == '5*3*8' || text.endsWith('*9*5*3*4')) {
          //Business logic for the second level response
          response = `END Obrigado.
          A AdeM entrará em contacto consigo para mais esclarecimentos.`   
             
          res.send(response)
      } else {
        res.status(400).send('Bad request!')
      }  
    } else if (resp.statusCode == 404) {
        let textCheck = text.split('*')
        let parEntity = textCheck[1] 
        let parClient = textCheck[2] 

        console.log(text + ' / ' + textCheck.length)
        console.log(parEntity + ' - ' + parClient)

        if (text == '') {
            response = `CON O Número ` + phoneNumber + ` não está registado!
            Pretende registar-se?
            
            1. Sim
            2. Não`
      
            res.send(response)
        } else if (text == '1') {
            response = `CON Introduza o Código da ENTIDADE (tal como vem na Factura): 
            `    
            res.send(response)
        } else if (text.startsWith('1*') && text.indexOf('*', 3) == -1) {
            entityID = text.substring(text.indexOf('*', 0)+1, text.length);    
            response = `CON Entidade:  ` + entityID + `
            Introduza o Código de CLIENTE (tal como vem na Factura): 
            `
            res.send(response)
        } else if (text == '1*'.concat(parEntity, '*', parClient) && (textCheck.length == 3)) {
            response = `CON Entidade: ` + parEntity + `
            Cliente: ` + parClient + `
            
            1. Confirmar registo
            0. Sair`
    
            res.send(response) 
        } else if (text == '1*'.concat(parEntity, '*', parClient, '*1') && (textCheck.length == 4)) {
            entityID = parEntity; 
            clientID = parClient; 

            console.log('Cliente: ' + parClient);
            console.log('Entidade: ' + parEntity);
            let bitFound = 0;

            request('http://localhost:4000/clients/'.concat(clientID, '/', entityID), function (errCli, resCli, bodyCli) {
                console.log(resCli.statusCode);

                if (!errCli && resCli.statusCode == 200) {
                    let options = {
                        'method': 'POST',
                        'url': 'http://localhost:4000/users/',
                        'headers': {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        form: {
                          'number': phoneNumber.replace('+', ''),
                          'client': clientID,
                          'entity': entityID 
                        }
                    };
    
                    request(options, function(errP, resP, bodyP){
                        if (!errP && resP.statusCode == 200) {
                            response = `END Registo efectuado com sucesso.`
                            //console.log(bodyP)
                        } else {
                            response = `END `.concat(errP)
                            //console.log(bodyP)
                        }

                        res.send(response)         
                    });
                } else {
                    response = `END Erro:
                    `.concat('Cliente ', clientID, ' com Entidade ', entityID, ' não existe!')

                    res.send(response)
                }
            });

            
        } else if(text.endsWith('*0')) {
            response = `END Registo cancelado pelo utilizador.`
            res.send(response)
        } else if(text == '2') {
          response = `END O acesso só é permitido a clientes registados.
          `
          res.send(response)
        } else {
            response = `END Ocorreu um erro ao processar o seu pedido.
            Por favor, tente mais tarde.`
            //res.status(400).send('Bad request!')
            res.send(response)
        }   

      } else {
        response = `END Ocorreu um erro ao processar o seu pedido.
        Por favor, tente mais tarde.`
        //res.status(400).send('Bad request!')
        res.send(response)
  }
          
    return res.statusCode
  });
/*
if (res.statusCode == 200) {
} else if (res.statusCode == 404) {

} else {
  res.status(400).send('Ocorreu um erro. Por favor, tente mais tarde!')
}
//}
*/
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})