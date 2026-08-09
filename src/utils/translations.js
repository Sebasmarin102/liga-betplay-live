const POSICIONES = {
  'Goalkeeper': 'Portero',
  'Defender': 'Defensa',
  'Centre-Back': 'Defensa Central',
  'Left-Back': 'Lateral Izquierdo',
  'Right-Back': 'Lateral Derecho',
  'Midfielder': 'Mediocampista',
  'Defensive Midfield': 'Volante Defensivo',
  'Central Midfield': 'Volante Central',
  'Attacking Midfield': 'Volante Ofensivo',
  'Attacker': 'Delantero',
  'Left Winger': 'Extremo Izquierdo',
  'Right Winger': 'Extremo Derecho',
  'Forward': 'Delantero',
  'Striker': 'Delantero Centro',
  'Centre-Forward': 'Delantero Centro'
}

export function translatePosition(position) {
  return POSICIONES[position] || position
}
