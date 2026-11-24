// Cada paso del asistente es un objeto. Para agregar un paso nuevo,
// solo se agrega otro objeto a esta lista.
export const pasos = [
  {
    id: "categorias",
    tipo: "tarjetas",
    titulo: "Cuéntanos qué te gusta",
    descripcion:
      "Elige lo que más disfrutas. Así podremos recomendarte actividades y mensajes que se parezcan a ti. Puedes cambiarlo cuando quieras.",
    minimo: 1, // cuántas debe elegir para poder continuar (0 = ninguna)
    omitible: true, // si puede saltarse este paso
    opciones: [
      { id: "musica", etiqueta: "Música", icono: "musica" },
      { id: "cine", etiqueta: "Cine y series", icono: "cine" },
      { id: "deporte", etiqueta: "Deporte", icono: "deporte" },
      { id: "arte", etiqueta: "Arte", icono: "arte" },
      { id: "tecnologia", etiqueta: "Tecnología y juegos", icono: "tecnologia" },
      { id: "lectura", etiqueta: "Lectura", icono: "lectura" },
    ],
  },
];