# Site de Casamento D&T

Site de página única, pensado primeiro para o celular, que reúne tudo o que o convidado precisa saber sobre o casamento, permite confirmar presença e presentear os noivos.

A documentação completa está em [docs/Site de Casamento — Documentação do Projeto.pdf](docs/Site%20de%20Casamento%20—%20Documentação%20do%20Projeto.pdf). Em caso de conflito, o PDF vale; este README é atualizado sempre que uma pendência for decidida.

| Item                  | Definição                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Público               | Convidados em geral: amigos, familiares e conhecidos                                                                          |
| Objetivo              | Unificar informações do casamento, fotos e história dos noivos, detalhes do dia, confirmação de presença e lista de presentes |
| Dispositivo principal | Celular (mobile first), com versão web responsiva                                                                             |
| Prazo                 | 15 dias a partir do início da implementação                                                                                   |
| Responsável técnico   | Leonardo                                                                                                                      |

## Escopo do MVP

### Dentro do escopo

- Página única com rolagem e seções animadas
- História e fotos dos noivos
- Informações do dia: cerimônia, recepção, horários e endereços
- Mapa com botões para abrir a rota no Google Maps e no Waze
- Confirmação de presença por formulário, com e-mail para os noivos
- Lista de presentes em cotas em dinheiro, com Pix e cartão de crédito

### Fora do escopo (por enquanto)

- Lista de convidados pré-cadastrada e links individuais por convite
- Envio automático de mensagens por WhatsApp
- Login de convidados

## Funcionalidades

O site tem um menu que leva a cada seção. A ordem pode mudar conforme a referência visual da noiva.

| ID   | Seção                 | O que o convidado faz ou vê                                                                            |
| ---- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| RF01 | Home                  | Nomes dos noivos, monograma, data e chamada para confirmar presença                                    |
| RF02 | Nossa história        | Marcos do relacionamento em linha do tempo, com fotos                                                  |
| RF03 | Galeria               | Fotos dos noivos, otimizadas para celular                                                              |
| RF04 | O grande dia          | Data, horários, endereços da cerimônia e da recepção e informações do dia (traje, estacionamento etc.) |
| RF05 | Como chegar           | Mapa e botões "Abrir no Google Maps" e "Abrir no Waze", já com rota                                    |
| RF06 | Confirme sua presença | Formulário de confirmação, com data limite visível                                                     |
| RF07 | Lista de presentes    | Cards de cotas com nome, imagem, valor e botão "Presentear"                                            |
| RF08 | Rodapé                | Contato dos noivos por link de WhatsApp e mensagem final                                               |

Os links de rota abrem direto no aplicativo quando o convidado está no celular:

- Google Maps: `https://www.google.com/maps/dir/?api=1&destination=LAT,LNG`
- Waze: `https://waze.com/ul?ll=LAT,LNG&navigate=yes`

### Confirmação de presença

Formulário aberto no Netlify Forms, sem lista pré-cadastrada de convidados. Cada resposta gera um e-mail para os noivos.

| Campo                   | Tipo        | Obrigatório            |
| ----------------------- | ----------- | ---------------------- |
| Nome completo           | Texto       | Sim                    |
| Telefone (WhatsApp)     | Telefone    | Sim                    |
| Vai comparecer?         | Sim / Não   | Sim                    |
| Quantidade de pessoas   | Número      | Sim, se for comparecer |
| Nomes dos acompanhantes | Texto       | Não                    |
| Recado para os noivos   | Texto longo | Não                    |

Regras:

- O telefone é obrigatório para identificar respostas repetidas.
- A data limite aparece no site; depois dela o formulário fica fechado. Para bloquear envios de verdade, o formulário também deve ser desativado no painel do Netlify nesse dia.
- Proteção contra spam com honeypot. O reCAPTCHA entra se aparecer spam (com chave própria, porque o reCAPTCHA nativo do Netlify não atende formulários enviados por JavaScript).
- Um formulário HTML oculto no `index.html` permite que o Netlify detecte o formulário no build.
- Após o envio, o convidado vê uma mensagem de agradecimento.
- Um aviso curto ao lado do formulário explica para que o telefone é usado e que só os noivos veem as respostas (LGPD).

O acompanhamento de quem não respondeu é manual: perto do evento, os noivos reenviam o link pedindo que só quem ainda não confirmou responda.

### Lista de presentes

Cotas em dinheiro (ex.: "Jantar na lua de mel – R$ 150"), pagas com Pix ou cartão de crédito. Cada cota tem nome, imagem, valor e botão "Presentear".

Ao clicar em "Presentear", um modal pede nome e recado, envia o registro ao Netlify Forms e, depois da confirmação do envio, redireciona para o pagamento na mesma aba. Os noivos recebem o registro por e-mail. O registro indica a intenção de presentear, não o pagamento confirmado.

A solução de pagamento ainda será escolhida:

| Opção                      | Como funciona                                                      | Prós                                                                                         | Contras                                                                    |
| -------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Links InfinitePay por cota | Os noivos criam um link no app para cada cota; o botão abre o link | Pix e cartão no mesmo link, Pix sem taxa, nenhum dado de cartão passa pelo site, sem backend | Valor fixo por cota, links criados manualmente, pagamento conferido no app |
| Mercado Pago Checkout Pro  | Uma função serverless cria o pagamento; um webhook confirma        | Valor livre, registro automático de quem pagou                                               | Exige backend e banco, mais dias de desenvolvimento, taxa também no Pix    |

### Área administrativa

No MVP não há painel próprio; o Netlify atende:

| Necessidade                | Como fica atendida                                                         |
| -------------------------- | -------------------------------------------------------------------------- |
| Ver confirmações e recusas | E-mail a cada resposta e lista de envios no painel do Netlify              |
| Ver quem presenteou        | E-mail a cada registro de presente, mais a conferência no app de pagamento |
| Contar o total de pessoas  | Exportar as respostas em CSV pelo Netlify                                  |
| Saber quem não respondeu   | Manual, comparando com a lista dos noivos                                  |

## Requisitos não funcionais

| ID    | Requisito          | Detalhe                                                                                         |
| ----- | ------------------ | ----------------------------------------------------------------------------------------------- |
| RNF01 | Mobile first       | Layout pensado a partir de telas de celular; adaptação para tablet e desktop                    |
| RNF02 | Desempenho         | Fotos em WebP, redimensionadas e com carregamento sob demanda (lazy loading)                    |
| RNF03 | Animações leves    | Animações fluidas no celular e respeito ao `prefers-reduced-motion`                             |
| RNF04 | Segurança          | HTTPS, proteção contra spam nos formulários, nenhum dado de cartão no site                      |
| RNF05 | Privacidade (LGPD) | Coletar só os dados necessários; respostas visíveis apenas para os noivos                       |
| RNF06 | Acessibilidade     | Contraste adequado nos tons de azul, textos alternativos nas imagens, botões grandes para toque |
| RNF07 | Compatibilidade    | Navegadores atuais de Android e iOS (Chrome e Safari)                                           |

## Stack e arquitetura

Site estático em React hospedado no Netlify, sem backend próprio: os formulários ficam no Netlify Forms e o pagamento em um serviço externo.

| Camada                     | Tecnologia                                                                      | Papel                                                                  |
| -------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Front-end                  | React + Vite + TypeScript                                                       | Página única, um componente por seção                                  |
| Animações                  | Lenis + GSAP ScrollTrigger ou Framer Motion (a definir durante a implementação) | Rolagem suave, parallax e profundidade                                 |
| Hospedagem                 | Netlify                                                                         | Deploy contínuo a partir do GitHub, HTTPS                              |
| Formulários                | Netlify Forms                                                                   | Confirmação de presença e registro de presentes, com e-mail aos noivos |
| Pagamento                  | A definir (InfinitePay ou Mercado Pago)                                         | Página de pagamento externa e segura                                   |
| Mapas                      | Links do Google Maps e do Waze                                                  | Rota aberta direto no aplicativo                                       |
| Backend (só se necessário) | Netlify Functions (Node.js) + Supabase                                          | Webhook de pagamento ou painel próprio, caso entrem no escopo          |

Todo o conteúdo dos noivos (textos, datas, endereços, cotas e links) fica em arquivos de dados em `src/content/`, separado dos componentes. Assim os textos provisórios são trocados pelos reais sem mexer no layout.

## Como rodar

Requer Node.js 24 ou superior.

```bash
npm install
npm run dev      # servidor local; também mostra um endereço para abrir no celular (mesmo Wi-Fi)
npm run build    # checagem de tipos + build de produção em dist/
npm run lint     # Oxlint
npm run format   # Prettier
```

## Identidade visual

- **Cores:** azul em diversos tons; a paleta final em hexadecimal sai da referência da Home e do monograma.
- **Tipografia (a validar):** serifada elegante nos títulos (Cormorant Garamond ou Playfair Display), sem serifa no texto (Inter ou Montserrat) e cursiva só nos nomes ou no monograma (Great Vibes ou Pinyon Script). Todas do Google Fonts, servidas pelo próprio site via Fontsource.
- **Referência da Home (recebida):** foto em tela cheia com os noivos, menu discreto em caixa alta, data em destaque, nomes em serifada grande, citação em itálico, contagem regressiva e dois botões ("Confirmar presença" e "Ver informações"). Serve de base, não para copiar.
- **Rolagem com profundidade:** parallax e camadas. Three.js só se a referência exigir 3D real, por causa do peso no celular e do prazo.
- **Animações de fundo:** elementos sutis (formas, brilhos ou ornamentos) que não disputem atenção com o conteúdo.

## Fluxo de implementação

Cinco fases em 15 dias, com duas aprovações dos noivos: o visual no dia 2 e a revisão completa no dia 12.

### Fase 1 — Setup e base (dias 1–2)

1. ~~Criar o projeto com Vite, React e TypeScript, Oxlint e Prettier.~~ ✅
2. Montar a estrutura de pastas: um componente por seção em `src/sections/` e o conteúdo em `src/content/`.
3. Definir paleta, tipografia, espaçamentos e botões com área de toque grande.
4. Montar a página com as 8 seções em versão simples, o menu fixo e a rolagem até cada seção.

**Aprovação 1:** visual aprovado pelos noivos, apresentado em localhost por chamada no Google Meet.

A conexão com o Netlify fica para antes da Fase 3, porque cada build consome créditos do plano gratuito e o Netlify Forms só funciona com o site publicado.

### Fase 2 — Seções de conteúdo (dias 3–6)

1. Home, Nossa história (linha do tempo), Galeria, O grande dia e Como chegar.
2. Script que converte as fotos do Google Drive para WebP em vários tamanhos, com carregamento sob demanda.

### Fase 3 — Formulários e presentes (dias 7–9)

1. Formulário de confirmação com o campo condicional de quantidade de pessoas, a data limite e a mensagem de agradecimento.
2. Cards de cotas e modal de "Presentear" com registro no Netlify Forms e redirecionamento ao pagamento.
3. Configuração dos e-mails de notificação no painel do Netlify.

Se a opção de pagamento for o Mercado Pago, esta fase precisa de mais dias, que saem da fase de animações.

### Fase 4 — Animações e polimento (dias 10–12)

1. Rolagem suave, parallax e animações de fundo.
2. Suporte a `prefers-reduced-motion` e ajustes de desempenho no celular.

**Aprovação 2:** revisão completa pelos noivos.

### Fase 5 — Testes e entrega (dias 13–15)

1. Testes em celulares reais com Android e iOS, acessibilidade e Lighthouse.
2. Ajustes finais com os noivos, domínio próprio (se houver) e publicação.

## Conteúdo e insumos dos noivos

Fotos e arquivos visuais chegam por uma pasta no Google Drive compartilhada pelos noivos.

- [ ] Pasta no Google Drive compartilhada com o Leonardo
- [ ] Fotos dos noivos e dos locais
- [ ] Monograma do casamento (de preferência em SVG ou PNG com fundo transparente)
- [x] Print de referência da Home (recebido em 18/11; usar como base, sem copiar)
- [ ] Foto de fundo da Home
- [ ] Textos da história e marcos do relacionamento, com datas
- [ ] Data, horários e endereços da cerimônia e da recepção
- [ ] Informações específicas do dia (traje, estacionamento, observações)
- [ ] Data limite para confirmação de presença
- [ ] E-mail que vai receber as notificações
- [ ] Lista de cotas: nome, valor e imagem de cada uma
- [ ] Telefone para o botão de WhatsApp

## Decisões e pendências

### Decisões tomadas

| Tema                    | Decisão                                                      |
| ----------------------- | ------------------------------------------------------------ |
| Confirmação de presença | Formulário aberto no Netlify Forms, com e-mail aos noivos    |
| Lista de convidados     | Sem lista pré-cadastrada; acompanhamento manual pelos noivos |
| Presentes               | Cotas em dinheiro, com Pix e cartão de crédito               |
| Hospedagem              | Netlify                                                      |
| Front-end               | React + Vite + TypeScript                                    |
| Estilização             | CSS Modules + variáveis CSS                                  |
| Fontes                  | Servidas pelo próprio site (Fontsource)                      |
| Fotos                   | Pasta no Google Drive compartilhada pelos noivos             |
| Cronograma              | Início em 18/11/2026; entrega em 02/12/2026                  |
| Prévias para os noivos  | Localhost por Google Meet; Netlify conectado antes da Fase 3 |

### Pendências

- [ ] Escolher a solução de pagamento: links InfinitePay ou Mercado Pago Checkout Pro
- [ ] Definir se o painel do Netlify basta ou se haverá painel próprio
- [ ] Fechar a paleta de azuis e a tipografia
- [ ] Escolher a biblioteca de animação (GSAP ScrollTrigger ou Framer Motion)
- [ ] Confirmar a data do casamento
- [ ] Definir se haverá domínio próprio (ex.: nomedosnoivos.com.br)
