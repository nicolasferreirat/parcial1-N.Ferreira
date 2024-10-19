import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { IdUsuarioSchema } from "../../../../../../types/usuario.js";
import { IdTema } from "../../../../../../types/tema.js";
import {
  ComentarioSchema,
  ComentarioType,
} from "../../../../../../types/comentario.js";
import * as comentarioService from "../../../../../../services/comentarios.js";

const comentariosRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      tags: ["comentarios"],
      summary: "Listado de comentarios de la tarea.",
      params: Type.Intersect([IdUsuarioSchema, IdTema]),
      response: {
        200: {
          description: "Lista de comentarios del tema.",
          content: {
            "application/json": {
              schema: Type.Array(ComentarioSchema),
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT],
    handler: async function (request, reply) {
      const { id_tarea } = request.params as { id_tarea: number };
      return comentarioService.findAll(id_tarea);
    },
  });

  fastify.post("/", {
    schema: {
      tags: ["comentarios"],
      summary: "Crear comentario de la tarea.",
      params: Type.Intersect([IdUsuarioSchema, IdTema]),
      body: ComentarioSchema,
      response: {
        201: {
          description: "Comentario creado.",
          content: {
            "application/json": {
              schema: ComentarioSchema,
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT],
    handler: async function (request, reply) {
      const comentario = request.body as ComentarioType;
      const idTema = comentario.id_tema;
      const idUsuario = comentario.id_usuario;
      const descripcion = comentario.descripcion;
      return comentarioService.create(idTema, idUsuario, descripcion);
    },
  });
};

export default comentariosRoutes;
