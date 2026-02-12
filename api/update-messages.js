import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    if (request.method !== 'POST' && request.method !== 'PUT') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id, gestaoMensagens } = request.body;

        if (!id) {
            return response.status(400).json({ error: 'ID do cliente é obrigatório' });
        }

        // Helper to format gestao_mensagens as a comma-separated string
        const formatGestaoMensagens = (val) => {
            if (Array.isArray(val)) return val.join(', ');
            return val || '';
        };

        const formattedMessages = formatGestaoMensagens(gestaoMensagens);

        await sql`
      UPDATE clientes 
      SET gestao_mensagens = ${formattedMessages}
      WHERE id = ${id}
    `;

        return response.status(200).json({
            message: 'Preferências de mensagens atualizadas com sucesso!',
            gestaoMensagens: formattedMessages
        });
    } catch (error) {
        console.error('Erro ao atualizar gestao_mensagens:', error);
        return response.status(500).json({ error: error.message });
    }
}
