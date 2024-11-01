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
INSERT INTO tb_auto_cadastro (nome, nascimento, rg, cpf, telefone, email) 
VALUES (?, ?, ?, ?, ?, ?);

                    `

    let resposta = await con.query(comando, [cadastro.nome, cadastro.nascimento, cadastro.rg, cadastro.cpf, cadastro.telefone, cadastro.email])
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
    tb_auto_cadastro.email,
    consulta.tratamento,
    consulta.condicao,
    consulta.medicacao,
    consulta.preco,
    consulta.finalizada,
    consulta.id_consulta as id
FROM 
    consulta
JOIN 
    tb_agenda ON consulta.id_agenda = tb_agenda.id_agenda
JOIN 
    tb_auto_cadastro ON consulta.id_paciente = tb_auto_cadastro.id_paciente
WHERE 
    finalizada = true 
ORDER BY 
    tb_agenda.dia_horario desc
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
   tb_auto_cadastro.email,
    consulta.tratamento,
    consulta.condicao,
    consulta.medicacao,
    consulta.preco,
    consulta.finalizada,
    consulta.id_consulta as id
FROM 
    consulta
JOIN 
    tb_agenda ON consulta.id_agenda = tb_agenda.id_agenda
JOIN 
    tb_auto_cadastro ON consulta.id_paciente = tb_auto_cadastro.id_paciente
WHERE 
   finalizada = false 
ORDER BY 
    tb_agenda.dia_horario asc
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
     tb_auto_cadastro.email,
    consulta.tratamento,
    consulta.condicao,
    consulta.medicacao,
    consulta.preco,
    consulta.finalizada,
    consulta.id_consulta as id
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
    preco =?
  

 where id_consulta = ?;
    `

    
    let resposta = await con.query(comando, [consulta.tratamento, consulta.condicao, consulta.medicacao, consulta.preco, id])
    let info = resposta[0];

    console.log(info.affectedRow)
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
        INSERT INTO consulta (id_agenda, tratamento, condicao, medicacao, preco,id_paciente, finalizada, metodo_pagamento) 
        VALUES (?, ?,?,?,?,?,false, ?);
        
                            `

    let resposta = await con.query(comando, [info.id_agenda, info.tratamento, info.condicao, info.medicacao, info.preco, info.id_paciente, info.metodo])
    let cadastro = resposta[0];

    return cadastro.insertId;

}


export async function verificarConsultaPorCPF(cpf) {
    try {
       
        const [rows] = await con.query(`
                    SELECT consulta.id_consulta
                    FROM tb_auto_cadastro
                    JOIN consulta ON tb_auto_cadastro.id_paciente = consulta.id_paciente
                    WHERE tb_auto_cadastro.cpf = ? AND consulta.finalizada = false
                `, [cpf]);

       
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        throw new Error('Erro ao verificar consulta por CPF.');
    }
};


export async function verificarCPFExistente(cpf) {

    const [resultado] = await con.query(`SELECT id_paciente 
            FROM tb_auto_cadastro 
            WHERE cpf = ?`, [cpf]);
    return resultado.length > 0;
};

export async function verificarTelefoneExistente(telefone) {

    const [resultado] = await con.query(`SELECT id_paciente 
            FROM tb_auto_cadastro 
            WHERE telefone = ?`, [telefone]);
    return resultado.length > 0;
};



export async function obterHorariosOcupados(data) {
    const result = await con.query(
        'SELECT TIME(dia_horario) AS hora FROM tb_agenda WHERE DATE(dia_horario) = ?',
        [data]
    );



    if (!result[0] || result[0].length === 0) {
        console.log('Nenhum horário ocupado encontrado para a data fornecida.');
        return [];
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



export async function ConsultarData() {
    let comando = `
      SELECT dia_horario, titulo, id_agenda
      FROM tb_agenda
    `;
  
    let [rows] = await con.query(comando);
    return rows; 
  }
  

  export async function cadastrado(cadastro) {

    const comando = `
INSERT INTO tb_cadastrado (id_paciente, metodo_pagamento, id_agenda) 
VALUES (?, ?, ?);

                    `

    let resposta = await con.query(comando, [cadastro.id_paciente, cadastro.metodo, cadastro.id_agenda])
    let info = resposta[0];

    return info.insertId;

}


export async function obterIdPacientePorCPF(cpf) {
    try {
        const comando = `
            SELECT id_paciente 
            FROM tb_auto_cadastro 
            WHERE cpf = ?
        `;

        
        const [rows] = await con.query(comando, [cpf]);

       
        if (rows.length === 0) {
            return null; 
        }

        
        return rows[0].id_paciente;

    } catch (error) {
        console.error('Erro ao buscar o id_paciente no banco de dados:', error);
        throw new Error('Erro ao buscar id_paciente por CPF.');
    }
};


export async function deletarData (deletarData){
    let comando = `
    delete titulo
    
    from tb_agenda

    where id = ?
    `

    let resposta = await con.query(comando, deletarData)

    let info = resposta[0]

    return info.affectedRows
}

export async function  verificarEstadoFinalizadaAgenda(id){
let comando = `
select 
consulta.finalizada,
consulta.id_consulta,
consulta.id_paciente,
consulta.id_agenda,
tb_agenda.dia_horario
 from consulta
 join tb_agenda on consulta.id_agenda = tb_agenda.id_agenda
 where tb_agenda.id_agenda = ?;
`

let resposta = await con.query(comando, [id])

let info = resposta[0]
return info

}




