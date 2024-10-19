import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { IdUsuarioSchema } from "../../../../../../../types/usuario.js";
import {
  ComentarioFullType,
  ComentarioSchema,
  IdComentarioSchema,
} from "../../../../../../../types/comentario.js";
import { IdTema } from "../../../../../../../types/tema.js";
import * as comentarioService from "../../../../../../../services/comentarios.js";

const usuariosRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // El put para modificar un comentario
  fastify.put("/", {
    schema: {
      tags: ["comentarios"],
      summary: "Modificar comentario de el tema.",
      params: Type.Intersect([IdUsuarioSchema, IdTema, IdComentarioSchema]),
      body: ComentarioSchema,
      response: {
        201: {
          description: "Comentario modificado.",
          content: {
            "application/json": {
              schema: ComentarioSchema,
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifyAdmin],
    handler: async function (request, reply) {
      const comentario = request.body as ComentarioFullType;
      const idComentario = comentario.id_comentario;
      const idTema = comentario.id_tema;
      const descripcion = comentario.descripcion;
      return comentarioService.modify(idTema, idComentario, descripcion);
    },
  });

  fastify.delete("/", {
    schema: {
      tags: ["comentarios"],
      summary: "Eliminar comentario de la tarea.",
      params: Type.Intersect([IdUsuarioSchema, IdTema, IdComentarioSchema]),
      response: {
        204: {
          description: "Comentario eliminado.",
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifySelfOrAdmin],
    handler: async function (request, reply) {
      const { id_tarea } = request.params as { id_tarea: number };
      const { id_comentario } = request.params as { id_comentario: number };
      return comentarioService.erase(id_tarea, id_comentario);
    },
  });
};

export default usuariosRoutes;
