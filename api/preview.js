export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    const { homeTeam, awayTeam, round, venue, homeStats, awayStats } = req.body

    const prompt = `Escribe una previa corta (máximo 100 palabras) en español, en tono periodístico deportivo, para el partido de fútbol entre ${homeTeam} y ${awayTeam}, jornada ${round} de la Liga BetPlay colombiana, en el estadio ${venue || 'por confirmar'}.
${homeStats ? `${homeTeam} lleva ${homeStats.intPoints} puntos esta temporada, forma reciente: ${homeStats.strForm}.` : ''}
${awayStats ? `${awayTeam} lleva ${awayStats.intPoints} puntos esta temporada, forma reciente: ${awayStats.strForm}.` : ''}
No inventes resultados ni jugadores específicos que no te haya dado.`

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 200
            })
        })

        if (!response.ok) {
            const errorBody = await response.text()
            throw new Error(`Groq respondió ${response.status}: ${errorBody}`)
        }

        const data = await response.json()
        const preview = data.choices[0].message.content

        res.status(200).json({ preview })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'No se pudo generar la previa' })
    }
}