import z4 from "zod/v4";

export const deleteResultRouteParam = z4.object({ quizId: z4.string("Id deve ser informado") });
