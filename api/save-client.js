import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = request.body;

    // Helper to parse numbers and remove currency symbols
    const parseCurrency = (val) => {
      if (!val) return 0;
      if (typeof val === 'number') return val;
      return parseFloat(val.toString().replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
    };

    const result = await sql`
      INSERT INTO clientes (
        tipo_pessoa, nome, cpf_cnpj, rg_inscricao, apelido, 
        data_nascimento, faixa_etaria, sexo, relacao_familiar, profissao,
        email, email_comercial, telefone, telefone_comercial,
        cep, logradouro, numero, complemento, bairro, estado, cidade,
        status_ativo, emitir_nf, iss_retido, consumidor_final, produtor_rural,
        tipo_contribuinte, tipo_cliente, credito_liberado, valor_gasto,
        saldo, valor_consumido, valor_custos, lucratividade, comissao,
        pix, restricao, observacao
      ) VALUES (
        ${data.tipoPessoa || 'Físico'},
        ${data.nome},
        ${data.cpfCnpj || ''},
        ${data.rgInscricao || ''},
        ${data.apelido || ''},
        ${data.dataNascimento || null},
        ${data.faixaEtaria || ''},
        ${data.sexo || ''},
        ${data.relacaoFamiliar || ''},
        ${data.profissao || ''},
        ${data.email || ''},
        ${data.emailComercial || ''},
        ${data.telefone || ''},
        ${data.telefoneComercial || ''},
        ${data.cep || ''},
        ${data.logradouro || ''},
        ${data.numero || ''},
        ${data.complemento || ''},
        ${data.bairro || ''},
        ${data.estado || ''},
        ${data.cidade || ''},
        ${data.statusAtivo !== undefined ? data.statusAtivo : true},
        ${data.emitirNF === 'Sim'},
        ${data.issRetido === 'Sim'},
        ${data.consumidorFinal === 'Sim'},
        ${data.produtorRural === 'Sim'},
        ${data.tipoContribuinte || ''},
        ${data.tipoCliente || ''},
        ${parseCurrency(data.creditoLiberado)},
        ${parseCurrency(data.valorGasto)},
        ${parseCurrency(data.saldo)},
        ${parseCurrency(data.valorConsumido)},
        ${parseCurrency(data.valorCustos)},
        ${parseCurrency(data.lucratividade)},
        ${parseCurrency(data.comissao)},
        ${data.pix || ''},
        ${data.restricao === 'Sim'},
        ${data.observacao || ''}
      )
      RETURNING id;
    `;

    return response.status(200).json({
      message: 'Cliente salvo com sucesso!',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    return response.status(500).json({ error: error.message });
  }
}
