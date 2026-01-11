// @ts-nocheck
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import adicionarRotas from '../src/routes/rotas.js'

const servidor =  express()


servidor.use(cors())
servidor.use(express.json())


adicionarRotas(servidor)

const PORTA = process.env.PORTA || 3000;
app.listen(PORTA, () => {
  console.log(`Server running on port ${PORTA}`);
});

