import * as db from '../repository/consultaRepository.js'
import jwt from 'jsonwebtoken';
import {Router} from "express";
const endpoints = Router();


endpoints.post('/login', async (req, res) => {
    const info = req.body; 

    if (!info.email || !info.senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const usuario = await db.verificarLogin(info);

        if (!usuario) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        
        const token = jwt.sign({ id: usuario.id_login }, process.env.JWT_SECRET);

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao realizar o login:', error);
        return res.status(500).json({ message: 'Erro ao realizar o login.' });
    }
});
endpoints.get('/consultasPassadas', async (req,resp) => {


    try {
        
            let registros = await db.consultarConsultasPassadas();
            resp.send(registros)

    }
     catch (err) {
        
        resp.status(400).send({
            message:'erro ao consultar pacientes',
            erro: err.message
        })
    }
})

endpoints.get('/consultasFuturas', async (req,resp) => {


    try {
        
            let registros = await db.consultarConsultasFuturas();
            resp.send(registros)

    }
     catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})

endpoints.get('/consultasCpf/:cpf', async (req,resp) => {

    let cpf = req.params.cpf
    try {
        
            let registros = await db.consultarConsultasCpf(cpf);
            resp.send(registros)

    }
     catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})


endpoints.post('/autocadastro', async (req,resp) => {


    try {
        
            let cadastro = req.body;

            let id = await db.inserirAutoCadastro(cadastro);

            resp.send({
                Confirmação: "Consulta agendada!",
                pacienteId: id
            })


    }
     catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})

endpoints.put('/consultas/:id', async (req,resp) => {


    try {
        
            let id = req.params.id;
            let consulta=req.body;

            let linhasAfetadas=await db.alterarCarros(id,consulta);
            if(linhasAfetadas==0){
                resp.status(404).send({erro:' nenhum registro encontrado'})
                
            }
            else(resp.send('Consulta concluida!'))

           

    }
     catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})


endpoints.post('/financeiro', async (req, resp) => {
    let financeiro = req.body; 

    try {
       
        let registros = await db.consultarfinanceiro(financeiro);
        
        resp.send(registros);

    
    } catch (err) {
        
        resp.status(400).send({
            erro: err.message
        });
    }
});

endpoints.post('/agenda', async (req,resp) => {


    try {
        
            let info = req.body;

            let id = await db.inserirAgenda(info);

            resp.send({
                agendaId: id
            })


    }
     catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})


endpoints.post('/consultas', async (req,resp) => {


    try {
        
            let info = req.body;

            let id = await db.criarConsultas(info);

            resp.send({
                consultaId: id
            })


    }
     catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})


endpoints.get('/agenda/consultas', (req, resp) => {
    try {
        let resposta = db.consultarConsultasCpf()

        resp.send(resposta)
    } catch (error) {
        
    }
})



export default endpoints;