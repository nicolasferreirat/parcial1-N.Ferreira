import { Static, Type } from "@sinclair/typebox";

// Definimos los esquemas base de los campos
export const IdComentarioSchema = Type.Object({
  id_comentario: Type.Integer({
    description: "ID del comentario.",
  }),
});

export const ComentarioSchema = Type.Object({
  id_tema: Type.Integer({
    description: "ID del tema que pertenece el comentario",
  }),
  id_usuario: Type.Integer({
    description: "ID del usuario que creó el comentario.",
  }),
  fecha_ingresado: Type.String({
    format: "date-time",
    description:
      "Fecha en que se ingresó el comentario. Se establece por defecto al momento actual.",
  }),
  descripcion: Type.String({
    description: "Descripción del comentario.",
  }),
});

// Intersección de los esquemas base para formar el esquema completo
export const ComentarioFullSchema = Type.Intersect(
  [IdComentarioSchema, ComentarioSchema],
  {
    examples: [
      {
        id_comentario: 1,
        id_tema: 2,
        id_usuario: 3,
        fecha_ingresado: "2023-10-16T10:30:00Z",
        descripcion: "el comentario este está sarpado.",
      },
      {
        id_comentario: 2,
        id_tema: 1,
        id_usuario: 4,
        fecha_ingresado: "2023-10-17T08:45:00Z",
        descripcion: "Este comentario anda volando.",
      },
    ],
  }
);

export type ComentarioType = Static<typeof ComentarioSchema>;

export type ComentarioFullType = Static<typeof ComentarioFullSchema>;
