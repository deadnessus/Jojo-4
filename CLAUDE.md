# queres.games: medição de uso, boas práticas e melhorias

Este repositório é de um jogo dos irmãos Jojô e Bento, publicado em https://queres.games/jogar/<nome-do-jogo>/ por outro repositório (`deadnessus/queres-games`). Repositório novo: começa com o jogo-modelo (index.html, style.css, src/main.js), que deve ser trocado pelo jogo de verdade.

## Skills deste repositório (em `.claude/skills/`)
Use-as: elas têm o passo a passo e um verificador automático.
- **`preparar-jogo-para-queres-games`**: antes de pedir para publicar, ao começar um jogo ou ao conferir. Rode o verificador e siga o checklist.
- **`telemetria-queres-games`**: botões com nomes claros e `QG.evento`.
- **`privacidade-infantil`**: o que nunca coletar (LGPD, crianças), conta de apelido, online sem chat.
- **`melhorias-por-issues`**: como transformar os números do painel em issues.

## Regras que nunca mudam
- É um site para **crianças**: sem dado pessoal, sem chat, sem texto livre enviado a servidor, sem rastreadores.
- **Tudo dentro do jogo**: nada de CDN, Google Fonts ou outro site. Caminhos relativos.
- **A telemetria é automática pelo site.** Não crie analytics próprio nem importe script de medição.
- Login e ranking só pela conta do site (`/conta.js`); nada de telas de login próprias.
- Português do Brasil, linguagem simples (o dono não é programador).

## Medição (resumo)
O site mede, de forma anônima, sessões, tempo de uso, erros de JavaScript, celular ou computador, tamanho de tela, retorno em outro dia, **quantas vezes cada botão é usado** (pelo `id` ou `data-...`, nunca pelo texto) e a versão (commit) do jogo. Por isso dê **`id` ou `data-...` claros e estáveis** aos botões, sem dado pessoal.

Avisar um acontecimento do jogo (opcional): `window.QG?.evento?.('fase_concluida', { fase: 3 });`. O nome precisa estar em `qg-eventos.json` na **raiz** deste repositório (`{ "eventos": ["fase_concluida"] }`; até 12 nomes, minúsculas/números/`_`). Dados: até 2 pares, número inteiro ou palavra curta, **nunca** nome de pessoa, texto digitado, pontuação exata ou código de sala. Só aplique eventos a pedido do dono.

## Sugestões de melhoria ficam nas issues deste repositório
Quando alguém (uma pessoa ou uma rotina automática) achar um problema ou uma ideia a partir dos números do site, a sugestão vira uma **issue** aqui, em português simples, com: o que foi observado, em qual versão (commit), e uma ideia do que mudar. Não faça a mudança sem que alguém aprove a issue.

## Este jogo (plano em `docs/`)
O jogo planejado é um tiro/aventura em primeira pessoa num planeta alienígena (consertar a nave, comida que estraga, bichos selvagens), para iPad/iPhone deitados. História, peças da nave, controles, arquitetura técnica, etapas e decisões estão em `docs/`. **Antes de programar, leia `docs/README.md`** e siga `docs/5-plano-de-construcao.md`, uma etapa por vez, respeitando as respostas de `docs/6-decisoes.md`.

**Como rodar e testar:** `python3 -m http.server 8140` e abrir `http://localhost:8140/` (`?debug=1` mostra o desempenho); `npm test` (lógica) e `node tests/fumaca.mjs` (abre o jogo no Chromium como iPhone, iPad e computador e testa os controles). Detalhes em `docs/5-plano-de-construcao.md`.
