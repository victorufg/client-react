import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    try {
        const result = await sql`
      SELECT * FROM clientes ORDER BY data_cadastro DESC;
    `;

        // Mapeia os nomes das colunas do banco (snake_case) para o formato esperado pelo front (camelCase se necessário)
        // Para simplificar, vamos retornar o que o banco devolve e ajustar no ClientTable se necessário
        return response.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return response.status(500).json({ error: error.message });
    }
}
