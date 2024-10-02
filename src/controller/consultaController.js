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
      
     
        return res.status(200).send({ token });
        
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao realizar o login:', error);
        return res.status(404).json({ message: 'Erro ao realizar o login.' });
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
    console.log(cpf)
    try {
        
            let registros = await db.consultarConsultasCpf(`${cpf}%`);
            resp.send(registros)

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



function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
  
    if (cpf.length !== 11) return false;
  
    if (/^(\d)\1+$/.test(cpf)) return false;
  
    const calcularDigito = (base) => {
      let soma = 0;
      for (let i = 0; i < base.length; i++) {
        soma += base[i] * (base.length + 1 - i);
      }
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };
  
    const primeiroDigito = calcularDigito(cpf.slice(0, 9));
    if (primeiroDigito !== parseInt(cpf[9], 10)) return false;
  
    const segundoDigito = calcularDigito(cpf.slice(0, 10));
    if (segundoDigito !== parseInt(cpf[10], 10)) return false;
  
    return true;
  }

endpoints.post('/verificarConsulta', async (req, res) => {
    const { cpf } = req.body;


    if (!validarCPF(cpf)) {
        return res.status(400).json({ message: 'CPF inválido.' });
    }

    try {
        const consulta = await db.verificarConsultaPorCPF(cpf);

        if (!consulta) {
            return res.status(404).json({ message: 'Nenhuma consulta encontrada para este CPF.' });
        }

        return res.status(200).json({ existe: 'Voce já possui uma consulta agendada' });
    } catch (error) {
        console.error('Erro ao verificar a consulta:', error);
        return res.status(500).json({ message: 'Erro ao verificar a consulta.' });
    }
});


endpoints.post('/verificar-cpf', async (req, res) => {
    const { cpf } = req.body;


    try {
        const existe = await verificarCPFExistente(cpf);
        return res.status(200).json({ existe });
    } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        return res.status(500).json({ message: 'Erro ao verificar CPF.' });
    }
});

export default endpoints;