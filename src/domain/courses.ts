export const basePrompt = `
Atue como um **professor experiente do curso (CURSO)** e crie um quiz educacional de alta qualidade.

**INSTRUÇÕES:**
- Crie exatamente 10 questões de múltipla escolha sobre o tópico: (TÓPICO)
- Cada questão deve ter 4 alternativas (A, B, C, D), sendo apenas uma correta
- O nível de dificuldade deve ser: (DIFICULDADE)
- As questões devem ser claras, objetivas e pedagogicamente relevantes
- Varie os tipos de questões: conceituais, aplicação prática, análise e síntese
- Inclua explicações breves para a resposta correta de cada questão

**FORMATO DE RESPOSTA (JSON):**
Retorne APENAS um objeto JSON válido, sem markdown, com a seguinte estrutura:

{
  "questions": [
    {
      "id": 1,
      "question": "Texto da pergunta",
      "options": {
        "A": "Alternativa A",
        "B": "Alternativa B",
        "C": "Alternativa C",
        "D": "Alternativa D"
      },
      "correctAnswer": "A",
      "explanation": "Explicação breve sobre por que esta é a resposta correta"
    }
  ]
}

**INFORMAÇÕES ADICIONAIS:**
(INFO_ADICIONAL)

Certifique-se de que o JSON está válido e bem formatado. Não inclua texto antes ou depois do JSON.
`;

export interface CourseTopic {
  id: string;
  name: string;
  description?: string;
}

export interface Course {
  id: string;
  name: string;
  topics: CourseTopic[];
}

export const courses: Course[] = [
  {
    id: "direito",
    name: "Direito",
    topics: [
      { id: "civil-1", name: "Direito Civil I - Parte Geral" },
      { id: "civil-2", name: "Direito Civil II - Obrigações" },
      { id: "civil-3", name: "Direito Civil III - Contratos" },
      { id: "civil-4", name: "Direito Civil IV - Direitos Reais" },
      { id: "civil-5", name: "Direito Civil V - Família" },
      { id: "civil-6", name: "Direito Civil VI - Sucessões" },
      { id: "penal-1", name: "Direito Penal I - Parte Geral" },
      { id: "penal-2", name: "Direito Penal II - Crimes contra a Pessoa" },
      { id: "penal-3", name: "Direito Penal III - Crimes contra o Patrimônio" },
      { id: "penal-4", name: "Direito Penal IV - Crimes contra a Administração Pública" },
      { id: "constitucional-1", name: "Direito Constitucional I - Fundamentos" },
      { id: "constitucional-2", name: "Direito Constitucional II - Direitos Fundamentais" },
      { id: "processual-civil-1", name: "Processo Civil I - Procedimentos" },
      { id: "processual-penal-1", name: "Processo Penal I - Procedimentos" },
      { id: "trabalhista-1", name: "Direito do Trabalho I - Contrato de Trabalho" },
      { id: "tributario-1", name: "Direito Tributário I - Obrigação Tributária" },
      { id: "administrativo-1", name: "Direito Administrativo I - Ato Administrativo" },
    ],
  },
  {
    id: "medicina",
    name: "Medicina",
    topics: [
      { id: "anatomia-1", name: "Anatomia I - Sistema Musculoesquelético" },
      { id: "anatomia-2", name: "Anatomia II - Sistema Cardiovascular" },
      { id: "fisiologia-1", name: "Fisiologia I - Fisiologia Cardiovascular" },
      { id: "fisiologia-2", name: "Fisiologia II - Fisiologia Respiratória" },
      { id: "bioquimica-1", name: "Bioquímica I - Metabolismo" },
      { id: "patologia-1", name: "Patologia Geral" },
      { id: "farmacologia-1", name: "Farmacologia I - Farmacocinética" },
      { id: "clinica-medica-1", name: "Clínica Médica I - Cardiologia" },
      { id: "clinica-medica-2", name: "Clínica Médica II - Pneumologia" },
      { id: "clinica-medica-3", name: "Clínica Médica III - Endocrinologia" },
      { id: "cirurgia-1", name: "Cirurgia Geral I" },
      { id: "pediatria-1", name: "Pediatria I - Crescimento e Desenvolvimento" },
      { id: "ginecologia-1", name: "Ginecologia e Obstetrícia I" },
      { id: "psiquiatria-1", name: "Psiquiatria I - Transtornos de Humor" },
    ],
  },
  {
    id: "engenharia-civil",
    name: "Engenharia Civil",
    topics: [
      { id: "estruturas-1", name: "Estruturas I - Análise Estrutural" },
      { id: "estruturas-2", name: "Estruturas II - Concreto Armado" },
      { id: "estruturas-3", name: "Estruturas III - Aço" },
      { id: "materiais-1", name: "Materiais de Construção I" },
      { id: "geotecnia-1", name: "Geotecnia I - Mecânica dos Solos" },
      { id: "hidraulica-1", name: "Hidráulica I - Escoamento em Condutos" },
      { id: "sanitaria-1", name: "Saneamento I - Abastecimento de Água" },
      { id: "estradas-1", name: "Estradas e Pavimentação I" },
      { id: "fundacoes-1", name: "Fundações I - Fundações Rasas" },
      { id: "fundacoes-2", name: "Fundações II - Fundações Profundas" },
    ],
  },
  {
    id: "administracao",
    name: "Administração",
    topics: [
      { id: "gestao-1", name: "Gestão de Pessoas I" },
      { id: "gestao-2", name: "Gestão de Operações" },
      { id: "marketing-1", name: "Marketing I - Fundamentos" },
      { id: "marketing-2", name: "Marketing II - Estratégico" },
      { id: "financas-1", name: "Finanças I - Análise Financeira" },
      { id: "financas-2", name: "Finanças II - Orçamento Empresarial" },
      { id: "contabilidade-1", name: "Contabilidade Geral" },
      { id: "contabilidade-2", name: "Contabilidade de Custos" },
      { id: "estrategia-1", name: "Estratégia Empresarial" },
      { id: "empreendedorismo-1", name: "Empreendedorismo" },
      { id: "logistica-1", name: "Logística e Cadeia de Suprimentos" },
    ],
  },
  {
    id: "pedagogia",
    name: "Pedagogia",
    topics: [
      { id: "fundamentos-1", name: "Fundamentos da Educação I" },
      { id: "psicologia-educacao-1", name: "Psicologia da Educação" },
      { id: "didatica-1", name: "Didática I - Planejamento" },
      { id: "curriculo-1", name: "Currículo e Avaliação" },
      { id: "educacao-infantil-1", name: "Educação Infantil" },
      { id: "alfabetizacao-1", name: "Alfabetização e Letramento" },
      { id: "educacao-especial-1", name: "Educação Especial e Inclusiva" },
      { id: "gestao-escolar-1", name: "Gestão Escolar" },
      { id: "tecnologia-educacao-1", name: "Tecnologias na Educação" },
    ],
  },
  {
    id: "enfermagem",
    name: "Enfermagem",
    topics: [
      { id: "fundamentos-1", name: "Fundamentos de Enfermagem I" },
      { id: "semiologia-1", name: "Semiologia e Semiotécnica" },
      { id: "saude-adulto-1", name: "Enfermagem em Saúde do Adulto I" },
      { id: "saude-adulto-2", name: "Enfermagem em Saúde do Adulto II" },
      { id: "pediatria-1", name: "Enfermagem Pediátrica" },
      { id: "obstetricia-1", name: "Enfermagem Obstétrica" },
      { id: "saude-mental-1", name: "Enfermagem em Saúde Mental" },
      { id: "saude-coletiva-1", name: "Enfermagem em Saúde Coletiva" },
      { id: "farmacologia-1", name: "Farmacologia Aplicada à Enfermagem" },
      { id: "etica-1", name: "Ética e Legislação em Enfermagem" },
    ],
  },
  {
    id: "psicologia",
    name: "Psicologia",
    topics: [
      { id: "fundamentos-1", name: "Fundamentos Históricos da Psicologia" },
      { id: "desenvolvimento-1", name: "Psicologia do Desenvolvimento I" },
      { id: "desenvolvimento-2", name: "Psicologia do Desenvolvimento II" },
      { id: "social-1", name: "Psicologia Social" },
      { id: "clinica-1", name: "Psicologia Clínica I" },
      { id: "clinica-2", name: "Psicologia Clínica II" },
      { id: "organizacional-1", name: "Psicologia Organizacional" },
      { id: "escolar-1", name: "Psicologia Escolar" },
      { id: "avaliacao-1", name: "Avaliação Psicológica" },
      { id: "neuropsicologia-1", name: "Neuropsicologia" },
    ],
  },
  {
    id: "contabilidade",
    name: "Ciências Contábeis",
    topics: [
      { id: "contabilidade-geral-1", name: "Contabilidade Geral I" },
      { id: "contabilidade-geral-2", name: "Contabilidade Geral II" },
      { id: "custos-1", name: "Contabilidade de Custos I" },
      { id: "custos-2", name: "Contabilidade de Custos II" },
      { id: "societaria-1", name: "Contabilidade Societária" },
      { id: "tributaria-1", name: "Contabilidade Tributária" },
      { id: "analise-demonstracoes-1", name: "Análise das Demonstrações Contábeis" },
      { id: "auditoria-1", name: "Auditoria I" },
      { id: "pericia-1", name: "Perícia Contábil" },
      { id: "planejamento-tributario-1", name: "Planejamento Tributário" },
    ],
  },
  {
    id: "engenharia-producao",
    name: "Engenharia de Produção",
    topics: [
      { id: "planejamento-1", name: "Planejamento e Controle da Produção" },
      { id: "qualidade-1", name: "Gestão da Qualidade" },
      { id: "logistica-1", name: "Logística e Cadeia de Suprimentos" },
      { id: "projeto-produto-1", name: "Projeto de Produto" },
      { id: "ergonomia-1", name: "Ergonomia" },
      { id: "pesquisa-operacional-1", name: "Pesquisa Operacional I" },
      { id: "custos-1", name: "Custos Industriais" },
      { id: "simulacao-1", name: "Simulação de Sistemas" },
      { id: "lean-1", name: "Lean Manufacturing" },
    ],
  },
  {
    id: "arquitetura",
    name: "Arquitetura e Urbanismo",
    topics: [
      { id: "projeto-1", name: "Projeto Arquitetônico I" },
      { id: "projeto-2", name: "Projeto Arquitetônico II" },
      { id: "urbanismo-1", name: "Urbanismo I - Planejamento Urbano" },
      { id: "tecnologia-1", name: "Tecnologia das Construções I" },
      { id: "conforto-1", name: "Conforto Ambiental I - Térmico" },
      { id: "conforto-2", name: "Conforto Ambiental II - Acústico" },
      { id: "historia-1", name: "História da Arquitetura I" },
      { id: "paisagismo-1", name: "Paisagismo" },
      { id: "estruturas-1", name: "Estruturas para Arquitetos" },
    ],
  },
  {
    id: "engenharia-eletrica",
    name: "Engenharia Elétrica",
    topics: [
      { id: "circuitos-1", name: "Circuitos Elétricos I" },
      { id: "circuitos-2", name: "Circuitos Elétricos II" },
      { id: "eletromagnetismo-1", name: "Eletromagnetismo" },
      { id: "maquinas-1", name: "Máquinas Elétricas I" },
      { id: "maquinas-2", name: "Máquinas Elétricas II" },
      { id: "sistemas-energia-1", name: "Sistemas de Energia Elétrica" },
      { id: "eletronica-1", name: "Eletrônica Analógica" },
      { id: "eletronica-2", name: "Eletrônica Digital" },
      { id: "controle-1", name: "Controle de Sistemas" },
      { id: "instalacoes-1", name: "Instalações Elétricas" },
    ],
  },
  {
    id: "sistemas-informacao",
    name: "Sistemas de Informação",
    topics: [
      { id: "programacao-1", name: "Programação I - Fundamentos" },
      { id: "programacao-2", name: "Programação II - Orientada a Objetos" },
      { id: "estrutura-dados-1", name: "Estrutura de Dados" },
      { id: "banco-dados-1", name: "Banco de Dados I" },
      { id: "banco-dados-2", name: "Banco de Dados II" },
      { id: "engenharia-software-1", name: "Engenharia de Software I" },
      { id: "redes-1", name: "Redes de Computadores" },
      { id: "arquitetura-software-1", name: "Arquitetura de Software" },
      { id: "gestao-projetos-1", name: "Gestão de Projetos de Software" },
      { id: "seguranca-1", name: "Segurança da Informação" },
    ],
  },
  {
    id: "ciencia-computacao",
    name: "Ciência da Computação",
    topics: [
      { id: "algoritmos-1", name: "Algoritmos e Estruturas de Dados I" },
      { id: "algoritmos-2", name: "Algoritmos e Estruturas de Dados II" },
      { id: "programacao-1", name: "Programação I" },
      { id: "programacao-2", name: "Programação II" },
      { id: "computacao-teorica-1", name: "Computação Teórica" },
      { id: "inteligencia-artificial-1", name: "Inteligência Artificial" },
      { id: "machine-learning-1", name: "Machine Learning" },
      { id: "compiladores-1", name: "Compiladores" },
      { id: "sistemas-operacionais-1", name: "Sistemas Operacionais" },
      { id: "arquitetura-computadores-1", name: "Arquitetura de Computadores" },
    ],
  },
  {
    id: "educacao-fisica",
    name: "Educação Física",
    topics: [
      { id: "anatomia-1", name: "Anatomia Humana" },
      { id: "fisiologia-1", name: "Fisiologia do Exercício" },
      { id: "biomecanica-1", name: "Biomecânica" },
      { id: "cinesiologia-1", name: "Cinesiologia" },
      { id: "treinamento-1", name: "Teoria do Treinamento" },
      { id: "esportes-1", name: "Fundamentos dos Esportes" },
      { id: "recreacao-1", name: "Recreação e Lazer" },
      { id: "avaliacao-fisica-1", name: "Avaliação Física" },
    ],
  },
  {
    id: "fisioterapia",
    name: "Fisioterapia",
    topics: [
      { id: "anatomia-1", name: "Anatomia Funcional" },
      { id: "cinesiologia-1", name: "Cinesiologia" },
      { id: "biomecanica-1", name: "Biomecânica" },
      { id: "fisioterapia-ortopedica-1", name: "Fisioterapia Ortopédica" },
      { id: "fisioterapia-neurologica-1", name: "Fisioterapia Neurológica" },
      { id: "fisioterapia-respiratoria-1", name: "Fisioterapia Respiratória" },
      { id: "fisioterapia-cardio-1", name: "Fisioterapia Cardiovascular" },
      { id: "avaliacao-1", name: "Avaliação em Fisioterapia" },
    ],
  },
  {
    id: "engenharia-mecanica",
    name: "Engenharia Mecânica",
    topics: [
      { id: "mecanica-solidos-1", name: "Mecânica dos Sólidos I" },
      { id: "mecanica-solidos-2", name: "Mecânica dos Sólidos II" },
      { id: "termodinamica-1", name: "Termodinâmica I" },
      { id: "termodinamica-2", name: "Termodinâmica II" },
      { id: "mecanica-fluidos-1", name: "Mecânica dos Fluidos" },
      { id: "materiais-1", name: "Ciência dos Materiais" },
      { id: "elementos-maquinas-1", name: "Elementos de Máquinas" },
      { id: "vibracoes-1", name: "Vibrações Mecânicas" },
      { id: "controle-1", name: "Controle de Sistemas Mecânicos" },
      { id: "up-1", name: "Manutenção em UP TSI 2016 Stage 2" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    topics: [
      { id: "fundamentos-1", name: "Fundamentos de Marketing" },
      { id: "comportamento-consumidor-1", name: "Comportamento do Consumidor" },
      { id: "pesquisa-marketing-1", name: "Pesquisa de Marketing" },
      { id: "marketing-digital-1", name: "Marketing Digital" },
      { id: "branding-1", name: "Branding e Gestão de Marcas" },
      { id: "comunicacao-1", name: "Comunicação Integrada de Marketing" },
      { id: "vendas-1", name: "Gestão de Vendas" },
      { id: "canais-1", name: "Canais de Distribuição" },
    ],
  },
  {
    id: "publicidade",
    name: "Publicidade e Propaganda",
    topics: [
      { id: "criacao-1", name: "Criação Publicitária I" },
      { id: "criacao-2", name: "Criação Publicitária II" },
      { id: "planejamento-1", name: "Planejamento de Mídia" },
      { id: "redacao-1", name: "Redação Publicitária" },
      { id: "design-1", name: "Design Gráfico Aplicado" },
      { id: "comunicacao-1", name: "Teoria da Comunicação" },
      { id: "marketing-1", name: "Marketing Aplicado à Publicidade" },
      { id: "digital-1", name: "Publicidade Digital" },
    ],
  },
  {
    id: "jornalismo",
    name: "Jornalismo",
    topics: [
      { id: "redacao-1", name: "Redação Jornalística I" },
      { id: "redacao-2", name: "Redação Jornalística II" },
      { id: "teoria-comunicacao-1", name: "Teoria da Comunicação" },
      { id: "radio-1", name: "Jornalismo em Rádio" },
      { id: "tv-1", name: "Jornalismo em TV" },
      { id: "digital-1", name: "Jornalismo Digital" },
      { id: "fotojornalismo-1", name: "Fotojornalismo" },
      { id: "etica-1", name: "Ética e Legislação Jornalística" },
    ],
  },
];

/**
 * Busca um curso pelo ID
 */
export function getCourseById(courseId: string): Course | undefined {
  return courses.find((course) => course.id === courseId);
}

/**
 * Busca um tópico de um curso específico
 */
export function getTopicById(courseId: string, topicId: string): CourseTopic | undefined {
  const course = getCourseById(courseId);
  return course?.topics.find((topic) => topic.id === topicId);
}

/**
 * Retorna todos os cursos disponíveis, ordenados alfabeticamente por nome
 */
export function getAllCourses(): Course[] {
  return [...courses].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

/**
 * Retorna todos os tópicos de um curso específico
 */
export function getCourseTopics(courseId: string): CourseTopic[] {
  const course = getCourseById(courseId);
  return course?.topics || [];
}

/**
 * Constrói o prompt personalizado para geração de quiz
 */
export function buildQuizPrompt(
  courseName: string,
  topicName: string,
  difficulty: string,
  additionalInfo?: string
): string {
  let prompt = basePrompt
    .replace("(CURSO)", courseName)
    .replace("(TÓPICO)", topicName)
    .replace("(DIFICULDADE)", difficulty);

  if (additionalInfo && additionalInfo.trim()) {
    prompt = prompt.replace("(INFO_ADICIONAL)", additionalInfo);
  } else {
    prompt = prompt.replace("**INFORMAÇÕES ADICIONAIS:**\n(INFO_ADICIONAL)\n\n", "");
  }

  return prompt;
}
