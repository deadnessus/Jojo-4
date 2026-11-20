# 5. Plano de construção

A ideia é **construir em etapas que dá para jogar e testar**. Cada etapa termina com o jogo funcionando, testado e salvo no repositório. A partir da Etapa 1, o jogo já pode ir para o queres.games, e o Jojô e o Bento testam de verdade. Os números do painel viram issues de melhoria (skill `melhorias-por-issues`).

Cada etapa cabe em **1 a 3 sessões** do Claude com esforço alto.

## Como cada sessão de construção deve trabalhar

1. Ler os documentos `docs/` (principalmente este e o 4) e as decisões já respondidas no 6.
2. Fazer **só a etapa combinada**.
3. Antes de terminar: testes de lógica (`node --test`), teste de fumaça com captura de tela, verificador do queres.games, commit e push.
4. Atualizar a lista **Situação** no fim deste arquivo e dizer ao dono, em linguagem simples, **o que testar no iPad e no iPhone**.

## As etapas

### Etapa 0: fundação (1 sessão), o teste mais importante
O maior risco de um jogo de tiro em primeira pessoa no toque é o **controle ser ruim** ou o jogo **ficar lento no iPhone**. Esta etapa resolve isso antes de qualquer outra coisa.
- Three.js em `vendor/`, tela de carregamento, menu inicial, laço do jogo.
- Um terreno de teste com névoa, céu com a Brasa e o Colosso, algumas plantas.
- Câmera em primeira pessoa, **joystick + olhar + botões de toque**, teclado e mouse, colisão com o terreno, pulo.
- HUD básico, pausa (inclusive ao esconder a aba), "Gire o aparelho", contador `?debug=1`.
- **Duas propostas de visual** (pixelado e liso), que dá para trocar nas opções, com capturas de tela para o dono escolher mais para frente (decisão D11).
- **O dono testa:** dá para andar e olhar confortavelmente no iPad e no iPhone? Está liso?
- **Pronto quando:** pelo menos 50 fps no iPad das crianças, nenhum erro no console e controles aprovados pelo dono e pelas crianças.

### Etapa 1: Vale da Queda, a primeira versão jogável (2 a 3 sessões)
- Prólogo na cabine (a queda), a nave caída por dentro e por fora.
- O traje do Tavares + o Desintegrador + o registro 1.
- Saltitos e Rastejadores com comportamento; combate com mira assistida.
- Fome e comida com frescor (rações, frutas, raízes); fogueira para cozinhar.
- Dia, noite e um eclipse; ÍRIS falando (diálogos curtos).
- Missão "Luz na nave": achar e instalar a bateria; o **Painel de Conserto** com o 1º sistema.
- Dormir e salvar; save no aparelho com 3 espaços; desmaio; 3 dificuldades.
- Sons e música do Vale.
- **Pronto quando:** cerca de 20 minutos de jogo do começo até a bateria, sem travar, e uma criança consegue jogar sem ajuda.
- Script `ferramentas/montar-site.mjs` (cópia para o site com a versão nos endereços, ver 4.13). **Feito antes, em 20/11/2026**, para dar para testar a Etapa 0 no queres.games.
- **Publicar no queres.games** para o Jojô e o Bento testarem (pedir numa sessão do repositório `queres-games`).

### Etapa 2: Floresta Lumina (2 a 3 sessões)
- Região nova; o Ulo, o tradutor e os diálogos com escolhas; o Bolota.
- Zumbidores, Cuspidores e Planadores noturnos; o ninho e a **Rainha Zumbidora**.
- Oficina e receitas; horta; geladeira.
- Bocal do motor e musgo-de-ar (2 sistemas); placas do escudo; registros 2 a 4.

### Etapa 3: salvar na nuvem (1 sessão aqui + 1 sessão no repositório `queres-games`)
- Aqui: `save-nuvem.js`, `/conta.js` no `index.html`, botão "Salvar na nuvem", login dentro do jogo com `QGConta.montar`, tela de conflito, testes (com um servidor de mentira que imita as rotas).
- Lá (sessão do `queres-games` com permissão de escrita, skill `login-queres-games`): `functions/api/<slug>/saves.js`, `functions/_lib/<slug>.js` com `conferirSave`, tabela `rt_saves`, teste local com `wrangler`, `CLAUDE.md` do site e post no blog. **O dono confirma antes do merge** (é guardar dados de jogadores num site infantil).
- Pode vir antes ou depois, conforme a decisão D14.

### Etapa 4: Desfiladeiro dos Ventos (2 sessões)
- Gancho; a base da Expedição Cruzeiro (interior em blocos); os 3 fusíveis e a antena.
- **Contato com a Terra** (a virada da história).
- Casco-de-Pedra e o **Grande Casco**; botas térmicas; atordoador; 1º templo da Chave dos Antigos.

### Etapa 5: Terras Quentes (2 a 3 sessões)
- A Estação K-7 (interior grande), os robôs, as torres (quebra-cabeça) e o Unidade 7.
- A **Escavadeira-Mãe**; núcleo do reator e eletrolisador; o tanque enchendo com os dias.
- Rifle de raio; isolante para o traje térmico.

### Etapa 6: Picos Gelados (2 sessões)
- Traje térmico, Hexamutes e o filhote, o observatório e o **minijogo das constelações**.
- A **Grande Garra**; templos 2 e 3 da Chave.

### Etapa 7: o final (2 a 3 sessões)
- Ruínas dos Antigos e Cavernas de Cristal, quebra-cabeças de luz, o **Guardião de Cristal**.
- O Ulo embarca na Andorinha (final fixo).
- Lista de verificação do lançamento, decolagem, a Terra na janela, créditos.

### Etapa 8: polimento (contínuo)
- Ajustes pelos números do painel (sempre por issue aprovada).
- Acessibilidade, aparelhos mais antigos, música, chuva de meteoros, diário de criaturas completo, receitas.

## Como rodar e testar (para quem programa)

- **Jogar no computador:** `python3 -m http.server 8140` na raiz do repositório e abrir `http://localhost:8140/` (precisa de servidor: o jogo usa módulos JavaScript).
- **Testes de lógica:** `npm test` (só Node, sem instalar nada).
- **Teste de fumaça:** `node tests/fumaca.mjs [pasta-das-capturas]`. Abre o jogo no Chromium deitado como iPhone e como iPad (com toque) e no computador, e confere carregar sem erro, joystick, olhar, dois dedos, atirar (e mirar arrastando no botão), pular, ação, pausa, "gire o aparelho" e os dois visuais.
- **Endereços de teste:** `?debug=1` mostra quadros por segundo, chamadas de desenho e triângulos; `?visual=liso` ou `?visual=pixelado`; `?hora=0.75` muda a hora do céu (0,25 nasce, 0,5 meio-dia, 0,75 pôr do sol).
- **Verificador do queres.games:** `node .claude/skills/preparar-jogo-para-queres-games/verificar-jogo.mjs .`

## Missões para reconstruir a nave (pedido do dono, 20/11/2026)

Decisões D24 e D25. A campanha inteira acontece no Vale que dá a volta (512 m), com os lugares longe uns dos outros para dar caminhada. Os textos das missões são da ÍRIS e aparecem na caixa do canto (toque nela para ver a aba 📜 Missões da mochila); a ⭐ da bússola e do mapa mostra para onde ir.

| # | Missão | O que tem que fazer | Conserta |
|---|---|---|---|
| 1 | 🔋 Luz na nave | Falar com a ÍRIS → ir até a Colina da Bateria → derrotar 4 Rastejadores do ninho → pegar a bateria → instalar no Painel | Energia (1/2) |
| 2 | 🪚 Remendar o casco | Juntar 24 madeiras, 18 pedras e 8 fibras → criar 4 placas de remendo → instalar → fazer uma fogueira perto da nave | Casco (1/2) |
| 3 | 🚀 O bocal do motor | Ir ao Ninho dos Zumbidores → derrotar 5 Zumbidores → **chefe: Rainha Zumbidora** (chama ajudantes) → pegar o bocal → instalar (com 12 pedras) | Motor |
| 4 | 📡 Chamando a Terra | Ir à Base da Expedição Cruzeiro → achar 3 fusíveis (com Rastejadores de guarda) → pegar a antena → juntar 8 cristais → instalar → falar com a Terra | Comunicação |
| 5 | 🛡️ Pronto para a luta | Juntar 6 carapaças de Zumbidor → criar a armadura (o dano cai para 60%) | — |
| 6 | ⚛️ Energia de verdade | Ir à Cratera do Núcleo → **chefe: Grande Garra** (dá investidas, não tem medo de fogo) → pegar o núcleo → juntar 12 cristais → instalar | Energia (2/2) |
| 7 | 🟧 As placas do escudo | Achar 6 placas espalhadas pelo Vale → instalar (com 10 pedras) | Casco (2/2) |
| 8 | 🫧 Ar para a viagem | Colher 10 tufos de musgo-de-ar perto dos lagos → criar o biofiltro → instalar | Suporte de vida |
| 9 | ⚗️ Combustível | Desmontar destroços e juntar 12 sucatas → criar o eletrolisador → instalar → esperar o tanque encher (6 min) | Combustível |
| 10 | 🔭 Navegar pelas estrelas | Subir o morro grande até o Observatório → pegar o rastreador → instalar → minijogo: tocar nas 5 estrelas do Cruzeiro do Sul na ordem | Navegação |
| 11 | 💠 O cristal de salto | Achar as 3 pedras-chave nos monólitos (com guardas) → ir às Ruínas dos Antigos → abrir a porta → **chefe: Guardião de Cristal** (joga cristais) → pegar o Cristal de Salto → instalar | Motor de salto |
| 12 | 🌍 Rumo à Terra | Decolar pelo Painel: a nave sobe no Vale, faz o salto e chega na Terra; créditos com "Continuar explorando" | — |

- **Código:** `src/dados/missoes.js` (a campanha), `src/dados/locais.js` (lugares, pontos das peças, sucata), `src/logica/missoes.js` (o motor, testado no Node em `tests/logica/missoes.test.mjs`), `src/mundo/locais.js` (as construções de cada lugar, a porta das Ruínas e os montes de sucata), `src/entidades/pecas.js` (peças com facho de luz e "Pegar"), `src/entidades/criaturas.js` (chefes e bichos chamados pelas missões, que não renascem; chefe se recupera se você fugir para longe), `src/ui/painel.js` (Painel da nave e o minijogo), `src/mundo/nave.js` (a nave muda a cada conserto), `src/cenas/final.js` (chegada na Terra).
- **Relevo novo:** chão chato para a Base, as Ruínas, o Ninho e o Observatório, e a operação `cratera` (fundo chato e borda levantada).
- **Save versão 3:** guarda a missão, o passo, a contagem, as peças já pegas, os sistemas consertados, o tanque e se a porta das Ruínas está aberta (só números e códigos). Saves antigos começam a campanha do começo, com a mochila e as construções.
- **Teste de fumaça (iPhone):** falar com a ÍRIS, chegar na colina, derrotar os 4 Rastejadores, pegar e instalar a bateria, aba Missões e receitas novas, barra de vida do chefe, cristais do Guardião, abrir a porta das Ruínas, save versão 3, decolar, final, créditos e voltar a explorar. Também confere o botão de atirar na esquerda.
- **Ainda não tem:** comida que estraga, dia e noite, as outras regiões, o esqueleto e o alien que desistiu de voltar (subtramas do plano). Ficam para as próximas etapas.

## Mundo que dá a volta, aliens e mapa (pedido do dono, 20/11/2026)

Decisões D21, D22 e D23:
- **Mundo que dá a volta (toro):** `src/logica/toro.js` (contas do caminho mais curto), ruído periódico em `src/logica/ruido.js` e relevo/grade que se repetem sem emenda (`src/logica/relevo.js`). O Vale tem 512 m e não tem paredões. Cada pedaço do terreno, da vegetação e dos cristais é desenhado na cópia mais perto da câmera; colisões, mirar, construir e os bichos usam distâncias que passam pela emenda. Save versão 2 (as construções da versão 1 não servem mais porque o relevo mudou; a mochila continua).
- **Aliens:** `src/entidades/criaturas.js` + `src/dados/criaturas.js`. Saltitos, Rastejadores (cercam, mordem, fogem quando estão fracos, têm medo de fogo, não entram na base) e Zumbidores (voam em círculos e dão rasantes). Derrotados caem, somem numa nuvenzinha e deixam itens (carne, cristal, carapaça) e voltam a aparecer longe depois de um tempo. A ajuda na mira também vale para os bichos.
- **Vida e desmaio:** barra de vida no HUD, tela vermelha e tremor ao levar dano, vida que volta devagar, desmaio com volta para a nave.
- **Mapa:** `src/ui/mapa.js`, botão 🗺️ (tecla M).
- Teste de fumaça: atirar num Rastejador até ele cair e deixar carne, mordida, desmaio, mapa e passar pela emenda (iPad).

## Abertura e Novo jogo (pedido do dono, 20/11/2026)

Feito logo depois da coleta (decisão D20). Adianta um pedaço da Etapa 1 (o prólogo da queda):
- `src/cenas/prologo.js`: cena no espaço (Andorinha inteira, Colosso, Lúmen, estrelas), meteoros com rastro de fogo, impacto com explosão e a asa se soltando, queda em chamas, clarão e tela preta; sons de motor, alarme, explosão e ronco da queda; botão "Pular".
- Acordar no Vale: dois piscares de olhos, deitado olhando o céu, levantando.
- Menu: **Novo jogo** (com confirmação se houver jogo salvo; apaga mochila e construções e recoloca árvores e pedras) e **Continuar** (mochila, construções e posição do jogador).
- Teste de fumaça: abertura, pular, continuar e confirmação do novo jogo (52 conferências).

## Coletar, criar e construir (pedido do dono, 20/11/2026)

Feito logo depois da Etapa 0 (decisão D19, detalhes em 3.8):
- `src/mundo/recursos.js`: árvores, arbustos, pedras e cristais que tremem, quebram, soltam lascas e crescem de novo (mexendo só nos vértices de cada um dentro das malhas juntadas).
- `src/entidades/coletaveis.js`: itens que pulam e voam até o jogador.
- `src/mundo/construcoes.js`: blocos de madeira, pedra e cristal numa grade de 1 m (malhas instanciadas, dá para empilhar e subir), fogueira com fogo e luz, prévia verde/vermelha, desmontar.
- `src/ui/mochila.js` + `src/logica/inventario.js` + `src/dados/itens.js`: mochila, receitas e o que cada coisa dá.
- Ferramentas na mão (luva, machado, picareta) com golpe, em `src/entidades/arma.js`.
- Save no aparelho (`src/logica/save.js`, `src/nucleo/save-local.js`): mochila e construções.
- Testes: `tests/logica/inventario.test.mjs` e um cenário novo no teste de fumaça (cortar, criar pela tela, colocar, subir, recarregar).

## O que a Etapa 0 entregou

- Three.js r170 em `vendor/three/`; import map com caminho relativo.
- Vale da Queda de teste: relevo com semente (clareira da nave, lago, trilhas, colinas, paredões nas bordas), grama-pena, arbustos-chama, árvores-taça com frutas-lanterna, pedras, cristais que brilham, a Andorinha caída provisória (com fumaça, destroços e o rastro queimado).
- Céu com a Brasa e o Colosso com anéis (sempre ao norte), névoa e o ciclo de cores pronto (a hora fica parada até a Etapa 1).
- Dois visuais trocáveis nas opções: **anos 90 (pixelado)** e **liso**.
- Controles: joystick flutuante, arrastar para olhar (com aceleração leve), ATIRAR que também mira, PULAR, AÇÃO; teclado e mouse; controle de videogame.
- Jogador com gravidade de 0,8 g, rampas, colisão com troncos, pedras e a nave, água funda bloqueada.
- Desintegrador de teste com superaquecimento e bolhas de treino; ajuda na mira (forte, média ou desligada) **sem tiro automático**.
- HUD: bússola com o Colosso e a nave, mira, calor da arma, mensagens da ÍRIS, botão de ação; pausa (também ao esconder a aba), opções guardadas no aparelho, "gire o aparelho", resolução automática.
- Sons sintetizados (tiro, passos, pulo, estouro, vento).

## Onde testar no aparelho

A prévia privada do claude.ai **não abre no iPadOS 18.7** (o visualizador do app do Claude mostra "This browser isn't supported"), mas o jogo funciona a partir do iOS 16.4. Por isso o teste no iPad e no iPhone das crianças é feito pelo queres.games: uma sessão do repositório `queres-games` roda `node <pasta do Jojo-4>/ferramentas/montar-site.mjs public/jogar/rumo-a-terra`, grava a versão e publica (card como "em desenvolvimento").

## Riscos e como evitar

| Risco | Como evitar |
|---|---|
| Controle de toque desconfortável | Etapa 0 dedicada só a isso, com teste no aparelho antes de seguir |
| Lento no iPhone | Orçamento de desempenho (4.4), escala dinâmica, medir no aparelho desde o começo |
| Jogo grande demais para terminar | Primeira versão pequena e jogável (Etapa 1), publicada cedo; cada etapa já é um jogo melhor |
| Arte feita por código ficar feia | Paleta e estilo aprovados na Etapa 0, com capturas de tela; tudo com o mesmo estilo |
| Save na nuvem depende de outro repositório | O jogo funciona inteiro sem a nuvem; a nuvem é um extra |
| Textos longos demais para criança | Máximo de 3 linhas por vez e textos todos num arquivo só (`dados/textos.js`), fácil de revisar |
| O teste automático não é o Safari | O dono testa cada etapa no iPad e no iPhone |

## Situação

- [x] Plano, história, pesquisa e arquitetura (este documento)
- [x] Decisões respondidas (documento 6)
- [ ] Etapa 0: fundação — **programada, testada no computador e publicada em `queres.games/jogar/rumo-a-terra/` como "em desenvolvimento" (20/11/2026, commit `c4b28d5`, PR #67 do queres-games)**; falta o dono testar no iPad e no iPhone e escolher o visual (D11)
- [ ] Etapa 1: Vale da Queda (primeira versão jogável) — **adiantada a pedido do dono:** coletar/criar/construir, abertura, mundo que dá a volta, aliens, mapa e a **campanha de 12 missões até a decolagem** (20/11/2026). Faltam dia e noite e a comida que estraga
- [ ] Etapa 2: Floresta Lumina
- [ ] Etapa 3: salvar na nuvem
- [ ] Etapa 4: Desfiladeiro dos Ventos
- [ ] Etapa 5: Terras Quentes
- [ ] Etapa 6: Picos Gelados
- [ ] Etapa 7: o final
- [ ] Etapa 8: polimento
