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
- Script `ferramentas/montar-site.mjs` (cópia para o site com a versão nos endereços, ver 4.13).
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
- [ ] Etapa 0: fundação — **programada e testada no computador (20/11/2026)**; falta o dono testar no iPad e no iPhone e escolher o visual (D11)
- [ ] Etapa 1: Vale da Queda (primeira versão jogável)
- [ ] Etapa 2: Floresta Lumina
- [ ] Etapa 3: salvar na nuvem
- [ ] Etapa 4: Desfiladeiro dos Ventos
- [ ] Etapa 5: Terras Quentes
- [ ] Etapa 6: Picos Gelados
- [ ] Etapa 7: o final
- [ ] Etapa 8: polimento
