import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    const result = await sql`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        tipo_pessoa VARCHAR(20),
        nome VARCHAR(255) NOT NULL,
        cpf_cnpj VARCHAR(20),
        rg_inscricao VARCHAR(20),
        apelido VARCHAR(255),
        data_nascimento DATE,
        faixa_etaria VARCHAR(50),
        sexo VARCHAR(20),
        relacao_familiar VARCHAR(50),
        profissao VARCHAR(100),
        cnh_vencimento DATE,
        cliente_desde DATE,
        como_conheceu VARCHAR(100),
        nome_amigo VARCHAR(255),
        status_ativo BOOLEAN DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        email VARCHAR(255),
        email_comercial VARCHAR(255),
        telefone VARCHAR(20),
        telefone_comercial VARCHAR(20),
        emitir_nf BOOLEAN,
        iss_retido BOOLEAN,
        consumidor_final BOOLEAN,
        produtor_rural BOOLEAN,
        tipo_contribuinte VARCHAR(50),
        tipo_cliente VARCHAR(50),
        credito_liberado DECIMAL(10,2),
        valor_gasto DECIMAL(10,2),
        saldo DECIMAL(10,2),
        valor_consumido DECIMAL(10,2),
        valor_custos DECIMAL(10,2),
        lucratividade DECIMAL(5,2),
        comissao DECIMAL(5,2),
        data_pagamento DATE,
        pix VARCHAR(255),
        restricao BOOLEAN,
        cep VARCHAR(10),
        logradouro VARCHAR(255),
        numero VARCHAR(20),
        complemento VARCHAR(100),
        bairro VARCHAR(100),
        estado CHAR(2),
        cidade VARCHAR(100),
        codigo_cidade VARCHAR(20),
        referencia TEXT,
        observacao TEXT
      );
    `;
    // Comandos de alteração para garantir que novas colunas existam se a tabela já foi criada
    await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS email VARCHAR(255);`;
    await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS email_comercial VARCHAR(255);`;
    await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);`;
    await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS telefone_comercial VARCHAR(20);`;

    return response.status(200).json({ message: 'Tabela criada ou atualizada com sucesso!', result });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
