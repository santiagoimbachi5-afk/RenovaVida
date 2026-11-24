// Cada paso del asistente es un objeto. Para agregar un paso nuevo,
// solo se agrega otro objeto a esta lista.
//
// tipo "tarjetas": tarjetas grandes con ícono (paso 1)
// tipo "grupos":   etiquetas agrupadas por tema (paso 2)
export const pasos = [
  {
    id: "categorias",
    tipo: "tarjetas",
    titulo: "Cuéntanos qué te gusta",
    descripcion:
      "Elige lo que más disfrutas. Así podremos recomendarte actividades y mensajes que se parezcan a ti. Puedes cambiarlo cuando quieras.",
    minimo: 1, // cuántas debe elegir para poder continuar (0 = ninguna)
    omitible: true, // si aparece el enlace "Omitir por ahora"
    opciones: [
      { id: "musica", etiqueta: "Música", icono: "musica" },
      { id: "cine", etiqueta: "Cine y series", icono: "cine" },
      { id: "deporte", etiqueta: "Deporte", icono: "deporte" },
      { id: "arte", etiqueta: "Arte", icono: "arte" },
      { id: "tecnologia", etiqueta: "Tecnología y juegos", icono: "tecnologia" },
      { id: "lectura", etiqueta: "Lectura", icono: "lectura" },
    ],
  },

  {
    id: "musica_peliculas",
    tipo: "grupos",
    titulo: "Música y películas",
    descripcion:
      "Marca los géneros que más te gustan. Así podremos recomendarte canciones y películas que de verdad disfrutes.",
    minimo: 0, // con 0 puede continuar sin elegir nada
    omitible: false,
    grupos: [
      {
        id: "musica",
        titulo: "Música",
        icono: "musica",
        opciones: [
          { id: "musica-pop", etiqueta: "Pop" },
          { id: "musica-rock", etiqueta: "Rock" },
          { id: "musica-reggaeton", etiqueta: "Reggaetón" },
          { id: "musica-salsa", etiqueta: "Salsa" },
          { id: "musica-vallenato", etiqueta: "Vallenato" },
          { id: "musica-hiphop", etiqueta: "Hip hop" },
          { id: "musica-electronica", etiqueta: "Electrónica" },
          { id: "musica-baladas", etiqueta: "Baladas" },
        ],
      },
      {
        id: "peliculas",
        titulo: "Películas",
        icono: "cine",
        opciones: [
          { id: "pelis-comedia", etiqueta: "Comedia" },
          { id: "pelis-accion", etiqueta: "Acción" },
          { id: "pelis-terror", etiqueta: "Terror" },
          { id: "pelis-drama", etiqueta: "Drama" },
          { id: "pelis-ciencia", etiqueta: "Ciencia ficción" },
          { id: "pelis-animacion", etiqueta: "Animación" },
          { id: "pelis-romance", etiqueta: "Romance" },
          { id: "pelis-documentales", etiqueta: "Documentales" },
        ],
      },
    ],
  },
];