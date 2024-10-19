import nodemailer from 'nodemailer';
import { Router } from 'express';

const endpoints = Router();


endpoints.post('/enviar', async (req, resp) => {
  const { nome, email, data, horario } = req.body
  console.log (nome, email, data, horario)

  try {
    const transportador = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'doctorshealthclinica@gmail.com',
        pass: 'fjyr zxdj rlss frou',
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
      rateLimit: 5,
      socketTimeout: 5000,
    });

    const opcoesEmail = {
      from: 'doctorshealthclinica@gmail.com',
      to: email,
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
      color: #333;
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
      <li><strong>Local:</strong> Doctor's Health, Rua Astolfo Vila, 389.</li>
    </ul>
    <p>Por favor, chegue com 15 minutos de antecedência e traga seus documentos de identificação e exames prévios, se houver.</p>
    <p>Se precisar cancelar ou reagendar, entre em contato conosco pelo telefone <strong>(11) 98125-6503</strong> ou responda este email.</p>
    <div class="footer">
      <p>Clínica Geral Dr. João Silva - Rua da Saúde, 123, Centro</p>
      <p>Telefone: (11) 98125-6503
       Email: doctorshealthclinica@gmail.com</p>
    </div>
  </div>
</body>
</html>`
    };


    await transportador.sendMail(opcoesEmail);
    resp.status(200).json({ mensagem: 'Email enviado com sucesso.' });
  } catch (error) {
    console.error('Erro ao enviar o email:', error);
    resp.status(500).json({ mensagem: 'Erro ao enviar o email.' });
  }
});





endpoints.post('/enviar-call', async (req, resp) => {
  const { nome, link, email } = req.body
  console.log (nome, link, email)

  try {
    const transportador = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'doctorshealthclinica@gmail.com',
        pass: 'fjyr zxdj rlss frou',
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
      rateLimit: 5,
      socketTimeout: 5000,
    });

    const opcoesEmail = {
      from: 'doctorshealthclinica@gmail.com',
      to: email,
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
      color: #333;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .header img {
      max-width: 50px;
      margin-bottom: 10px;
    }
    .header h2 {
      margin: 0;
      font-size: 20px;
      color: #f4f4f4;
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
    .link-container {
      text-align: center;
      margin-top: 20px;
    }
    .link-consulta {
      display: inline-block;
      background-color: #0B9DEB;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: bold;
      text-decoration: none;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    .link-consulta:hover {
      background-color: #097bb5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://i.ibb.co/02hWXRb/logo3-removebg-preview-5.png" alt="Logo da Clínica">
      <h2>Clínica Geral Dr. João Silva</h2>
    </div>
    <h1>Acesse sua Consulta Online</h1>
    <p>Caro(a) ${nome},</p>
    <p>Estamos enviando este e-mail para informar que sua consulta está agendada.</p>
    <p>Para acessar sua consulta online, clique no botão abaixo:</p>
    <div class="link-container">
      <a class="link-consulta" href="${link}">Acesse por aqui!</a>
    </div>
    <div class="footer">
      <p>Clínica Geral Dr. João Silva - Rua da Saúde, 123, Centro</p>
      <p>Telefone: (11) 98125-6503</p>
    </div>
  </div>
</body>
</html>
`
    };


    await transportador.sendMail(opcoesEmail);
    resp.status(200).json({ mensagem: 'Email enviado com sucesso.' });
  } catch (error) {
    console.error('Erro ao enviar o email:', error);
    resp.status(500).json({ mensagem: 'Erro ao enviar o email.' });
  }
});

export default endpoints;
