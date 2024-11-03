import * as db from '../repository/consultaRepository.js'
import jwt from 'jsonwebtoken';
import authenticateToken from '../utils/jwt.js'
import {Router} from "express";

const endpoints = Router();



endpoints.get ('/consultaFinalizar/:cpf', async (req, resp) => {
    let cpf = req.params.value


    try {
        
        let resposta = await db.consultaFinalizar(cpf)

        if (resposta == true) {
           
        } else if (resposta == false) {
            
        }

        resp.send(resposta)

    } catch (error) {
        resp.status(404).send({
            error: error
        })
    }
})

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
        console.log(err);
        resp.status(400).send({
            erro: err.message
        })
    }
})

endpoints.get('/consultasCpf/:cpf', async (req,resp) => {
    
    let cpf = req.params.cpf
    try {
        
            let registros = await db.consultarConsultasCpf(`${cpf}%`);
            resp.send(registros)
        
    }
    catch (err) {
        
        resp.status(400).send({
            erro: err.message
        })
    }
})


endpoints.post('/autocadastro', async (req,resp) => {
    
    let cadastro = req.body;
    
    try {
        
        let id = await db.inserirAutoCadastro(cadastro);
        
         const token = jwt.sign({ id }, process.env.JWT_SECRET2, { expiresIn: '5h' });

        resp.send({
            confirmação: "Consulta agendada!",
            pacienteId: id,
            token: token
        });
    } catch (err) {
        console.error('Erro ao cadastrar paciente:', err);
        resp.status(400).send({
            erro: err.message
        });
    }
});

endpoints.put('/consultas/:id', async (req,resp) => {
    
    
    try {
        
        let id = req.params.id;
        let consulta=req.body;
        console.log(consulta)
        
        let linhasAfetadas=await db.alterarConsulta(id,consulta);
        if(linhasAfetadas==0){
            resp.status(404).send({erro:' nenhum registro encontrado'})
            
        }
        else(resp.send('Consulta editada!'))
        
        
        
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




endpoints.get('/verificarconsulta/:cpf', async (req, res) => {
    let cpf = req.params.cpf;


    try {
        const consulta = await db.verificarConsultaPorCPF(cpf);

      
        if (consulta) {
            return res.status(200).json({
                message: 'Paciente já possui uma consulta agendada.',
                consulta: consulta,
                hasConsulta: true   
            });
        } else {
            return res.status(200).json({
                message: 'Nenhuma consulta encontrada para este CPF.',
                hasConsulta: false  
            });
        }
    } catch (error) {
        console.error('Erro ao verificar a consulta:', error);
        return res.status(500).json({ message: 'Erro ao verificar a consulta.' });
    }
});

endpoints.post('/verificar-cpf', async (req, res) => {
    const { cpf } = req.body;


    try {
        const existe = await db.verificarCPFExistente(cpf);
        return res.status(200).json({ existe });
    } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        return res.status(500).json({ message: 'Erro ao verificar CPF.' });
    }
});


endpoints.post('/verificar-telefone', async (req, res) => {
    const { telefone } = req.body;


    try {
        const existe = await db.verificarTelefoneExistente(telefone);
        return res.status(200).json({ existe });
    } catch (error) {
        console.error('Erro ao verificar telefone:', error);
        return res.status(500).json({ message: 'Erro ao verificar telefone.' });
    }
});



endpoints.post('/horarios-ocupados', async (req, res) => {
    const { data } = req.body;

    try {
        const horariosOcupados = await db.obterHorariosOcupados(data);

        return res.status(200).json({ horariosOcupados });
    } catch (error) {
        console.error('Erro ao obter horários ocupados:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }

});

endpoints.put('/finalizarConsulta/:cpf', async (req, resp) => {

    let cpf = req.params.cpf

    try {

        const resposta = await db.FinalizarConsulta(cpf)

        if(resposta > 0) {
        return resp.send({
            sucesso: 'Finalizada com sucesso'
        })
        }

    } catch (error) {
        console.log(error)
        resp.status(500).send({
            error: 'Algo está errado'
        })
    }

})

endpoints.get('/puxarfinanceiro/:ano', async (req, resp) => {
    try {

        const ano = parseInt(req.params.ano);

        let dados = await db.PuxarFinanceiro(ano);

        console.log(dados);
        resp.send(dados);
        
    } catch (error) {
        resp.status(400).send({
            erro: error.message
        });
    }
});





endpoints.get('/pegardata', async (req, resp) => {
    try {
        let consulta = await db.ConsultarData();
        resp.status(200).json(consulta);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        resp.status(500).send('Erro ao buscar dados do banco de dados');
    }
});


endpoints.post('/cadastrado', async (req,resp) => {
    
    let cadastro = req.body;
    
    try {
        
        let id = await db.cadastrado(cadastro);
        
        resp.send({
            confirmação: "Consulta agendada!",
            pacienteId: id
        });
    } catch (err) {
        console.error('Erro ao cadastrar paciente:', err);
        resp.status(400).send({
            erro: err.message
        });
    }
});



endpoints.get('/Id-do-paciente/:cpf', async (req,resp) => {
    let cpf = req.params.cpf; 

    try {
        
        const id_paciente = await db.obterIdPacientePorCPF(cpf);

        if (!id_paciente) {
            return resp.status(200).send({ message: 'Paciente não encontrado.' });
        }

        console.log(id_paciente)
        return resp.status(200).send({ id_paciente });
    } catch (error) {
        console.error('Erro ao obter o id_paciente:', error);
        return resp.status(500).json({ message: 'Erro no servidor ao buscar id_paciente.' });
    }
});



endpoints.delete('/remover/:titulo', async (req, resp) => {
    let deletarData = req.params.id_agenda

    let deletar = await db.deletarData(deletarData)
    
})

endpoints.get('/verfificarestadoFinalizadaAgenda/:id_agenda', async (req,resp) => {
try {
    let id = req.params.id_agenda

    let resposta = await db.verificarEstadoFinalizadaAgenda(id)

    resp.send(resposta)
    
} catch (error) {
    resp.status(400).send({
        error: error.message
    })
}
} ) 



endpoints.get('/MinhasConsultas',  authenticateToken, async  (req,resp) => {
    try {
        let id_paciente = req.user.id

        let consulta = await db.MinhasConsultas(id_paciente)

        resp.status(200).send(
            consulta
        )
    } catch (error) {
        
    }
})

export default endpoints;