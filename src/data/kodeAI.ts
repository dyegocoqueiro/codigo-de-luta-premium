interface AIRule {
  keywords: string[];
  responses: string[];
}

const rules: AIRule[] = [
  {
    keywords: ["jab", "jab duplo", "como fazer jab"],
    responses: [
      "O Jab é a arma mais importante do lutador. Posição: guarda ortodoxa ou canhota, cotovelo para baixo, mão traseira protegendo o queixo.\n\n**Mecânica:** Estenda o braço da frente em linha reta, rotacione o punho ao impactar (soco em pronação), recue imediatamente ao rosto. Quadril levemente rotaciona mas não exagere.\n\n**Drill:** 3 rounds de 3min no espelho. Primeiro round: câmara lenta com qualidade técnica. Segundo: ritmo moderado. Terceiro: burst de 10 jabs + saída.\n\n**Erros comuns:** Cotovelo para cima, não recuar a mão, perda de guarda traseira.",
      "O Jab é seu radar — use-o para medir distância, interromper o ritmo do oponente e abrir combos.\n\n**Tipos de Jab:**\n• Jab de sonda — leve, apenas para medir\n• Jab de poder — rotação completa do ombro\n• Jab de pressão — avance junto com o pé\n• Jab de saída — atire e recue simultaneamente\n\n**Treino solo:** 500 jabs por sessão divididos nesses 4 tipos. Qualidade acima de quantidade.",
    ]
  },
  {
    keywords: ["direto", "cross", "soco direto"],
    responses: [
      "O Direto (Cross) é seu golpe de poder mais confiável.\n\n**Mecânica:** Da guarda, rotacione o quadril e ombro traseiro explosivamente. O calcanhar traseiro levanta levemente. Punho rotaciona ao impactar. Recue imediatamente.\n\n**Sequência recomendada:** Jab → Direto sempre que possível. O jab abre a guarda, o direto capitaliza.\n\n**Drill:** 4 rounds de 2min no saco. Foco em snap — velocidade de retorno — não em força bruta.",
    ]
  },
  {
    keywords: ["muay thai", "thai", "cotovelada", "joelhada", "clinch"],
    responses: [
      "O Muay Thai é a arte dos 8 membros — punhos, cotovelos, joelhos e pernas. No sistema Código de Luta, você vai dominar:\n\n**Fundamentos Muay Thai para Solo:**\n• Teep (chute frontal) — seu jab das pernas\n• Low kick — ataque à coxa/panturrilha\n• Roundhouse médio e alto\n• Joelhos no clinch (simule com saco)\n• Cotoveladas (treino técnico, sem contato)\n\n**Drill semanal:** Semana 1-2: Teep + Low kick. Semana 3-4: Clinch knee + Roundhouse. Semana 5+: integração com boxing.\n\nLembre: O Muay Thai exige condicionamento de pernas. Inclua 50 roundhouses por lado em cada sessão.",
      "No Muay Thai, o clinch é onde você separa os iniciantes dos lutadores reais.\n\n**Treino de clinch solo:**\n1. Simule com saco de areia\n2. 30 joelhos alternados × 5 séries\n3. Prática de entrada: Jab → Direto → passo interno → clinch\n4. Saída de clinch: push + teep de seguimento\n\nSemana recomendada: Módulo 2 do seu programa.",
    ]
  },
  {
    keywords: ["bjj", "jiu", "jiu-jitsu", "chão", "solo ground", "guard"],
    responses: [
      "BJJ Solo é um dos pilares mais subestimados do treino individual. Sem parceiro, você pode trabalhar:\n\n**8 Movimentos Fundamentais:**\n1. Shrimp (escape de quadril)\n2. Technical stand-up\n3. Bridge & roll (Upa)\n4. Granby roll\n5. Hip escape para half guard\n6. Guard recovery\n7. Base-up de turtle position\n8. Framing e saída de pressão\n\n**Circuito BJJ Solo:** 5 min contínuos de shrimp + base-up + technical stand-up. Faça 3 séries.\n\n⚠️ Sempre use tatame ou superfície adequada para treino no chão.",
    ]
  },
  {
    keywords: ["condicionamento", "preparo físico", "cardio", "resistência", "cansaço"],
    responses: [
      "O condicionamento do lutador é diferente do condicionamento geral. Você precisa de:\n\n**Energia Explosiva (ATP-PC):** Sprints de 10s, burpees, sprawls explosivos\n**Resistência Anaeróbica (Glicolítica):** Rounds de 3min com alta intensidade\n**Base Aeróbica:** Corrida leve, pular corda, sombra de baixa intensidade\n\n**Protocolo semanal Código de Luta:**\n• 3x/semana: Treino técnico (combos, drills)\n• 2x/semana: Condicionamento específico\n• 1x/semana: Ativo de recuperação (mobilidade, caminhada)\n• 1x/semana: Descanso\n\n**Pular corda:** 15-20min por sessão é o melhor condicionamento solo para lutadores.",
      "Cansaço no meio do round? Isso é problema de base aeróbica.\n\n**Programa de condicionamento de 4 semanas:**\nSemana 1: Pular corda 10min + 3 rounds shadow\nSemana 2: Pular corda 15min + 5 rounds shadow\nSemana 3: Intervals: 20s luta intensa + 10s descanso × 8 séries\nSemana 4: Sparring simulado ou 6 rounds shadow a 80% de intensidade\n\nO lutador que não cansa, vence pelo desgaste.",
    ]
  },
  {
    keywords: ["combo", "sequência", "combinação", "encadear"],
    responses: [
      "Para encadear combos de forma eficiente, siga estes princípios do Código de Luta:\n\n**Lei do Combo:**\n1. Sempre termine com SAÍDA — nunca fique no centro\n2. Varie altura: corpo → cabeça → corpo\n3. Varie velocidade: lento → rápido → lento\n4. Nunca mais de 5-6 golpes sem footwork\n\n**Combo base recomendado para hoje:**\nJab → Direto → Low kick → Clinch → Saída lateral\n\n**Drill:** 3 rounds de 3min no saco. Primeiro 1min: câmara lenta. Segundo 1min: 70%. Último 1min: explosivo.",
      "Combos eficientes nascem de fundamentos sólidos. Verifique:\n\n✓ Guarda retorna após cada golpe?\n✓ Footwork ativo entre as combinações?\n✓ Respiração — você está prendendo a respiração?\n✓ Saída — cada combo termina com movimento?\n\nComece com 2 golpes + saída. Adicione um golpe por semana. Em 4 semanas você tem um combo real de 6 golpes com qualidade.",
    ]
  },
  {
    keywords: ["semana", "programa", "treino hoje", "qual treino", "o que treinar"],
    responses: [
      "O programa Código de Luta tem 8 semanas divididas em 4 fases:\n\n**Semanas 1-2 — Fundação:** Postura, guarda, golpes básicos, footwork\n**Semanas 3-4 — Volume:** Mais rounds, combinações, reflexo\n**Semanas 5-6 — Integração:** Transições entre módulos, pressão\n**Semanas 7-8 — Pico Técnico:** Avaliação, testes parciais\n\n**Para hoje:** Consulte seu painel de evolução para ver em qual semana você está. Cada semana tem checklist específico de drills.\n\nDica: nunca pule para a próxima semana sem completar o checklist da semana atual.",
    ]
  },
  {
    keywords: ["soco", "poder", "força", "nocaute", "KO"],
    responses: [
      "Poder no soco vem de mecânica, não de músculo.\n\n**A cadeia cinética do soco poderoso:**\nPé → Tornozelo → Joelho → Quadril → Torso → Ombro → Braço → Punho\n\n**O que bloqueia potência:**\n• Ombros tensos antes do golpe\n• Não usar o quadril (força apenas de braço = -60% de potência)\n• Punho não rotaciona ao impactar\n\n**Drill de potência:** No saco pesado, 10 socos de PODER por série. Não conta velocidade, conta a transferência de peso. Sinta o saco se mover, não apenas tremendo.",
    ]
  },
  {
    keywords: ["defesa", "bloqueio", "esquiva", "proteção", "tomar golpe"],
    responses: [
      "No Código de Luta, defesa é tão importante quanto ataque — é o que os amadores negligenciam.\n\n**Sistema de defesa solo (treine nesta ordem):**\n1. **Guarda alta** — cotovelos para dentro, luvas nas têmporas\n2. **Slip** — esquiva lateral da cabeça, não inclinação\n3. **Bob & weave** — meia-lua por baixo do soco\n4. **Pull back** — recuar apenas a cabeça\n5. **Parry** — redirecionar o jab do oponente\n\n**Drill de defesa:** Shadowbox de 3min onde você APENAS defende e sai — sem atacar. Treina você a não confiar só no ataque.",
    ]
  },
  {
    keywords: ["krav", "krav maga", "autodefesa", "rua", "situação real"],
    responses: [
      "O módulo de Krav Maga Responsável do Código de Luta tem 3 pilares:\n\n**1. Prevenção (80% da autodefesa)**\n• Consciência situacional — identifique ameaças antes\n• Saída de linha — nunca fique em espaços confinados desnecessariamente\n• Barreira verbal — desescale verbalmente\n\n**2. Resposta Mínima Necessária**\n• Bloqueio + 1-2 golpes de saída\n• Fuja imediatamente após\n• Nunca continue além do necessário\n\n**3. Pós-incidente**\n• Ligue para a polícia\n• Documente\n• Procure suporte\n\n⚠️ Técnicas de defesa real NÃO substituem habilidades de esporte de contato. As duas se complementam.",
    ]
  },
  {
    keywords: ["recuperação", "descanso", "dor muscular", "overtraining"],
    responses: [
      "Recuperação é treino. Sem ela, você regride, não progride.\n\n**Protocolo de recuperação do Código de Luta:**\n• **Ativo:** Caminhada 30min, mobilidade, alongamento\n• **Frio:** Banho frio pós-treino intenso (2-3min)\n• **Sono:** 7-9h é onde acontece a adaptação muscular\n• **Nutrição:** Proteína pós-treino (30-40g), carboidratos de reposição\n\n**Sinais de overtraining:**\n• Queda de desempenho\n• Irritabilidade\n• Sono ruim mesmo cansado\n• Frequência cardíaca em repouso elevada\n\nSe identificar 3+ desses sinais: tire 3-5 dias apenas com recuperação ativa.",
    ]
  },
  {
    keywords: ["equipamento", "equipamentos", "saco", "o que comprar", "luvas"],
    responses: [
      "Para treino solo no Código de Luta, o equipamento mínimo viável é barato:\n\n**Lista Básica (R$150-300):**\n• Luvas de boxing 12-14oz — para saco e sparring\n• Bandagem elástica — proteção dos punhos\n• Corda de pular — essencial para condicionamento\n• Tatame de EVA (se for fazer BJJ solo)\n\n**Adicionais recomendados:**\n• Saco de pancada (standing bag) — R$200-500\n• Manoplas (se tiver um parceiro) — R$60-100\n• Protetor bucal — obrigatório para sparring\n• Caneleiras Muay Thai — para chutes no saco\n\n**Não invista em:** Equipamentos caros sem antes dominar os fundamentos.",
    ]
  },
  {
    keywords: ["mma", "artes marciais mistas"],
    responses: [
      "MMA é a integração de todos os sistemas de combate. No Código de Luta, você desenvolve:\n\n**Módulo MMA Integrado (Módulo 8):**\n• Shadow MMA de 3min — transição fluida entre todos os módulos\n• Protocolo: Boxing → Kicks → Clinch → Ground → Stand-up → Boxing\n• Cada transição deve ser suave, não telegrafada\n\n**Semanas 5-8** são dedicadas à integração. Não pule para elas sem completar os módulos individuais (1-7) primeiro.\n\n**Drill Shadow MMA hoje:**\n3 rounds de 3min. Alterne estilos a cada 30 segundos: boxing, thai, clinch, ground, wrestling. Deixe fluir naturalmente.",
    ]
  },
  {
    keywords: ["sambo", "wrestling", "luta agarrada", "queda"],
    responses: [
      "Sambo e Wrestling no contexto MMA são sobre:\n\n**Wrestling para MMA:**\n• Sprawl — defesa anti-takedown essencial\n• Level change — entrada para takedown\n• Double leg simulado\n• Clinch wrestling\n\n**Drill de Sprawl (solo):**\n1. Posição neutra\n2. Sinal → Level change explosivo\n3. Sprawl imediato — quadris para baixo\n4. Retorno ao pé técnico\n5. Repetir\n20 repetições × 4 séries\n\n**Sambo adiciona:** Chaves de perna (no sparring apenas), quedas de judô adaptadas.\n\nFoco primeiro no sprawl — é a habilidade mais valiosa do wrestling para MMA.",
    ]
  },
];

function findBestResponse(message: string): string {
  const lower = message.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (const rule of rules) {
    for (const kw of rule.keywords) {
      const kwNorm = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (lower.includes(kwNorm)) {
        const idx = Math.floor(Math.random() * rule.responses.length);
        return rule.responses[idx];
      }
    }
  }

  return getGenericResponse(lower);
}

function getGenericResponse(msg: string): string {
  const greetings = ["oi", "ola", "bom dia", "boa tarde", "boa noite", "oi kode", "e ai"];
  if (greetings.some(g => msg.includes(g))) {
    return "Saudações, guerreiro! Sou o Kode, seu treinador de combate híbrido.\n\nEstou aqui para guiar seu treino no Código de Luta — covering Boxe, Muay Thai, Kickboxing, Sanda, BJJ Solo, Sambo/Wrestling, Krav Maga e MMA Integrado.\n\nMe pergunte sobre:\n• Técnicas e mecânica de golpes\n• Combos e sequências\n• Condicionamento e recuperação\n• Programa das 8 semanas\n• Equipamentos\n\nQual aspecto do seu treino quer melhorar hoje?";
  }

  const fallbacks = [
    "Boa pergunta, guerreiro. No contexto do Código de Luta, sempre comece com o fundamento: postura correta, guarda ativa, footwork constante. Me fale mais sobre o que está treinando e posso direcionar melhor — qual módulo ou técnica específica você quer aprimorar?",
    "Para evoluir no sistema híbrido, você precisa de três pilares: técnica, volume e consistência. Nenhum combo sofisticado substitui fundamentos sólidos. Qual módulo você está trabalhando esta semana? Posso dar um drill específico.",
    "Cada lutador tem suas fraquezas e fortalezas. No Código de Luta, identificamos as lacunas e trabalhamos sistematicamente. Me conte: você é iniciante, intermediário ou avançado? E qual arte marcial tem mais background?",
    "No sistema Código de Luta, seguimos a progressão: fundação → volume → integração → pico técnico. Para responder melhor, preciso saber: em qual semana do programa você está? E qual dificuldade específica quer resolver?",
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export function getKodeResponse(message: string): string {
  return findBestResponse(message);
}

export const SUGGESTED_QUESTIONS = [
  "Como faço o jab correto?",
  "Qual combo devo treinar hoje?",
  "Como melhorar meu condicionamento?",
  "Me explique o sprawl",
  "Técnicas de defesa para treinar solo",
  "Como funciona o programa de 8 semanas?",
];
