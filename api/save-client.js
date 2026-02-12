import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Allow both POST (create) and PUT (update)
  if (request.method !== 'POST' && request.method !== 'PUT') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = request.body;
    const { id } = data;

    // Helper to parse numbers and remove currency symbols
    const parseCurrency = (val) => {
      if (!val) return 0;
      if (typeof val === 'number') return val;
      return parseFloat(val.toString().replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
    };

    let result;

    if (id) {
      // UPDATE Logic
      result = await sql`
         UPDATE clientes SET
           tipo_pessoa = ${data.tipoPessoa || 'Físico'},
           nome = ${data.nome},
           cpf_cnpj = ${data.cpfCnpj || ''},
           rg_inscricao = ${data.rgInscricao || ''},
           apelido = ${data.apelido || ''},
           data_nascimento = ${data.dataNascimento || null},
           faixa_etaria = ${data.faixaEtaria || ''},
           sexo = ${data.sexo || ''},
           relacao_familiar = ${data.relacaoFamiliar || ''},
           profissao = ${data.profissao || ''},
           email = ${data.email || ''},
           email_comercial = ${data.emailComercial || ''},
           telefone = ${data.telefone || ''},
           telefone_comercial = ${data.telefoneComercial || ''},
           cep = ${data.cep || ''},
           logradouro = ${data.logradouro || ''},
           numero = ${data.numero || ''},
           complemento = ${data.complemento || ''},
           bairro = ${data.bairro || ''},
           estado = ${data.estado || ''},
           cidade = ${data.cidade || ''},
           status_ativo = ${data.statusAtivo === 'Sim'},
           emitir_nf = ${data.emitirNF === 'Sim'},
           iss_retido = ${data.issRetido === 'Sim'},
           consumidor_final = ${data.consumidorFinal === 'Sim'},
           produtor_rural = ${data.produtorRural === 'Sim'},
           tipo_contribuinte = ${data.tipoContribuinte || ''},
           tipo_cliente = ${data.tipoCliente || ''},
           credito_liberado = ${parseCurrency(data.creditoLiberado)},
           valor_gasto = ${parseCurrency(data.valorGasto)},
           saldo = ${parseCurrency(data.saldo)},
           valor_consumido = ${parseCurrency(data.valorConsumido)},
           valor_custos = ${parseCurrency(data.valorCustos)},
           lucratividade = ${parseCurrency(data.lucratividade)},
           comissao = ${parseCurrency(data.comissao)},
           pix = ${data.pix || ''},
           restricao = ${data.restricao === 'Sim'},
           observacao = ${data.observacao || ''}
         WHERE id = ${id}
         RETURNING id;
       `;
    } else {
      // INSERT Logic
      result = await sql`
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
          ${data.statusAtivo === 'Sim'},
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
    }

    return response.status(200).json({
      message: id ? 'Cliente atualizado com sucesso!' : 'Cliente salvo com sucesso!',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    return response.status(500).json({ error: error.message });
  }
}
