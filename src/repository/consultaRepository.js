import con from "./connection.js";
import bcrypt from 'bcrypt';

export async function verificarLogin(info) {
    const comando = `
    SELECT * FROM tb_login WHERE email = ?;
    `;

    try {
        const [verificacao] = await con.query(comando, [info.email]);

        if (verificacao.length === 0) {
            return null; // Usuário não encontrado
        }

        const usuario = verificacao[0];

        // Comparar a senha fornecida com a senha armazenada (não hashada)
        if (info.senha !== usuario.senha) {
            return null; // Senha incorreta
        }

        return usuario; // Retorna o usuário caso o login seja bem-sucedido
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        throw new Error('Erro ao verificar login.'); // Lançar um erro genérico
    }
}





export async function inserirAutoCadastro(cadastro) {

    const comando = `
INSERT INTO tb_auto_cadastro (nome, nascimento, rg, cpf, metodo_pagamento, telefone, id_agenda) 
VALUES (?, ?, ?, ?, ?, ?, ?);

                    `

    let resposta = await con.query(comando, [cadastro.nome, cadastro.nascimento, cadastro.rg, cadastro.cpf, cadastro.metodo, cadastro.telefone, cadastro.id_agenda])
    let info = resposta[0];

    return info.insertId;

}

export async function consultarConsultasPassadas() {

    const comando = `
    SELECT 
	tb_agenda.dia_horario,
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

    let resposta = await con.query(comando)
    let registros = resposta[0];

    return registros
}

export async function consultarConsultasFuturas() {

    const comando = `
     SELECT 
	tb_agenda.dia_horario,
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

    let resposta = await con.query(comando)
    let registros = resposta[0];

    return registros
}


export async function consultarConsultasCpf(cpf) {

    const comando = `
     SELECT 
	tb_agenda.dia_horario,
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

    let resposta = await con.query(comando, [cpf])
    let registros = resposta[0];

    return registros
}





export async function alterarConsulta(id, consulta) {

    const comando = `
    update consulta set

    tratamento =?,
    condicao =?,
    medicacao =?,
    preco =?,

 where id_consulta = ?;
    `

    let resposta = await con.query(comando, [consulta.tratamento, consulta.condicao, consulta.medicacao, consulta.preco, id])
    let info = resposta[0];

    return info.affectedRows;

}

export async function consultarfinanceiro(periodo) {
    const comando = `
        SELECT 
            MONTH(tb_agenda.dia_horario) AS mes,
            YEAR(tb_agenda.dia_horario) AS ano,
            SUM(consulta.preco) AS valor_total
        FROM 
            consulta
        JOIN 
            tb_agenda ON consulta.id_agenda = tb_agenda.id_agenda
        WHERE 
            MONTH(tb_agenda.dia_horario) = ? AND  
            YEAR(tb_agenda.dia_horario) = ?       
        GROUP BY 
            ano, mes;
    `;


    let resposta = await con.query(comando, [periodo.mes, periodo.ano]);
    let registros = resposta[0];

    return registros;
}



export async function inserirAgenda(info) {

    const dataHora = `${info.dia} ${info.hora}`; // Ex: '2024-09-28 14:30:00'

    const comando = `
        INSERT INTO tb_agenda (dia_horario) 
        VALUES (?);
    `;


    let resposta = await con.query(comando, [dataHora]);
    let cadastro = resposta[0];

    return cadastro.insertId; // Retorna o ID do registro inserido
}



export async function criarConsultas(info) {

    const comando = `
        INSERT INTO consulta (id_agenda, tratamento, condicao, medicacao, preco,id_paciente) 
        VALUES (?, ?,?,?,?,?);
        
                            `

    let resposta = await con.query(comando, [info.id_agenda, info.tratamento, info.condicao, info.medicacao, info.preco, info.id_paciente])
    let cadastro = resposta[0];

    return cadastro.insertId;



}

export async function verificarConsultaPorCPF(cpf) {

    const [rows] = await con.query(`
              SELECT consulta.id_consulta
              FROM tb_auto_cadastro
              JOIN consulta ON tb_auto_cadastro.id_paciente = consulta.id_paciente
              WHERE tb_auto_cadastro.cpf = ? AND consulta.finalizada = 0
            `, [cpf]);

    return rows.length > 0 ? rows[0] : null;
};


export async function verificarCPFExistente(cpf) {

    const [resultado] = await db.query('SELECT COUNT(*) as total FROM tb_auto_cadastro WHERE cpf = ?', [cpf]);
    return resultado.total > 0; // Retorna true se o CPF existir
};
