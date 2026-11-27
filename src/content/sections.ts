// Títulos e textos fixos de cada capítulo. Ajustáveis pelos noivos sem mexer no layout.
export const sectionTexts = {
  hero: {
    lead: 'Estamos contando os dias para celebrar esse momento com você.',
    // Único botão da Home: convida a percorrer o site (e não a pular direto para uma seção)
    cta: 'Entre na nossa história',
  },
  story: { eyebrow: 'Nossa história', title: 'Nossos momentos' },
  event: { eyebrow: 'O grande dia', timePending: 'horário a definir' },
  location: { eyebrow: 'Como chegar', title: 'O caminho até nós' },
  rsvp: { eyebrow: 'Convite', title: 'Confirme sua presença' },
  manual: { eyebrow: 'Para os convidados', title: 'Manual dos convidados' },
  gifts: {
    eyebrow: 'Lista de presentes',
    title: 'Presenteie os noivos',
    intro:
      'Sua presença é o nosso maior presente. Se quiser nos presentear, escolha uma cota abaixo.',
  },
  footer: {
    contactCta: 'Falar com os noivos',
    contactHint: 'Com quem você quer falar?',
  },
} as const
