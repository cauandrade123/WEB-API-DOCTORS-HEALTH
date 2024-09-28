import con from "./connection.js";


export async function verificarLogin(email, senha) {

    const comando= 'SELECT * FROM tb_login WHERE email = ?'
    try {
        
        const [verificacao] = await con.query(comando, [email]);

       
        if (verificacao.length === 0) {
            return null; 
        }

        const usuario = verificacao[0];

       
        if (senha !== usuario.senha) {
            return null; 
        }

        return usuario; 
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        throw new Error('Erro ao verificar login.');
    } finally {
        await con.release();
    }
};



export async function inserirAutoCadastro(cadastro){

const comando = `
INSERT INTO tb_auto_cadastro (nome, nascimento, rg, cpf, metodo_pagamento, telefone, id_agenda) 
VALUES (?, ?, ?, ?, ?, ?, ?);

                    `

let resposta= await con.query(comando, [cadastro.nome, cadastro.nascimento, cadastro.rg, cadastro.cpf, cadastro.pagamento, cadastro.telefone, cadastro.id_agenda])
let info = resposta[0];

return info.insertId;

}

export async function consultarConsultasPassadas(){

    const comando = `
    SELECT 
	tb_agenda.dia,
    tb_agenda.horario,
   tb_auto_cadastro.nome,
	tb_auto_cadastro.rg,
    tb_auto_cadastro.nascimento,
    tb_auto_cadastro.cpf,
    consulta.tratamento,
    consulta.condicao,
    consulta.medicacao,
    consulta.preco
FROM 
    consulta
JOIN 
    tb_agenda ON consulta.id_agenda = tb_agenda.id_agenda
JOIN 
    tb_auto_cadastro ON consulta.id_paciente = tb_auto_cadastro.id_paciente
WHERE 
    CONCAT(tb_agenda.dia, ' ', tb_agenda.horario) < NOW()
ORDER BY 
    tb_agenda.dia DESC, tb_agenda.horario DESC;
    `

    let resposta= await con.query(comando)
    let registros = resposta[0];

    return registros
}

export async function consultarConsultasFuturas(){

    const comando = `
     SELECT 
	tb_agenda.dia,
    tb_agenda.horario,
   tb_auto_cadastro.nome,
	tb_auto_cadastro.rg,
    tb_auto_cadastro.nascimento,
    tb_auto_cadastro.cpf,
    consulta.tratamento,
    consulta.condicao,
    consulta.medicacao,
    consulta.preco
FROM 
    consulta
JOIN 
    tb_agenda ON consulta.id_agenda = tb_agenda.id_agenda
JOIN 
    tb_auto_cadastro ON consulta.id_paciente = tb_auto_cadastro.id_paciente
WHERE 
    CONCAT(tb_agenda.dia, ' ', tb_agenda.horario) > NOW()
ORDER BY 
    tb_agenda.dia DESC, tb_agenda.horario asc;
    `

    let resposta= await con.query(comando)
    let registros = resposta[0];

    return registros
}


export async function consultarConsultasCpf(cpf){

    const comando = `
     SELECT 
	tb_agenda.dia,
    tb_agenda.horario,
   tb_auto_cadastro.nome,
	tb_auto_cadastro.rg,
    tb_auto_cadastro.nascimento,
    tb_auto_cadastro.cpf,
    consulta.tratamento,
    consulta.condicao,
    consulta.medicacao,
    consulta.preco
FROM 
    consulta
JOIN 
    tb_agenda ON consulta.id_agenda = tb_agenda.id_agenda
JOIN 
    tb_auto_cadastro ON consulta.id_paciente = tb_auto_cadastro.id_paciente
WHERE 
  tb_auto_cadastro.cpf = ?;
    `

    let resposta= await con.query(comando, [cpf])
    let registros = resposta[0];

    return registros
}





export async function alterarConsulta(id,consulta){

    const comando = `
    update consulta set
    tratamento =?,
    condicao =?,
    medicacao =?,
    preco =?,

 where id_consulta = ?;
    `

    let resposta= await con.query(comando, [consulta.tratamento, consulta.condicao, consulta.medicacao, consulta.preco, id])
    let info = resposta[0];

    return info.affectedRows;

}

export async function consultarfinanceiro(mes, ano){

    const comando = `
SELECT 
    MONTH(tb_agenda.dia) AS mes,
    YEAR(tb_agenda.dia) AS ano,
    SUM(consulta.preco) AS valor_total
FROM 
    consulta
JOIN 
    tb_agenda ON consulta.id_agenda = tb_agenda.id_agenda
WHERE 
    MONTH(tb_agenda.dia) = ? AND  
    YEAR(tb_agenda.dia) = ?        
GROUP BY 
    ano, mes;
    `

    let resposta= await con.query(comando[mes, ano])
    let registros = resposta[0];

    return registros
}


export async function inserirAgenda(info){

    const comando = `
    INSERT INTO tb_agenda (data, horario) 
    VALUES (?, ?);
    
                        `
    
    let resposta= await con.query(comando, [info.data, info.horario])
    let cadastro = resposta[0];
    
    return cadastro.insertId;
    
    }



