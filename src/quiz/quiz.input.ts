import z4 from "zod/v4";

export const createQuizJsonInput = z4.object({
  course: z4.string().min(1, "Curso é obrigatório"),
  topic: z4.string().min(1, "Tópico é obrigatório"),
  difficulty: z4.enum(["iniciante", "medio", "dificil"], {
    message: "Dificuldade deve ser: iniciante, medio ou dificil",
  }),
  additionalInfo: z4.string().optional(),
});

export const quizResultJsonInput = z4.object({
  answers: z4.record(
    z4.string(),
    z4.enum(["A", "B", "C", "D"], {
      message: "Resposta deve ser A, B, C ou D",
    })
  ),
});

export const deleteQuizRouteParam = z4.object({
  id: z4.string("Id é necessário"),
});
