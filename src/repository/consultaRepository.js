import con from "./connection.js";


export async function verificarLogin(info) {

    const comando= 'SELECT * FROM tb_login WHERE email = ?'
    try {
        const [verificacao] = await con.query(comando, [info.email]);

       
        if (verificacao.length === 0) {
            return null; 
        }

        const usuario = verificacao[0];

       
        if (info.senha !== usuario.senha) {
            return null; 
        }

        return usuario; 
    } catch (error) {
        console.log(error);
        console.error('Erro ao verificar login:', error);
        throw new Error('Erro ao verificar login.');
    } 
};



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
    CONCAT(tb_agenda.dia_horario) < NOW()
ORDER BY 
    tb_agenda.dia_horario DESC
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
    consulta.preco,
    consulta.finalizada
FROM 
    consulta
JOIN 
    tb_agenda ON consulta.id_agenda = tb_agenda.id_agenda
JOIN 
    tb_auto_cadastro ON consulta.id_paciente = tb_auto_cadastro.id_paciente
WHERE 
    finalizada = true
ORDER BY 
    tb_agenda.dia_horario DESC
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
  tb_auto_cadastro.cpf LIKE ?;
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
        INSERT INTO consulta (id_agenda, tratamento, condicao, medicacao, preco,id_paciente, finalizada) 
        VALUES (?, ?,?,?,?,?,?);
        
                            `
        
        let resposta= await con.query(comando, [info.id_agenda, info.tratamento, info.condicao, info.medicacao, info.preco, info.id_paciente, info.finalizada])
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
