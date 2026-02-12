import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    if (request.method !== 'DELETE') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = request.query;

    if (!id) {
        return response.status(400).json({ error: 'ID is required' });
    }

    try {
        await sql`DELETE FROM clientes WHERE id = ${id}`;
        return response.status(200).json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        return response.status(500).json({ error: error.message });
    }
}
