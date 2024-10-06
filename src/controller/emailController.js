// @ts-nocheck
import { Router } from "express";

const endpoints  = Router()
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_CAUA,
      pass: process.env.EMAIL_PWD,
    },
    logger: true,  // Ativa o log
    debug: true,   // Ativa o modo de depuração
  });
  
  // Verificar se o transporte está correto
  transporter.verify((error, success) => {
    if (error) {
      console.log('Erro no transporte do e-mail:', error);
    } else {
      console.log('Transporte de e-mail configurado corretamente:', success);
    }
  });
  
  endpoints.post('/enviar/email', (req, resp) => {
    const { email, data, nome, horario } = req.body;
  
    if (!email && !nome && !data && !horario) {
      return resp.status(400).send('Email não fornecido');
    }
  
    const mailOptions = {
      from: process.env.EMAIL_CAUA,
      to: email, // Email do destinatário
      subject: 'Consulta agendada',
      html: `<!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Consulta - Dr. João Silva</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333
      }
  
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
  
      h1 {
        color: #0B9DEB;
        text-align: center;
      }
  
      p {
        font-size: 16px;
        color: #333;
        line-height: 1.5;
      }
  
      .header {
        background-color: #0B9DEB;
        padding: 20px;
        border-radius: 10px 10px 0 0;
      }
  
      .header img {
        display: block;
        margin: 0 auto;
        max-width: 150px;
      }
  
      .header h2 {
        color: #FFFFFF;
        text-align: center;
        margin-top: 10px;
      }
  
      .button {
        display: block;
        width: 100%;
        text-align: center;
        background-color: #0B9DEB;
        color: #fff;
        text-decoration: none;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
        font-size: 18px;
      }
  
      .footer {
        margin-top: 30px;
        text-align: center;
        color: #999;
        font-size: 14px;
      }
  
      .footer a {
        color: #0B9DEB;
        text-decoration: none;
      }
  
      .social-icons {
        text-align: center;
        margin-top: 20px;
      }
  
      .social-icons img {
        margin: 0 10px;
        width: 24px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://i.ibb.co/02hWXRb/logo3-removebg-preview-5.png" alt="Logo da Clínica">
        <h2>Clínica Geral Dr. João Silva</h2>
      </div>
      <h1>Confirmação de Consulta</h1>
      <p>Caro(a) ${nome},</p>
      <p>Estamos enviando esta mensagem para confirmar que sua consulta foi agendada com sucesso!</p>
      <p><strong>Detalhes da Consulta:</strong></p>
      <ul>
        <li><strong>Médico:</strong> Dr. João Silva</li>
        <li><strong>Data:</strong> ${data}</li>
        <li><strong>Horário:</strong> ${horario}</li>
        <li><strong>Local:</strong> Doctor's Health, Rua Astolfo Vila , 389.</li>
      </ul>
      <p>Por favor, chegue com 15 minutos de antecedência e traga seus documentos de identificação e exames prévios, se houver.</p>
      <p>Se precisar cancelar ou reagendar, entre em contato conosco pelo telefone <strong>(11) 1234-5678</strong> ou responda este email.</p>
      <a href="#" class="button">Ver Detalhes da Consulta</a>
    </div>
  </body>
  </html>`

    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Erro ao enviar o e-mail:', error);
        resp.status(500).send('Erro ao enviar o e-mail');
      } else {
        console.log('E-mail enviado: ' + info.response);
        resp.status(200).send('E-mail enviado com sucesso');
      }
    });
  });
  





export default endpoints;