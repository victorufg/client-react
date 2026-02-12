import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    // Allow both POST and PUT for flexibility
    if (request.method !== 'POST' && request.method !== 'PUT') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id, status, status_ativo } = request.body;

        if (!id) {
            return response.status(400).json({ error: 'ID do cliente é obrigatório' });
        }

        // Use either 'status' or 'status_ativo' from the body, defaulting to boolean
        const isAtivo = status !== undefined ? status : status_ativo;

        if (isAtivo === undefined) {
            return response.status(400).json({ error: 'Status é obrigatório' });
        }

        await sql`
      UPDATE clientes 
      SET status_ativo = ${!!isAtivo} 
      WHERE id = ${id}
    `;

        return response.status(200).json({
            message: isAtivo ? 'Cliente ativado com sucesso!' : 'Cliente inativado com sucesso!',
            status: !!isAtivo
        });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return response.status(500).json({ error: error.message });
    }
}
