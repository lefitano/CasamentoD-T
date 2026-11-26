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

| ID   | Seção                 | O que o convidado faz ou vê                                                                                               |
| ---- | --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| RF01 | Home                  | Nomes dos noivos, data, citação, contagem regressiva e um único convite para percorrer o site ("Entre na nossa história") |
| RF02 | Nossa história        | Momentos do casal em linha do tempo: data específica, foto e breve descrição                                              |
| RF03 | ~~Galeria~~           | Unida à Nossa história a pedido da noiva: cada momento tem sua foto                                                       |
| RF04 | O grande dia          | Data, horários, endereços da cerimônia e da recepção e informações do dia (traje, estacionamento etc.)                    |
| RF05 | Como chegar           | Mapa e botões "Abrir no Google Maps" e "Abrir no Waze", já com rota                                                       |
| RF06 | Confirme sua presença | Formulário de confirmação, com data limite visível                                                                        |
| RF07 | Lista de presentes    | Vitrine em 2 colunas (foto, nome, descrição, valor); "Presentear" abre o Pix copia e cola com o valor e a opção de cartão |
| RF08 | Rodapé                | Mensagem final, monograma e "Falar com os noivos": abre a escolha entre Danilo e Tereza, cada um no seu WhatsApp          |

Os links de rota abrem direto no aplicativo quando o convidado está no celular:

- Google Maps: `https://www.google.com/maps/dir/?api=1&destination=LAT,LNG`
- Waze: `https://waze.com/ul?ll=LAT,LNG&navigate=yes`

### Confirmação de presença

Formulário aberto, sem lista pré-cadastrada de convidados. **A confirmação é individual** (pedido dos noivos em 24/11): cada convidado responde por si; não há campo de acompanhantes. Cada resposta é gravada numa planilha Google e gera um e-mail para os noivos (ver [Formulários e área administrativa](#formulários-e-área-administrativa)).

| Campo                 | Tipo        | Obrigatório |
| --------------------- | ----------- | ----------- |
| Nome completo         | Texto       | Sim         |
| Telefone (WhatsApp)   | Telefone    | Sim         |
| Vai comparecer?       | Sim / Não   | Sim         |
| Recado para os noivos | Texto longo | Não         |

Regras:

- O telefone é obrigatório para identificar respostas repetidas.
- A data limite aparece no site; depois dela o formulário fica fechado. O script da planilha também recusa envios fora do prazo, então o bloqueio vale mesmo para quem tentar enviar por fora do site.
- Proteção contra spam com um campo-armadilha invisível (honeypot), verificado no script. Se aparecer spam, entra uma verificação extra (ex.: reCAPTCHA ou Cloudflare Turnstile).
- Após o envio, o convidado vê uma mensagem de agradecimento.
- Um aviso curto ao lado do formulário explica para que o telefone é usado e que só os noivos veem as respostas (LGPD).

O acompanhamento de quem não respondeu é manual: perto do evento, os noivos reenviam o link pedindo que só quem ainda não confirmou responda.

### Lista de presentes

Cotas em dinheiro (ex.: "Jantar na lua de mel – R$ 150"), pagas com Pix ou cartão de crédito.

- **Vitrine (25/11):** 2 presentes por linha, como numa loja, inclusive no celular, com todos à mostra (sem "mostrar mais"). Cada presente tem **foto, nome, descrição e valor** (`src/content/gifts.ts`). A descrição aparece inteira; nome, descrição, valor e botão ficam alinhados com o vizinho da linha (CSS subgrid).
- **Ordem misturada (pedido da noiva):** os valores não seguem ordem crescente; ao incluir um presente, manter a alternância.
- **"Presentear" se estende** ali mesmo (um presente aberto por vez) com:
  - **Pix copia e cola** com o **valor do presente já preenchido** (BR Code do Banco Central, gerado em `src/lib/pix.ts` a partir da chave dos noivos em `src/content/payment.ts`) e um botão para copiar;
  - **"Pagar com cartão"**: abre o link de pagamento do presente (`cardUrl`), quando existir; até lá, avisa que estará disponível em breve.
- **Fotos dos presentes:** salve em `fotos-originais/presentes/<id>.jpg` (o `id` do presente) e rode `npm run fotos`; saem em `public/images/presentes/<id>.webp`, recortadas em 4:5. Sem foto, aparece um ícone de presente.
- O registro de "quem presenteou" na planilha (aba Presentes) já existe no script, mas não está no fluxo atual; pode voltar se os noivos quiserem.

A solução de pagamento ainda será escolhida:

| Opção                      | Como funciona                                                      | Prós                                                                                         | Contras                                                                    |
| -------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Links InfinitePay por cota | Os noivos criam um link no app para cada cota; o botão abre o link | Pix e cartão no mesmo link, Pix sem taxa, nenhum dado de cartão passa pelo site, sem backend | Valor fixo por cota, links criados manualmente, pagamento conferido no app |
| Mercado Pago Checkout Pro  | Uma função serverless cria o pagamento; um webhook confirma        | Valor livre, registro automático de quem pagou                                               | Exige backend e banco, mais dias de desenvolvimento, taxa também no Pix    |

### Música (pedido da noiva, 26/11)

**Turning Page (Instrumental)**, de Sleeping At Last (faixa bônus do EP _Neighbors Volume One_).

- **Nada toca sozinho:** os navegadores bloqueiam som antes de um toque, e o convidado pode estar num lugar silencioso.
- **Botão no menu fixo**, disponível no site inteiro: quatro traços finos que ondulam quando a música toca. Na Home, um convite escrito ("Ouça nossa música") aparece ao lado até o primeiro toque.
- **Ao tocar:** a música entra aos poucos (fade-in) e se repete; pausa sozinha quando o convidado troca de aba ou bloqueia o celular e volta ao retornar. No iPhone, o volume não pode ser controlado por código, então lá não há fade.
- **Leve:** o arquivo só é baixado no primeiro toque (`src/components/MusicToggle/`).
- **Arquivo:** comprar a faixa (ex.: iTunes Store), salvar em `public/audio/turning-page.m4a` e preencher `src` em `src/content/music.ts`. Sem `src`, o botão não aparece. Não baixar do YouTube.

### Formulários e área administrativa

Não há painel próprio: a área administrativa é uma **planilha Google** compartilhada com os noivos.

- **Conta:** uma conta Gmail do projeto, criada pelo Leonardo e entregue aos noivos: é dona da planilha e do script, envia e também recebe os avisos (`AVISAR_EMAILS`). Para seguir mantendo o script, o Leonardo precisa de acesso a ela (ou ser editor da planilha).
- **Como funciona:** os formulários do site enviam para um script do Google (Apps Script) ligado à planilha, que grava a resposta e envia o e-mail de aviso. Funciona em qualquer hospedagem.
- **Acesso dos noivos:** pela própria conta do projeto, que é deles. Se quiserem, podem também compartilhar a planilha com os e-mails pessoais.
- **Proteção:** a aba de respostas é travada (só o script escreve nela); os noivos têm uma coluna livre para anotações e uma aba de resumo com os totais.
- **Limite:** cerca de 100 e-mails por dia numa conta Google comum, suficiente para um casamento.
- **Mesmo telefone respondendo de novo:** atualiza a resposta anterior na mesma linha (coluna "Atualizado em").
- **Instalação:** [docs/guia-planilha.md](docs/guia-planilha.md); o código do script fica em [`apps-script/Codigo.gs`](apps-script/Codigo.gs).
- **Depois do casamento:** transferir a planilha para os noivos ou apagar os dados dos convidados (LGPD).

| Necessidade                | Como fica atendida                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------- |
| Ver confirmações e recusas | E-mail a cada resposta e a lista completa na planilha                                   |
| Ver quem presenteou        | E-mail a cada registro e a aba de presentes, mais a conferência no app de pagamento     |
| Contar quantos vêm         | Aba de resumo ("Vão comparecer"), calculada automaticamente; cada resposta é uma pessoa |
| Saber quem não respondeu   | Manual, comparando com a lista dos noivos (coluna de anotações)                         |

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
npm run fotos    # otimiza as fotos de fotos-originais/ para public/images/ (WebP)
```

No VS Code, instale a extensão recomendada **TypeScript (Native Preview)**: ela faz o editor usar o TypeScript 7 do projeto (o mesmo do build). Sem ela, o editor marca como erro opções que o build aceita, como `erasableSyntaxOnly`.

## Publicação (Vercel)

- **Branches:** o trabalho do dia a dia vai na `dev`; cada push gera um link de prévia. A `main` é o site principal e só recebe merges nos marcos (aprovações, revisões, entrega).
- **Configuração:** o Vercel reconhece o Vite sozinho (`npm run build`, pasta `dist`); Node 24 definido em `package.json` (`engines`).
- **Prévia do link (WhatsApp):** tags Open Graph no `index.html` com o cartão `public/images/og-monograma.jpg` (monograma sobre o marinho, gerado por `npm run fotos`). O endereço completo da imagem é preenchido no build: no Vercel, automaticamente; com domínio próprio, definir a variável `SITE_URL` no Vercel. O WhatsApp guarda a prévia em cache: para testar uma mudança, envie o link com `?v=2` no fim.
- **Ícone do site (favicon):** monograma marfim num quadrado marinho de cantos arredondados, na aba do navegador e na tela inicial do celular (`public/favicon-32.png`, `apple-touch-icon.png`, `icon-192/512.png` e `site.webmanifest`), gerados por `npm run fotos`.
- **`vercel.json`:** cache longo para os arquivos de `assets/` e o cabeçalho `X-Robots-Tag: noindex`, que impede o Google de indexar o site antes da entrega. **Remover o `noindex` na publicação oficial.**
- **Fotos:** os originais dos noivos ficam em `fotos-originais/` (fora do Git); `npm run fotos` gera as versões otimizadas em `public/images/` (no Git). Para uma foto nova, acrescente uma entrada em `JOBS` no [script](scripts/optimize-images.mjs).
- **Fotos provisórias dos momentos:** ficam fora do Git (`public/images/provisorio/`); no Vercel aparecem como quadros vazios até as fotos reais chegarem.

## Identidade visual

- **Direção:** site imersivo, com rolagem fluida, fundo 3D contínuo e animações com profundidade no carregamento e no surgimento dos itens. Evitar o visual de template: nada de grade de cards e seções em faixas de cores alternadas.
- **Cores (paleta B · Marinho clássico, tema escuro):** `#0A1222` fundo profundo, `#14213D` marinho, `#2E4A7D` azul real (botões), `#6C8EBF` azul aço (destaques), `#E6EEF7` gelo, `#FBFAF7` marfim (texto). Definidas em `src/styles/tokens.css`.
- **Tipografia:** Playfair Display nos títulos, Montserrat no texto e Great Vibes como cursiva de detalhe, servidas via Fontsource. Os nomes dos noivos na Home usam a **Instrument Serif** em maiúsculas: alternativa gratuita (OFL) à Perandory que a noiva usou no Canva (gratuita só para uso pessoal), escolhida por ser também condensada e de alto contraste.
- **Monograma:** recebido em 23/11 (T e D entrelaçados, azul sobre branco); convertido para marfim com fundo transparente. Aparece no menu e no rodapé.
- **Foto da Home:** a igreja do casamento ao entardecer (recebida em 23/11), vertical. No celular ocupa a tela inteira; no computador, um painel à direita com a borda esquerda suave, e o texto fica à esquerda sobre o marinho. Recebe um tratamento leve de cor (menos saturação no céu, véu azul suave) para combinar com a paleta. Ponto de foco: a torre com a cruz.
- **Referência da Home (recebida):** foto em tela cheia com os noivos, menu discreto em caixa alta, data em destaque, nomes em serifada grande, citação em itálico, contagem regressiva e dois botões ("Confirmar presença" e "Ver informações"). Serve de base, não para copiar.
- **Rolagem com profundidade:** a foto da Home é a protagonista: ondula de leve e, ao rolar, se dissolve de forma líquida sobre um véu azul fosco que ondula devagar ao fundo (WebGL, Three.js). Versão estática para aparelhos fracos e para quem desativa movimento.
- **Ícones animados (O grande dia):** igreja (cerimônia), taças (recepção) e vestido + terno (traje), em traço fino azul aço, desenhados em SVG. O traço se desenha conforme a rolagem, nos dois sentidos; ao terminar, uma microanimação roda uma vez (a cruz brilha, as taças brindam, as roupas balançam). O horário fica ao lado do título ("CERIMÔNIA · 16h").
- **Surgimento ligado à rolagem:** títulos, textos, listas e fotos surgem e se recolhem nas bordas da tela, nos dois sentidos, com suavização; o meio da tela fica sempre nítido. Poucos efeitos, discretos: partículas e fundo em gradiente fluido foram testados e descartados por parecerem artificiais.

## Fluxo de implementação

Cinco fases em 15 dias, com duas aprovações dos noivos: o visual no dia 2 e a revisão completa no dia 12.

### Fase 1 — Setup e base (dias 1–2)

1. ~~Criar o projeto com Vite, React e TypeScript, Oxlint e Prettier.~~ ✅
2. ~~Montar a estrutura de pastas: um componente por seção em `src/sections/` e o conteúdo em `src/content/`.~~ ✅
3. ~~Definir paleta, tipografia, espaçamentos e botões com área de toque grande.~~ ✅
4. ~~Cena 3D base (React Three Fiber), rolagem fluida (Lenis) e GSAP.~~ ✅ Foto da Home viva (ondulação e dissolução líquida ao rolar) sobre um véu fosco e discreto.
5. ~~Home completa e seções encaixadas como capítulos sobre a cena, com o menu fixo.~~ ✅

**Aprovação 1:** visual apresentado aos noivos em 20/11 (um dia depois do previsto), pelo link do Vercel ou localhost.

Hospedagem no Vercel: o plano gratuito não consome créditos por publicação, então o repositório pode ser conectado já, com prévias por branch para mostrar aos noivos.

### Fase 2 — Seções de conteúdo (dias 3–6)

1. Home, Nossa história (momentos com data, foto e descrição), O grande dia e Como chegar.
2. ~~Script que converte as fotos do Google Drive para WebP em vários tamanhos, com carregamento sob demanda.~~ ✅ `npm run fotos`

### Fase 3 — Formulários e presentes (dias 7–9)

1. ~~Formulário de confirmação com o campo condicional de quantidade de pessoas, a data limite e a mensagem de agradecimento.~~ ✅ (`src/sections/Rsvp/RsvpForm.tsx`; sem `VITE_FORMS_URL`, o `npm run dev` simula o envio)
2. Cards de cotas e modal de "Presentear" com registro na planilha e redirecionamento ao pagamento.
3. Planilha Google e script (Apps Script): gravação das respostas, e-mails de aviso, aba de resumo e compartilhamento com os noivos. Script pronto em [`apps-script/Codigo.gs`](apps-script/Codigo.gs); instalação no [guia](docs/guia-planilha.md).

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

- [x] Pasta no Google Drive compartilhada com o Leonardo
- [ ] Fotos dos noivos e dos locais
- [x] Monograma do casamento (recebido em JPG; convertido para marfim com fundo transparente)
- [x] Print de referência da Home (recebido em 18/11; usar como base, sem copiar)
- [x] Foto de fundo da Home: a igreja, vertical (recebida em 23/11)
- [ ] Citação da Home: proposta por nós e aprovada pela noiva na primeira prévia
- [ ] Momentos da história: data específica, uma foto e uma descrição breve (até ~200 caracteres) de cada um
- [x] Data do casamento: 23/02/2027
- [x] Nomes: Danilo & Tereza (23/11)
- [x] Local da cerimônia: Igreja de São Pedro Apóstolo, com link do Google Maps (23/11). Endereço por escrito a confirmar
- [ ] Horários da cerimônia e da recepção; local da recepção
- [ ] Informações específicas do dia (traje, estacionamento, observações)
- [x] Data limite para confirmação de presença: sem limite (decisão dos noivos, 24/11)
- [x] E-mail dos avisos: a própria conta Gmail do projeto, entregue aos noivos (24/11)
- [x] Lista de cotas: 15 presentes com título, legenda e valor (25/11), em ordem misturada a pedido da noiva
- [ ] Fotos dos presentes; e o que serão de fato as cotas de R$ 1.000, R$ 1.200 e R$ 2.000 (título e legenda já definidos)
- [ ] Pix dos noivos: chave, nome de quem recebe e cidade (`src/content/payment.ts`)
- [ ] Pagamento com cartão: link de cada cota (`cardUrl` em `src/content/gifts.ts`), quando a solução for escolhida
- [x] Telefones do WhatsApp: Danilo e Tereza (23/11)
- [x] Música: Turning Page (Instrumental), de Sleeping At Last (26/11)
- [ ] Arquivo da música comprado (`public/audio/turning-page.m4a`)

## Decisões e pendências

### Decisões tomadas

| Tema                      | Decisão                                                                     |
| ------------------------- | --------------------------------------------------------------------------- |
| Confirmação de presença   | Formulário aberto; respostas numa planilha Google, com e-mail aos noivos    |
| Lista de convidados       | Sem lista pré-cadastrada; acompanhamento manual pelos noivos                |
| Presentes                 | Cotas em dinheiro, com Pix e cartão de crédito                              |
| Hospedagem                | Vercel (plano Hobby)                                                        |
| Front-end                 | React + Vite + TypeScript                                                   |
| Estilização               | CSS Modules + variáveis CSS                                                 |
| Fontes                    | Servidas pelo próprio site (Fontsource)                                     |
| Paleta                    | B · Marinho clássico, tema escuro imersivo                                  |
| Tipografia                | Playfair Display + Montserrat + Great Vibes                                 |
| 3D                        | Three.js com React Three Fiber, carregado depois do conteúdo                |
| Animações e rolagem       | GSAP + Lenis                                                                |
| Área administrativa       | Planilha Google numa conta do projeto, noivos como editores                 |
| Home no computador        | Foto vertical em painel lateral à direita; texto à esquerda                 |
| Tratamento de cor         | Leve, para aproximar as fotos da paleta (saturação 72%, véu azul)           |
| Nomes na Home             | Danilo & Tereza, em Instrument Serif (no lugar da Perandory)                |
| Prévia do link            | Cartão com o monograma (Open Graph), 1200×630                               |
| Confirmação individual    | Cada convidado confirma por si; sem quantidade de pessoas nem acompanhantes |
| Data limite (confirmação) | Sem limite: o formulário fica aberto até o casamento                        |
| Fotos                     | Pasta no Google Drive compartilhada pelos noivos                            |
| Data do casamento         | 23/02/2027 (horários e locais a definir)                                    |
| Cronograma                | Início em 18/11/2026; entrega em 02/12/2026                                 |
| Música                    | Só toca quando o convidado pede: botão no menu, convite na Home             |
| Prévias para os noivos    | Localhost por Google Meet ou link de prévia do Vercel                       |

### Pendências

- [ ] Escolher a solução de pagamento: links InfinitePay ou Mercado Pago Checkout Pro
- [ ] Definir se haverá domínio próprio (ex.: nomedosnoivos.com.br)
- [ ] Noiva confirmar a fonte dos nomes: Instrument Serif (em uso) ou Noto Serif Display condensada; a Perandory exige comprar a licença
- [ ] Confirmar com os noivos o endereço por escrito da igreja (hoje: Av. Almirante Barroso, 1091 — Praia de Iracema)
