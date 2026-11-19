# Site de Casamento D&T

Site de página única, pensado primeiro para o celular, que reúne tudo o que o convidado precisa saber sobre o casamento, permite confirmar presença e presentear os noivos.

A documentação completa está em [docs/Site de Casamento — Documentação do Projeto.pdf](docs/Site%20de%20Casamento%20—%20Documentação%20do%20Projeto.pdf). O PDF é a documentação original; as decisões tomadas depois dele ficam registradas neste README (seção [Decisões e pendências](#decisões-e-pendências)) e prevalecem sobre o PDF, como a troca do Netlify pelo Vercel e da Netlify Forms pela planilha Google.

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
| RF02 | Nossa história        | Momentos do casal em linha do tempo: data específica, foto e breve descrição                           |
| RF03 | ~~Galeria~~           | Unida à Nossa história a pedido da noiva: cada momento tem sua foto                                    |
| RF04 | O grande dia          | Data, horários, endereços da cerimônia e da recepção e informações do dia (traje, estacionamento etc.) |
| RF05 | Como chegar           | Mapa e botões "Abrir no Google Maps" e "Abrir no Waze", já com rota                                    |
| RF06 | Confirme sua presença | Formulário de confirmação, com data limite visível                                                     |
| RF07 | Lista de presentes    | Cards de cotas com nome, imagem, valor e botão "Presentear"                                            |
| RF08 | Rodapé                | Contato dos noivos por link de WhatsApp e mensagem final                                               |

Os links de rota abrem direto no aplicativo quando o convidado está no celular:

- Google Maps: `https://www.google.com/maps/dir/?api=1&destination=LAT,LNG`
- Waze: `https://waze.com/ul?ll=LAT,LNG&navigate=yes`

### Confirmação de presença

Formulário aberto, sem lista pré-cadastrada de convidados. Cada resposta é gravada numa planilha Google e gera um e-mail para os noivos (ver [Formulários e área administrativa](#formulários-e-área-administrativa)).

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
- A data limite aparece no site; depois dela o formulário fica fechado. O script da planilha também recusa envios fora do prazo, então o bloqueio vale mesmo para quem tentar enviar por fora do site.
- Proteção contra spam com um campo-armadilha invisível (honeypot), verificado no script. Se aparecer spam, entra uma verificação extra (ex.: reCAPTCHA ou Cloudflare Turnstile).
- Após o envio, o convidado vê uma mensagem de agradecimento.
- Um aviso curto ao lado do formulário explica para que o telefone é usado e que só os noivos veem as respostas (LGPD).

O acompanhamento de quem não respondeu é manual: perto do evento, os noivos reenviam o link pedindo que só quem ainda não confirmou responda.

### Lista de presentes

Cotas em dinheiro (ex.: "Jantar na lua de mel – R$ 150"), pagas com Pix ou cartão de crédito. Cada cota tem nome, imagem, valor e botão "Presentear".

Ao clicar em "Presentear", um modal pede nome e recado, grava o registro na planilha (aba de presentes) e, depois da confirmação do envio, redireciona para o pagamento na mesma aba. Os noivos recebem o registro por e-mail. O registro indica a intenção de presentear, não o pagamento confirmado.

A solução de pagamento ainda será escolhida:

| Opção                      | Como funciona                                                      | Prós                                                                                         | Contras                                                                    |
| -------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Links InfinitePay por cota | Os noivos criam um link no app para cada cota; o botão abre o link | Pix e cartão no mesmo link, Pix sem taxa, nenhum dado de cartão passa pelo site, sem backend | Valor fixo por cota, links criados manualmente, pagamento conferido no app |
| Mercado Pago Checkout Pro  | Uma função serverless cria o pagamento; um webhook confirma        | Valor livre, registro automático de quem pagou                                               | Exige backend e banco, mais dias de desenvolvimento, taxa também no Pix    |

### Formulários e área administrativa

Não há painel próprio: a área administrativa é uma **planilha Google** compartilhada com os noivos.

- **Conta:** uma conta Google do projeto, criada e mantida pelo Leonardo, dona da planilha e do script. Os avisos por e-mail saem em nome dela.
- **Como funciona:** os formulários do site enviam para um script do Google (Apps Script) ligado à planilha, que grava a resposta e envia o e-mail de aviso. Funciona em qualquer hospedagem.
- **Acesso dos noivos:** editores da planilha, com os próprios e-mails, sem precisar de senha. Os avisos vão para os e-mails pessoais deles.
- **Proteção:** a aba de respostas é travada (só o script escreve nela); os noivos têm uma coluna livre para anotações e uma aba de resumo com os totais.
- **Limite:** cerca de 100 e-mails por dia numa conta Google comum, suficiente para um casamento.
- **Depois do casamento:** transferir a planilha para os noivos ou apagar os dados dos convidados (LGPD).

| Necessidade                | Como fica atendida                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------- |
| Ver confirmações e recusas | E-mail a cada resposta e a lista completa na planilha                               |
| Ver quem presenteou        | E-mail a cada registro e a aba de presentes, mais a conferência no app de pagamento |
| Contar o total de pessoas  | Aba de resumo, calculada automaticamente                                            |
| Saber quem não respondeu   | Manual, comparando com a lista dos noivos (coluna de anotações)                     |

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

Site estático em React hospedado no Vercel, sem backend próprio: os formulários gravam numa planilha Google (via Apps Script) e o pagamento fica num serviço externo.

| Camada                     | Tecnologia                              | Papel                                                                  |
| -------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| Front-end                  | React + Vite + TypeScript               | Página única, um componente por seção                                  |
| Animações                  | GSAP (ScrollTrigger, SplitText) + Lenis | Rolagem suave, parallax e profundidade                                 |
| Hospedagem                 | Vercel (plano Hobby, gratuito)          | Deploy contínuo a partir do GitHub, HTTPS, prévia por branch           |
| Formulários                | Planilha Google + Apps Script           | Confirmação de presença e registro de presentes, com e-mail aos noivos |
| Pagamento                  | A definir (InfinitePay ou Mercado Pago) | Página de pagamento externa e segura                                   |
| Mapas                      | Links do Google Maps e do Waze          | Rota aberta direto no aplicativo                                       |
| Backend (só se necessário) | Vercel Functions (Node.js)              | Webhook de pagamento, caso o Mercado Pago seja escolhido               |

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

No VS Code, instale a extensão recomendada **TypeScript (Native Preview)**: ela faz o editor usar o TypeScript 7 do projeto (o mesmo do build). Sem ela, o editor marca como erro opções que o build aceita, como `erasableSyntaxOnly`.

## Publicação (Vercel)

- **Branches:** o trabalho do dia a dia vai na `dev`; cada push gera um link de prévia. A `main` é o site principal e só recebe merges nos marcos (aprovações, revisões, entrega).
- **Configuração:** o Vercel reconhece o Vite sozinho (`npm run build`, pasta `dist`); Node 24 definido em `package.json` (`engines`).
- **`vercel.json`:** cache longo para os arquivos de `assets/` e o cabeçalho `X-Robots-Tag: noindex`, que impede o Google de indexar o site antes da entrega. **Remover o `noindex` na publicação oficial.**
- **Fotos provisórias:** ficam fora do Git (`public/images/provisorio/`); no Vercel o site aparece sem elas, com o fundo azul na Home e quadros vazios nos momentos.

## Identidade visual

- **Direção:** site imersivo, com rolagem fluida, fundo 3D contínuo e animações com profundidade no carregamento e no surgimento dos itens. Evitar o visual de template: nada de grade de cards e seções em faixas de cores alternadas.
- **Cores (paleta B · Marinho clássico, tema escuro):** `#0A1222` fundo profundo, `#14213D` marinho, `#2E4A7D` azul real (botões), `#6C8EBF` azul aço (destaques), `#E6EEF7` gelo, `#FBFAF7` marfim (texto). Definidas em `src/styles/tokens.css`.
- **Tipografia:** Playfair Display nos títulos, Montserrat no texto e Great Vibes como cursiva de detalhe. Servidas pelo próprio site via Fontsource.
- **Monograma:** o monograma dos noivos (a receber) substitui o "D&T" em texto.
- **Referência da Home (recebida):** foto em tela cheia com os noivos, menu discreto em caixa alta, data em destaque, nomes em serifada grande, citação em itálico, contagem regressiva e dois botões ("Confirmar presença" e "Ver informações"). Serve de base, não para copiar.
- **Rolagem com profundidade:** cena 3D contínua (Three.js) atrás do conteúdo; a câmera percorre a cena conforme a rolagem e cada seção é um "capítulo". Versão estática para aparelhos fracos e para quem desativa movimento.
- **Animações de fundo:** elementos sutis (formas, brilhos ou ornamentos) que não disputem atenção com o conteúdo.

## Fluxo de implementação

Cinco fases em 15 dias, com duas aprovações dos noivos: o visual no dia 2 e a revisão completa no dia 12.

### Fase 1 — Setup e base (dias 1–2)

1. ~~Criar o projeto com Vite, React e TypeScript, Oxlint e Prettier.~~ ✅
2. ~~Montar a estrutura de pastas: um componente por seção em `src/sections/` e o conteúdo em `src/content/`.~~ ✅
3. ~~Definir paleta, tipografia, espaçamentos e botões com área de toque grande.~~ ✅
4. ~~Cena 3D base (React Three Fiber), rolagem fluida (Lenis) e GSAP.~~ ✅ Foto da Home viva (ondulação e dissolução líquida ao rolar) sobre um véu fosco e discreto.
5. Home completa e seções encaixadas como capítulos sobre a cena, com o menu fixo.

**Aprovação 1:** visual aprovado pelos noivos, apresentado em localhost por chamada no Google Meet.

Hospedagem no Vercel: o plano gratuito não consome créditos por publicação, então o repositório pode ser conectado já, com prévias por branch para mostrar aos noivos.

### Fase 2 — Seções de conteúdo (dias 3–6)

1. Home, Nossa história (momentos com data, foto e descrição), O grande dia e Como chegar.
2. Script que converte as fotos do Google Drive para WebP em vários tamanhos, com carregamento sob demanda.

### Fase 3 — Formulários e presentes (dias 7–9)

1. Formulário de confirmação com o campo condicional de quantidade de pessoas, a data limite e a mensagem de agradecimento.
2. Cards de cotas e modal de "Presentear" com registro na planilha e redirecionamento ao pagamento.
3. Planilha Google e script (Apps Script): gravação das respostas, e-mails de aviso, aba de resumo e compartilhamento com os noivos.

Se a opção de pagamento for o Mercado Pago, esta fase precisa de mais dias, que saem da fase de animações.

### Fase 4 — Animações e polimento (dias 10–12)

1. Refinamento da cena 3D, das transições entre capítulos e das animações de entrada.
2. Ajustes de desempenho no celular, versão simplificada para aparelhos fracos e `prefers-reduced-motion`.

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
- [ ] Foto de fundo da Home: arquivo original em alta resolução; de preferência uma versão horizontal (computador) e uma vertical (celular)
- [ ] Citação da Home: proposta por nós e aprovada pela noiva na primeira prévia
- [ ] Momentos da história: data específica, uma foto e uma descrição breve (até ~200 caracteres) de cada um
- [x] Data do casamento: 23/02/2027
- [ ] Horários e endereços da cerimônia e da recepção
- [ ] Informações específicas do dia (traje, estacionamento, observações)
- [ ] Data limite para confirmação de presença
- [ ] E-mail que vai receber as notificações
- [ ] Lista de cotas: nome, valor e imagem de cada uma
- [ ] Telefone para o botão de WhatsApp

## Decisões e pendências

### Decisões tomadas

| Tema                    | Decisão                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| Confirmação de presença | Formulário aberto; respostas numa planilha Google, com e-mail aos noivos |
| Lista de convidados     | Sem lista pré-cadastrada; acompanhamento manual pelos noivos             |
| Presentes               | Cotas em dinheiro, com Pix e cartão de crédito                           |
| Hospedagem              | Vercel (plano Hobby)                                                     |
| Front-end               | React + Vite + TypeScript                                                |
| Estilização             | CSS Modules + variáveis CSS                                              |
| Fontes                  | Servidas pelo próprio site (Fontsource)                                  |
| Paleta                  | B · Marinho clássico, tema escuro imersivo                               |
| Tipografia              | Playfair Display + Montserrat + Great Vibes                              |
| 3D                      | Three.js com React Three Fiber, carregado depois do conteúdo             |
| Animações e rolagem     | GSAP + Lenis                                                             |
| Área administrativa     | Planilha Google numa conta do projeto, noivos como editores              |
| Fotos                   | Pasta no Google Drive compartilhada pelos noivos                         |
| Data do casamento       | 23/02/2027 (horários e locais a definir)                                 |
| Cronograma              | Início em 18/11/2026; entrega em 02/12/2026                              |
| Prévias para os noivos  | Localhost por Google Meet ou link de prévia do Vercel                    |

### Pendências

- [ ] Escolher a solução de pagamento: links InfinitePay ou Mercado Pago Checkout Pro
- [ ] Definir se haverá domínio próprio (ex.: nomedosnoivos.com.br)
