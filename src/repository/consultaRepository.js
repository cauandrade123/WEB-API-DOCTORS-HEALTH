import { resolveContent } from "nodemailer/lib/shared/index.js";
import con from "./connection.js";


export async function consultaFinalizar(cpf) {

    const comando = `
     select 
    consulta.finalizada
    from consulta
    JOIN tb_auto_cadastro ON consulta.id_paciente = tb_auto_cadastro.id_paciente
    where tb_auto_cadastro.cpf       = ?;
        `

    let resposta = await con.query(comando, [cpf])
    let info = resposta[0]
    return info


}

export async function FinalizarConsulta(cpf) {

    const comando = `
    
    UPDATE consulta c
    JOIN tb_auto_cadastro p ON c.id_paciente = p.id_paciente
    SET c.finalizada = true
    WHERE p.cpf = ?;
    

    `

    let resposta = await con.query(comando, [cpf])
    let info = resposta[0]

    return info.affectedRows;

}

export async function verificarLogin(info) {

    const comando = 'SELECT * FROM tb_login WHERE email = ?'
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
   finalizada = false 
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
    consulta.preco,
    consulta.finalizada
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

export async function consultarfinanceiro(mes, ano) {



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

    let resposta = await con.query(comando[mes, ano])

    let registros = resposta[0];

    return registros
}


export async function inserirAgenda(info) {

    const dataHora = `${info.dia} ${info.hora}`;

    const comando = `
        INSERT INTO tb_agenda (dia_horario) 
        VALUES (?);
    `;


    let resposta = await con.query(comando, [dataHora]);
    let cadastro = resposta[0];

    return cadastro.insertId;
}



export async function criarConsultas(info) {


    const comando = `
        INSERT INTO consulta (id_agenda, tratamento, condicao, medicacao, preco,id_paciente, finalizada) 
        VALUES (?, ?,?,?,?,?,false);
        
                            `

    let resposta = await con.query(comando, [info.id_agenda, info.tratamento, info.condicao, info.medicacao, info.preco, info.id_paciente])
    let cadastro = resposta[0];

    return cadastro.insertId;

}


export async function verificarConsultaPorCPF(cpf) {
    try {
        // Executa a consulta SQL para buscar consultas não finalizadas do paciente com o CPF informado
        const [rows] = await con.query(`
                    SELECT consulta.id_consulta
                    FROM tb_auto_cadastro
                    JOIN consulta ON tb_auto_cadastro.id_paciente = consulta.id_paciente
                    WHERE tb_auto_cadastro.cpf = ? AND consulta.finalizada = false
                `, [cpf]);

        // Retorna a consulta encontrada (se houver) ou null caso contrário
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        throw new Error('Erro ao verificar consulta por CPF.');
    }
};


export async function verificarCPFExistente(cpf) {

    const [resultado] = await con.query('SELECT COUNT(*) as total FROM tb_auto_cadastro WHERE cpf = ?', [cpf]);
    return resultado.total > 0;
};


export async function obterHorariosOcupados(data) {
    const result = await con.query(
        'SELECT TIME(dia_horario) AS hora FROM tb_agenda WHERE DATE(dia_horario) = ?',
        [data]
    );



    if (!result[0] || result[0].length === 0) {
        console.log('Nenhum horário ocupado encontrado para a data fornecida.');
        return []; // Retorna um array vazio em vez de lançar um erro
    }

    return [result[0]];;
};

export async function PuxarFinanceiro(ano) {
    const comando = `     
        SELECT 
            MONTH(ta.dia_horario) AS mes, 
            SUM(tc.preco) AS valor_arrecadado
        FROM 
            consulta tc
        JOIN 
            tb_agenda ta ON tc.id_agenda = ta.id_agenda
        WHERE 
            YEAR(ta.dia_horario) = ?
        GROUP BY 
            MONTH(ta.dia_horario)
        ORDER BY 
            mes;
    `;

    let resposta = await con.query(comando, [ano]);
    let info = resposta[0];

    return info;
}



export async function ConsultarData(){
    let comando = `
    select dia_horario
    from tb_agenda
    `

    let resposta =  con.query(comando)

    let info = resposta[0]

    return info;
}






