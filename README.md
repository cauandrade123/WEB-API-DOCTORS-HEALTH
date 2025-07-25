# 🏥 Backend - Sistema de Clínica Médica

Este é o backend de um sistema completo de gerenciamento para clínicas médicas, com suporte a múltiplas clínicas, múltiplos usuários e teleconsultas.

---

## 🚀 Funcionalidades

- ✅ Cadastro e gerenciamento de pacientes
- ✅ Agendamento de consultas (presencial ou teleconsulta)
- ✅ Geração de laudos médicos em PDF
- ✅ Painel administrativo
- ✅ Dashboard financeiro (gráficos de receita mensal)
- ✅ Notificações automáticas por email (Nodemailer)
- ✅ Mapa da clínica via API
- ✅ Chatbot simples para dúvidas
- ✅ Suporte a multiusuário e multiclínica
- ✅ Autenticação via JWT

---

## 🧱 Arquitetura

O backend segue a arquitetura em camadas:



- `Controllers`: lidam com as requisições HTTP
- `Services`: lógica de negócio
- `Repositories`: acesso ao banco de dados
- `Middlewares`: autenticação, permissões, etc.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js + Express**
- **MySQL**
- **JWT para autenticação**
- **Nodemailer para envio de emails**
- **PDFKit para geração de laudos**
- **Chart.js  (via API de frontend)**
- **Jitsi Meet (integração para teleconsulta)**
- **Leaflet**
- **Arquitetura em camadas (MVC + Services)**

---

## 📦 Como rodar o projeto

### 🔧 Pré-requisitos

- Node.js v18+
- MySQL instalado e rodando
- .env configurado

### 📥 Clonar o repositório

```bash
git clone https://github.com/cauandrade123/WEB-API-DOCTOR-S-HEALTH.git



