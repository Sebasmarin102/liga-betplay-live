# Liga BetPlay Live ⚽

App de resultados en vivo, últimos resultados y próximos partidos de la **Liga BetPlay (Categoría Primera A de Colombia)**, construida con React y datos reales de una API pública de fútbol.

## Demo en vivo

🔗 [URL:](https://liga-betplay-live.vercel.app/)

## Features

- **Página principal** con 3 categorías de partidos en formato de tarjetas: en vivo, últimos resultados (24h) y próximos 7 días — filtrados solo para equipos de la Liga Colombiana.
- **Detalle de partido** (`/partido/:id`) al hacer clic en cualquier tarjeta: marcador, estado, estadio (nombre, ciudad, capacidad), resumen en YouTube (si existe), plantillas de ambos equipos con posición, edad y nacionalidad, y una **gráfica comparativa** (goles a favor/en contra, puntos, victorias) entre los 2 equipos del partido.
- **Tabla de posiciones** (`/posiciones`) con racha de forma (últimos resultados) por equipo.
- **Previa del partido generada con IA**: botón que genera un análisis breve en lenguaje natural del partido (forma reciente, puntos, estadio) usando un LLM (Llama 3.3 vía Groq), llamado desde una función serverless propia — la API key nunca se expone al navegador.
- **Estados de carga tipo skeleton** (placeholders animados) en vez de spinners o texto plano.
- **Manejo de errores real**: si la API falla o no hay conexión, se muestra un mensaje claro en vez de quedar cargando indefinidamente.
- Diseño oscuro responsive, con horarios convertidos a la zona horaria de Colombia.

## Stack técnico

- **React 19** + **Vite** (sin plantilla de UI, CSS puro con variables/custom properties)
- **React Router** para las rutas (`/`, `/partido/:id`, `/posiciones`)
- **Recharts** para las gráficas comparativas
- **[TheSportsDB](https://www.thesportsdb.com/)** (API v1, plan gratuito) como fuente de datos
- **Función serverless de Vercel** (`api/preview.js`) + **[Groq](https://groq.com/)** para la previa generada por IA — mantiene la API key en el servidor, nunca en el bundle del navegador
- Consumo de API con `fetch` nativo (sin librerías como Axios)

## Qué aprendí / retos de este proyecto

- **Los planes gratuitos de APIs deportivas tienen letra chica**: API-Football (mi primera opción) resultó no dar acceso a temporadas actuales en su plan free, así que investigué y cambié a TheSportsDB a mitad de camino — una decisión de arquitectura real, no solo seguir un tutorial.
- **Los nombres de parámetros de una API no siempre son consistentes** entre sus propios endpoints (`id` vs `l` para filtrar por liga en distintos endpoints de TheSportsDB) — tocó leer la documentación con cuidado y depurar con la respuesta real, no asumir.
- **Manejo de fechas y zonas horarias**: la API devuelve timestamps en UTC sin indicarlo explícitamente; hubo que forzarlo (`+ 'Z'`) y convertir todo a hora de Colombia con `Intl`/`toLocaleString`, evitando cálculos manuales de offset.
- **Reglas de Hooks de React**: encontré (y entendí por qué pasa) el clásico error de mover un `useEffect` después de un `return` condicional — Hooks deben llamarse siempre en el mismo orden en cada render.
- **Límites reales de datos gratuitos**: algunos endpoints (listas de próximos partidos, plantillas de jugadores, tabla de posiciones) están capados a pocos resultados en el plan free, lo que obligó a rearmar la lógica de "próximos 7 días" combinando varias llamadas por fecha en vez de un solo endpoint de lista.
- **Los "planes gratis" de LLMs**: probé OpenAI (sin créditos para cuentas nuevas) y Gemini (cuota en 0 para mi región/cuenta) antes de encontrar que Groq sí ofrece un tier gratuito funcional sin tarjeta — otra decisión de arquitectura resuelta por prueba y error real, no por documentación perfecta.

## Nota sobre los datos

Este proyecto usa el **plan gratuito** de TheSportsDB. Algunas plantillas de jugadores pueden no estar completamente actualizadas (dorsal y foto casi nunca vienen para equipos de ligas no europeas), y el "en vivo" no es un push en tiempo real sino una actualización al consultar — limitaciones de la fuente de datos gratuita, no del código.

Además, el endpoint de tabla de posiciones (`lookuptable.php`) solo devuelve los **5 primeros equipos** de la liga en el plan gratuito, no los 20 equipos reales. Por eso la tabla de posiciones muestra solo 5 filas, y la gráfica comparativa del detalle de partido solo aparece cuando **ambos** equipos del partido están entre esos 5 — si no, se omite en vez de mostrar datos incompletos.

## Cómo correrlo localmente

```bash
git clone https://github.com/TU-USUARIO/liga-betplay-live.git
cd liga-betplay-live
npm install
```

Crea un archivo `.env` en la raíz con:

```
VITE_SPORTSDB_KEY=123
VITE_COLOMBIA_LEAGUE_ID=4497
VITE_SEASON=2026
GROQ_API_KEY=tu_key_de_groq
```

(`123` es la key pública de pruebas de TheSportsDB, no un secreto personal. `GROQ_API_KEY` no lleva prefijo `VITE_` a propósito — es de uso exclusivo del servidor, se consigue gratis en [console.groq.com](https://console.groq.com/keys))

```bash
npm run dev
```

Esto levanta la app normal, pero **la previa con IA no va a funcionar** así (necesita la función serverless). Para probar la app completa, incluyendo la IA, usa el CLI de Vercel:

```bash
npm install -g vercel
vercel dev
```
