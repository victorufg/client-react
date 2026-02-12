import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    if (request.method !== 'PUT') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { id, status_ativo } = request.body;

    if (!id) {
        return response.status(400).json({ error: 'ID is required' });
    }

    try {
        // status_ativo should be a boolean
        await sql`UPDATE clientes SET status_ativo = ${status_ativo} WHERE id = ${id}`;
        return response.status(200).json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return response.status(500).json({ error: error.message });
    }
}
