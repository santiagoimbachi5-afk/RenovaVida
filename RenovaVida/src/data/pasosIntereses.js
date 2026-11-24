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
    {
    id: "deportes_hobbies",
    tipo: "grupos",
    titulo: "Deportes y hobbies",
    descripcion:
      "Cuéntanos qué te gusta practicar y qué haces en tu tiempo libre. Si algo no está en la lista, agrégalo con «+ Otro».",
    minimo: 0,
    omitible: false,
    grupos: [
      {
        id: "deportes",
        titulo: "Deportes",
        icono: "deporte",
        permiteOtro: true, // muestra la etiqueta punteada "+ Otro"
        opciones: [
          { id: "deportes-futbol", etiqueta: "Fútbol" },
          { id: "deportes-baloncesto", etiqueta: "Baloncesto" },
          { id: "deportes-voleibol", etiqueta: "Voleibol" },
          { id: "deportes-natacion", etiqueta: "Natación" },
          { id: "deportes-ciclismo", etiqueta: "Ciclismo" },
          { id: "deportes-correr", etiqueta: "Correr" },
          { id: "deportes-gimnasio", etiqueta: "Gimnasio" },
          { id: "deportes-artes-marciales", etiqueta: "Artes marciales" },
        ],
      },
      {
        id: "hobbies",
        titulo: "Otros hobbies",
        icono: "hobbies",
        opciones: [
          { id: "hobbies-dibujo", etiqueta: "Dibujar y pintar" },
          { id: "hobbies-cocinar", etiqueta: "Cocinar" },
          { id: "hobbies-videojuegos", etiqueta: "Videojuegos" },
          { id: "hobbies-fotografia", etiqueta: "Fotografía" },
          { id: "hobbies-bailar", etiqueta: "Bailar" },
          { id: "hobbies-instrumento", etiqueta: "Tocar un instrumento" },
          { id: "hobbies-manualidades", etiqueta: "Manualidades" },
          { id: "hobbies-escribir", etiqueta: "Escribir" },
        ],
      },
    ],
  },
    {
    id: "arte_tecnologia_libros",
    tipo: "grupos",
    titulo: "Arte, tecnología y libros",
    descripcion:
      "Elige lo que te llama la atención en el arte, la tecnología y la lectura. Con esto te recomendaremos actividades y lecturas a tu medida.",
    minimo: 0,
    omitible: false,
    grupos: [
      {
        id: "arte",
        titulo: "Arte",
        icono: "arte",
        opciones: [
          { id: "arte-grafiti", etiqueta: "Grafiti" },
          { id: "arte-escultura", etiqueta: "Escultura" },
          { id: "arte-teatro", etiqueta: "Teatro" },
          { id: "arte-diseno", etiqueta: "Diseño gráfico" },
          { id: "arte-ilustracion", etiqueta: "Ilustración digital" },
          { id: "arte-animacion", etiqueta: "Animación" },
        ],
      },
      {
        id: "tecnologia",
        titulo: "Tecnología",
        icono: "tecnologia",
        opciones: [
          { id: "tecnologia-programacion", etiqueta: "Programación" },
          { id: "tecnologia-robotica", etiqueta: "Robótica" },
          { id: "tecnologia-ia", etiqueta: "Inteligencia artificial" },
          { id: "tecnologia-video", etiqueta: "Edición de video" },
          { id: "tecnologia-web", etiqueta: "Diseño web" },
          { id: "tecnologia-gadgets", etiqueta: "Gadgets y celulares" },
        ],
      },
      {
        id: "libros",
        titulo: "Libros",
        icono: "lectura",
        opciones: [
          { id: "libros-novela", etiqueta: "Novela" },
          { id: "libros-fantasia", etiqueta: "Fantasía" },
          { id: "libros-misterio", etiqueta: "Misterio" },
          { id: "libros-ciencia", etiqueta: "Ciencia ficción" },
          { id: "libros-comics", etiqueta: "Cómics y manga" },
          { id: "libros-poesia", etiqueta: "Poesía" },
          { id: "libros-autoayuda", etiqueta: "Autoayuda" },
          { id: "libros-historia", etiqueta: "Historia" },
        ],
      },
    ],
  },
    {
    id: "frases",
    tipo: "tarjetas-grandes",
    titulo: "Frases que te inspiran",
    descripcion:
      "Elige el tipo de frases que te gustaría recibir. Las usaremos para acompañarte con mensajes que de verdad te hablen a ti.",
    minimo: 0, // cambia a 1 si quieres que elija al menos un tipo
    omitible: false,
    opciones: [
      {
        id: "frases-espiritual",
        etiqueta: "Espiritual",
        icono: "espiritual",
        descripcion: "Frases de esperanza, gratitud y paz interior.",
      },
      {
        id: "frases-humor",
        etiqueta: "Humor",
        icono: "hobbies",
        descripcion: "Mensajes con buen humor para arrancar una sonrisa.",
      },
      {
        id: "frases-superacion",
        etiqueta: "Superación",
        icono: "superacion",
        descripcion: "Palabras para seguir adelante y lograr tus metas.",
      },
      {
        id: "frases-calma",
        etiqueta: "Calma",
        icono: "calma",
        descripcion: "Frases tranquilas para respirar y soltar el estrés.",
      },
    ],
  },
];