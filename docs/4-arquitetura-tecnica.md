# 4. Arquitetura técnica

> **Para o dono:** esta parte é mais técnica. O resumo: o jogo vai usar uma biblioteca 3D gratuita e conhecida (Three.js) guardada **dentro** do jogo; tudo (desenhos, bichos, sons e música) vai ser **gerado por código**, sem arquivos de imagem ou som de fora; o jogo é dividido em **regiões** para rodar leve no iPhone; e o salvamento na nuvem usa a **conta do queres.games** e um banco de dados do Cloudflare.
>
> **Para quem for programar:** isto é o contrato do projeto. Se for preciso mudar algo daqui, atualize este documento no mesmo commit.

## 4.1 Como o queres.games funciona (lido no repositório `deadnessus/queres-games`)

- O site é feito com **Astro** e publicado pelo **Cloudflare Pages**: cada merge na `main` do `queres-games` publica sozinho.
- Cada jogo é uma **cópia estática** em `public/jogar/<slug>/` do `queres-games`, feita por uma sessão daquele repositório (skill `publicar-no-queres-games`), que também grava `versao.json` (o commit deste repositório) e cria o card e o post no blog.
- Na hora do build, o site **injeta sozinho** a telemetria (`/telemetria.js`) e o contador em todas as páginas do jogo. O jogo não faz nada para isso.
- **Funções no servidor** são Cloudflare Pages Functions em `functions/api/...`, com um banco **D1 único** (ligação `DB`) para o site todo: contas, sessões, rankings, telemetria. Cada jogo usa tabelas com **prefixo próprio** (`jp_`, `ie_`, `inf_`).
- A **conta** (apelido gerado + código de 3 caracteres) já existe e é compartilhada por todos os jogos. Cliente pronto em `/conta.js` (`QGConta`).
- **Cache:** o Cloudflare deixa o navegador guardar JS e CSS por **4 horas**, mas o `index.html` sempre é conferido. Sem cuidado, depois de uma atualização a página nova roda com módulos JS antigos misturados. A solução que o site já usa no Bento City é pôr a **versão no endereço** de cada arquivo pelo import map (ver 4.13).
- **Outros jogos 3D do site** usam Three.js guardado dentro do jogo: Ilha Selvagem (r170), Fúria e Bento City (r160). O **Fúria** (do Bento) já tem um modo de tiro em primeira pessoa com joystick e botões no tablet (`public/jogar/furia/js/touch.js`): é uma boa referência de como a família já joga.
- **Limites do plano grátis**, divididos com o site inteiro: D1 com cerca de 100 mil linhas gravadas por dia e as Functions com 100 mil pedidos por dia. O save na nuvem precisa ser econômico (ver 4.9).

### Regras do queres.games que não mudam

- Tudo dentro da pasta do jogo: **nada de CDN**, Google Fonts ou outro site. Bibliotecas em `vendor/`.
- **Caminhos relativos** (`src/main.js`). As únicas exceções aceitas pelo site são `/conta.js` e `/api/...`.
- **Sem analytics próprio.** A telemetria é do site (`window.QG?.evento?.(...)`, nomes em `qg-eventos.json`).
- **Login só pela conta do site** (`/conta.js`, `QGConta`). Sem tela de login própria.
- **Sem dado pessoal nem texto livre** enviado a servidor. O save na nuvem só tem estado do jogo (ver 4.9).
- Botões de verdade (`<button>`) com **`id` claros e estáveis**, porque a telemetria conta os cliques pelo `id`.
- Sem `alert`/`confirm`/`prompt`; som só depois do primeiro toque; **pausar** no `visibilitychange`.
- Arquivo de no máximo 25 MB (meta: o jogo inteiro com **menos de 4 MB**).
- Antes de publicar: `node .claude/skills/preparar-jogo-para-queres-games/verificar-jogo.mjs .`

## 4.2 O que "nível Quake 2" quer dizer aqui

O Quake 2 (1997) desenhava algo como **600 a 900 polígonos por quadro**, segundo a [análise de Fabien Sanglard](https://fabiensanglard.net/quake2/quake2_opengl_renderer.php), com texturas pequenas e pixeladas e **luz colorida pré-calculada** (lightmaps feitos com radiosidade). Um iPhone de hoje aguenta **muito** mais. Então "nível Quake 2" é um **estilo e uma meta de detalhe**, não um limite de hardware:

| Item | Quake 2 (1997) | Nosso alvo |
|---|---|---|
| Personagens e bichos | modelos simples, animação por quadros | **300 a 2.000 triângulos**, montados por código, animação por código |
| Texturas | pequenas, paleta limitada | **64 a 256 px**, geradas por código (ruído, padrões), filtro "pixelado" opcional |
| Luz | lightmaps coloridos pré-calculados | **luz "pintada" nos vértices** (cor por vértice calculada ao carregar) + 1 ou 2 luzes dinâmicas (tiro, lanterna) |
| Sombras | nenhuma em tempo real | **sombra "bolha"** (um círculo escuro embaixo dos bichos) |
| Distância de visão | corredores e salas | região aberta com **névoa** a 120–180 m |
| Polígonos por quadro | ~600–900 | **até ~150 mil** triângulos visíveis, com folga |

Esse estilo é também o que um programador sem artista consegue fazer bem: formas simples e bonitas, luz colorida, névoa e muito clima.

## 4.3 Tecnologia escolhida

| Peça | Escolha | Por quê |
|---|---|---|
| Linguagem | **JavaScript puro em módulos ES** (`<script type="module">`), **sem etapa de build** | O dono não precisa instalar nada; os arquivos vão direto para o site; qualquer sessão consegue editar e testar |
| 3D | **Three.js r170** (a mesma versão da Ilha Selvagem, já testada no site), copiada para `vendor/three/` com a licença MIT. Só os arquivos usados | Madura, documentada, roda bem no Safari; evita escrever um motor WebGL do zero. Importada por **import map com caminho relativo** (`"three": "./vendor/three/three.module.min.js"`), o que pede **iOS 16.4 ou mais novo** |
| Física e colisão | **Feita à mão** (sem biblioteca) | O jogo precisa só de cápsula do jogador × terreno, caixas e cilindros, e raios para os tiros. É simples, leve e previsível |
| Interface (HUD, menus, diálogos) | **HTML + CSS por cima do canvas** | Botões de verdade (para a telemetria e a acessibilidade), texto nítido e fácil de mudar |
| Som | **Web Audio** com sons **sintetizados por código** (tiros, passos, bichos) e música generativa por região | Sem arquivos de áudio de fora; leve |
| Arte | **Tudo gerado por código**: terreno, texturas, plantas, bichos, nave | Nada de fora; cabe em poucos MB. Se o Jojô e o Bento quiserem desenhar bichos, os desenhos podem virar textura ou modelo (decisão D16) |
| Testes | `node --test` para a lógica + Playwright (Chromium já instalado no ambiente) para o teste de fumaça | Ver 4.11 |

**WebGPU não será usado:** WebGL2 basta e funciona em todos os iPhones e iPads que rodam iOS 16.4+.

## 4.4 Orçamento de desempenho (iPhone e iPad)

- **Aparelhos das crianças:** iOS 18.7 (decisão D15). O iOS 18 roda em iPhone XS/XR (2018) ou mais novos e em iPad de 7ª geração ou mais novos, então o jogo sobra no requisito técnico (iOS 16.4+).
- **Meta:** 60 quadros por segundo em aparelhos de 2020 ou mais novos; **nunca abaixo de 30** no aparelho mais antigo que roda iOS 18 (na qualidade "Leve").
- **Chamadas de desenho (draw calls):** até **150** por quadro, idealmente menos de 100. Juntar geometrias paradas (merge por pedaço de terreno) e usar `InstancedMesh` para plantas e pedras. Há relatos de instancing lento em alguns iPhones ([bug do WebKit 218949](https://bugs.webkit.org/show_bug.cgi?id=218949)), então é preciso **medir no aparelho** e manter o plano B de geometria juntada.
- **Resolução:** `pixelRatio = min(devicePixelRatio, 2) × escala`, com a **escala dinâmica** entre 0,6 e 1,0, ajustada pelo tempo de cada quadro. Um pixel ratio 3 no iPhone deixa tudo pesado ([fórum do Three.js](https://discourse.threejs.org/t/low-fps-on-ios-mobile-with-pixel-ration-set-as-window-devicepixelratio/4963)).
- `antialias: false` (o visual pixelado não precisa); materiais simples (`MeshLambertMaterial` com cor por vértice ou um shader próprio pequeno); **sem sombras em tempo real**.
- **No máximo 20–30 bichos ativos** por região; os que estão longe "dormem".
- **Memória:** ao trocar de região, liberar (`dispose`) geometrias e texturas da região antiga.
- **Aquecimento do iPhone:** depois de 10–15 minutos o aparelho reduz a velocidade. A escala dinâmica cuida disso; há também a opção "Economia de bateria" (30 fps).
- **Modo de economia do iOS** limita a animação a 30 fps: toda a lógica usa o **tempo real decorrido**, nunca "contagem de quadros".
- **Contador de desempenho** escondido: `?debug=1` mostra fps, draw calls, triângulos e escala.

## 4.5 Organização das pastas

```
index.html              ← tela de carregamento, import map, HUD em HTML
style.css
qg-eventos.json         ← eventos da telemetria (só com aprovação do dono)
vendor/three/           ← Three.js (versão fixa) + LICENSE
src/
  main.js               ← começa tudo, máquina de telas (carregando, menu, jogando, pausa, diálogo, mochila, mapa, oficina, fim)
  nucleo/
    laco.js             ← laço do jogo: lógica em passo fixo de 60 Hz, desenho interpolado
    eventos.js          ← "barramento" de eventos (item_pego, bicho_derrotado, ...)
    aleatorio.js        ← números aleatórios com semente (o mundo é sempre igual)
    audio.js            ← sintetizador de efeitos + música generativa
    entrada/
      toque.js          ← joystick, olhar, botões multitoque
      teclado-mouse.js  ← WASD + pointer lock
      controle.js       ← Gamepad API
  desenho/
    renderizador.js     ← Three.js, escala dinâmica, névoa, perda de contexto WebGL
    texturas.js         ← gerador de texturas por código (canvas)
    ceu.js              ← céu, Brasa, Colosso, estrelas, eclipse, aurora
    modelos.js          ← monta modelos a partir de "receitas" (ver 4.7)
    particulas.js
  mundo/
    terreno.js          ← mapa de alturas em pedaços, consulta de altura e normal
    vegetacao.js        ← plantas espalhadas com semente
    salas.js            ← interiores feitos de "blocos" (nave, base, estação, cavernas)
    agua.js
    tempo.js            ← relógio do dia, noite, eclipse e meteoros
    regiao.js           ← carrega e descarrega uma região a partir dos dados
  fisica/
    colisao.js          ← cápsula × terreno/caixas/cilindros, grade espacial, raios
  entidades/
    jogador.js
    armas.js
    criaturas/          ← um arquivo por bicho: receita do modelo + comportamento
    npc.js              ← Ulo, ÍRIS (voz), Unidade 7
    itens.js
  logica/               ← SEM Three.js e SEM DOM: dá para testar no Node
    sobrevivencia.js    ← fome, frescor da comida, dor de barriga
    inventario.js
    missoes.js          ← motor de missões guiado por dados
    dialogos.js         ← motor de diálogos guiado por dados
    receitas.js         ← oficina e cozinha
    nave.js             ← estado dos 8 sistemas, combustível
    save.js             ← montar, validar e migrar o save
    save-nuvem.js       ← conversa com a API do site (ver 4.9)
  ui/
    hud.js, menus.js, dialogo.js, mochila.js, mapa.js, painel-nave.js, oficina.js
  dados/
    textos.js           ← TODOS os textos em português, num só lugar
    regioes/            ← vale.js, floresta.js, desfiladeiro.js, ...
    missoes.js, dialogos.js, itens.js, receitas.js, criaturas.js
ferramentas/
  montar-site.mjs       ← cópia para o site com a versão nos endereços (ver 4.13)
tests/
  logica/*.test.mjs     ← node --test
  fumaca.mjs            ← Playwright: abre o jogo deitado, toca, confere erros
docs/                   ← estes documentos
```

Nomes no código **em português** (como o jogo-modelo), para o dono conseguir ler; os nomes do Three.js continuam como são.

## 4.6 Mundo: regiões, terreno e interiores

**Regiões externas** (cerca de 400 × 400 m cada):
- Mapa de alturas de 256 × 256 amostras, gerado com **ruído com semente** e depois "esculpido" por operações descritas nos dados (achatar a área da nave, cavar o lago, abrir a trilha, levantar paredões).
- Cortado em pedaços de 64 × 64 (um `Mesh` juntado por pedaço), com cor por vértice (altura, inclinação e "sombra de canto" calculada ao gerar).
- Plantas e pedras espalhadas com semente + posições à mão para o que importa.
- Saídas para outras regiões: chegar perto mostra "Ir para Floresta Lumina?" (salva antes de trocar).

Exemplo de dados de região (`src/dados/regioes/vale.js`):

```js
export default {
  id: 'vale', semente: 1207, tamanho: 384,
  terreno: { base: 'colinas', ops: [
    { tipo: 'achatar', x: 0, z: 0, raio: 40, altura: 2 },
    { tipo: 'lago', x: 60, z: -30, raio: 35, prof: 4 },
    { tipo: 'trilha', pontos: [[0, 0], [120, 10], [190, 0]], largura: 5 },
  ] },
  vegetacao: [ { tipo: 'grama_pena', densidade: 0.8 }, { tipo: 'arvore_taca', densidade: 0.05 } ],
  objetos: [ { tipo: 'andorinha_caida', x: 0, z: 0, giro: 30 }, { tipo: 'traje_tavares', x: 18, z: 12 } ],
  itens: [ { id: 'desintegrador', x: 18, z: 12 }, { id: 'registro_01', x: 19, z: 12 } ],
  criaturas: [ { tipo: 'saltito', zona: [40, 40, 30], qtd: 6 }, { tipo: 'rastejador', zona: [-80, 60, 25], qtd: 3 } ],
  saidas: [ { para: 'floresta', x: 0, z: 190, raio: 6, exige: 'flag:bateria_instalada' } ],
};
```

**Interiores** (a nave por dentro, a base Cruzeiro, a estação K-7, os templos e as cavernas) são feitos de **blocos**, do jeito que os mapas do Quake eram feitos com "brushes": listas de caixas e rampas com textura. O código gera a malha, as caixas de colisão e a **luz pintada nos vértices** (luzes pontuais coloridas com teste de sombra por raio, calculado uma vez ao carregar).

## 4.7 Modelos e animação por código

Cada bicho, objeto ou peça tem uma **receita** de partes simples (caixa, cunha, cilindro, esfera, cristal) com cor, posição e "pai". O gerador junta as partes rígidas, aplica um pouco de "irregularidade" nos vértices (para não parecer feito de blocos perfeitos) e pinta a luz.

```js
export const rastejador = {
  partes: {
    corpo:  { forma: 'caixa', tam: [0.6, 0.35, 1.4], cor: '#6b3fa0', pos: [0, 0.5, 0] },
    cabeca: { forma: 'cunha', tam: [0.5, 0.3, 0.5], cor: '#7d4cb8', pos: [0, 0.1, 0.85], pai: 'corpo' },
    olhos:  { forma: 'esfera', raio: 0.06, cor: '#ffe14d', brilha: true, pos: [0.15, 0.08, 0.2], espelhar: true, pai: 'cabeca' },
    perna:  { forma: 'cilindro', raio: 0.05, alt: 0.5, cor: '#4a2a70', repetir: 6, anim: 'passo' },
    espinhos: { forma: 'cristal', qtd: 5, cor: '#9ff', brilha: true, pai: 'corpo' },
  },
};
```

**Animação procedural:** pernas balançam com seno e fase por perna, o corpo sobe e desce, a cabeça segue o alvo, as asas batem. Ataque, susto e desmaio são pequenas animações de transformação. Isso imita o visual "animado por quadros" do Quake 2 sem precisar de arquivos de animação.

## 4.8 Colisão, bichos e combate

- **Jogador:** cápsula (raio 0,4 m, altura 1,7 m); sobe degraus de até 0,4 m; escorrega em rampas acima de 45°; pulo com gravidade 0,8 g.
- **Colisão:** terreno (altura por interpolação) + caixas, cilindros e esferas numa **grade espacial**. Tiros são **raios** contra as esferas e cápsulas dos bichos e contra o cenário.
- **Bichos:** máquina de estados (dormindo, passeando, alerta, perseguindo, atacando, fugindo, atordoado, desmaiado) + percepção (cone de visão, ouvir tiros, luz) + direção com desvio de obstáculos. Rastejadores em grupo cercam; Zumbidores atacam em mergulho; robôs patrulham por pontos. Em interiores, **A\*** numa grade simples.
- **Mira assistida:** ao atirar, procura o alvo mais perto do centro dentro de um cone pequeno (o tamanho depende da dificuldade) e corrige a direção do tiro.

## 4.9 Salvar: no aparelho e na nuvem (Cloudflare)

### O que vai no save
Só **estado do jogo**: números, sim/não e **códigos internos** (`fruta_lanterna`, `vale:placa_1`). **Nenhum texto livre, nenhum nome, nenhum dado pessoal.** Tamanho típico: de 5 a 15 KB.

```json
{
  "jogo": "rumo-a-terra", "versao_save": 1, "versao_jogo": "a1b2c3d",
  "salvo_em": 1795000000, "tempo_jogado_s": 5400, "dificuldade": "sobrevivente",
  "dia": 7, "hora": 0.42, "regiao": "floresta", "pos": [12.5, 3.1, -40.2], "giro": 1.57,
  "vida": 80, "fome": 55, "escudo": 20,
  "inventario": [["sucata", 14], ["fibra", 6]],
  "comida": [["fruta_lanterna", 3, 1.5], ["racao", 4, 23]],
  "armas": ["desintegrador", "atordoador"], "equipamentos": ["lanterna", "gancho"],
  "nave": { "energia": 1, "casco": 0, "placas": 2, "motor": 1, "combustivel": 0, "navegacao": 0, "comunicacao": 0, "suporte_vida": 1, "salto": 0 },
  "missoes": { "energia": "feita", "tradutor": 2 },
  "flags": ["viu_esqueleto", "conheceu_ulo"],
  "pegos": ["vale:placa_1", "vale:registro_01"], "chefes": ["rainha_zumbidora"],
  "mapa": { "vale": [4294967295, 1023] }, "diario_criaturas": ["saltito", "rastejador"]
}
```

`src/logica/save.js` monta, **valida** e **migra** o save (o campo `versao_save` permite mudar o formato sem perder o progresso de ninguém).

### No aparelho (sempre)
- `localStorage`, com chaves próprias: `rumo-a-terra:save:1`, `:2` e `:3` (3 espaços de save) e `rumo-a-terra:config`. Nunca `localStorage.clear()`.
- **Salva sozinho:** ao dormir, ao trocar de região, ao consertar um sistema, a cada 2 minutos e quando a aba esconde.
- O jogo funciona **100% sem internet**.

### Na nuvem (para quem tem conta do queres.games)
O jogo é só um conjunto de arquivos copiados para o site, então **não tem servidor próprio**. A parte de servidor fica no repositório do site (`deadnessus/queres-games`), seguindo o **padrão que o site já usa** para guardar dados por jogador. O exemplo mais parecido é o personagem do Infiltrados na Órbita: `functions/api/infiltrados/personagem.js` + `functions/_lib/infiltrados.js`, tabela `inf_personagens`, só números e nomes de uma lista fixa, nada de texto livre. Quem faz é uma sessão do `queres-games`, com a skill `login-queres-games` de lá.

**Rotas** (no `queres-games`, em `functions/api/<slug>/saves.js`; regras em `functions/_lib/<slug>.js`):

| Pedido | O que faz |
|---|---|
| `GET /api/<slug>/saves` | Lista os espaços salvos da conta: `{ saves: [{ slot, resumo: { dia, sistemas, regiao }, salvo_em }] }` |
| `GET /api/<slug>/saves?slot=1` | Devolve um save: `{ slot, save, salvo_em }` |
| `POST /api/<slug>/saves` com `{ slot, save }` | Grava (ou troca) o save daquele espaço |
| `POST /api/<slug>/saves` com `{ slot, apagar: true }` | Apaga o espaço |

Sem login: `401`. Sem banco: `503` (`semBanco()`). Save recusado: `400` com o motivo. Gravação cedo demais: `429`.

**Como o servidor faz** (as peças já existem em `functions/_lib/conta.js`):
- Quem é a pessoa: sempre `contaAtual(request, env)`, que lê o cookie `qg_sessao`. Nunca confiar em id ou apelido vindo do pedido. Se a sessão foi renovada, devolver o `set-cookie` (como o `comCookie` do Infiltrados).
- `POST`: conferir `origemInvalida(request)` (só aceita JSON vindo do próprio site) e ler o corpo com `lerJson`.
- Tabela com o **prefixo do jogo**, ligada a `contas.id`, criada com `CREATE TABLE IF NOT EXISTS` (como as outras tabelas do site). **Nunca mexer em `contas` nem `sessoes`.**
  ```sql
  CREATE TABLE IF NOT EXISTS rt_saves (
    conta_id INTEGER NOT NULL,          -- contas.id
    slot     INTEGER NOT NULL,          -- 1 a 3
    versao   INTEGER NOT NULL,          -- versao_save
    resumo   TEXT NOT NULL,             -- JSON pequeno: dia, sistemas, regiao (para a lista)
    dados    TEXT NOT NULL,             -- o save validado, até 32 KB
    salvo_em INTEGER NOT NULL,          -- relógio do servidor (segundos)
    PRIMARY KEY (conta_id, slot)
  ) WITHOUT ROWID;
  ```
  `WITHOUT ROWID` e uma linha por espaço: cada gravação conta **1 linha** no limite diário do D1 (o site faz assim na telemetria).
- **Validação** (`conferirSave` em `functions/_lib/<slug>.js`), que protege as crianças:
  - até **32 KB**; `jogo` igual ao do jogo; `versao_save` inteiro conhecido; `slot` de 1 a 3;
  - só as **chaves de primeiro nível conhecidas** (lista fixa, a mesma do `src/logica/save.js`);
  - **todo texto** precisa casar com `^[a-z0-9_:.-]{1,40}$` (só códigos, sem espaço). Assim é **impossível** guardar nome, frase ou qualquer texto livre, por construção;
  - só números finitos (entre −10⁹ e 10⁹), sim/não, listas (até 500 itens) e objetos, com profundidade máxima de 6;
  - no máximo **1 gravação por minuto** por conta (`429` se vier antes).
- Não precisa conferir "trapaça": não há ranking nem prêmio. O save é só da própria criança.
- Plano grátis: pouco tempo de CPU por pedido, então a validação é um laço simples, sem nada pesado.

**Do lado do jogo** (`src/logica/save-nuvem.js` + a tela de menu):
- No `index.html`: `<script src="/conta.js?v=2"></script>` (caminho absoluto, aceito pelo verificador). Aberto fora do site, o arquivo não existe, `window.QGConta` fica indefinido e o jogo **esconde a nuvem** e segue só com o aparelho.
- `const eu = window.QGConta ? await QGConta.me() : null` devolve `{ logado, apelido }` ou `null`:
  - `null` (sem servidor) → nada de nuvem;
  - `logado: false` → botão "Salvar na nuvem" abre o login **dentro do jogo** com `QGConta.montar(elemento, { aba: 'entrar', rotuloFechar: 'Voltar ao jogo', aoConcluir, aoFechar })`. É a mesma tela de login de todos os jogos do site; **não** fazer tela própria;
  - `logado: true` → menu mostra "Salvando na nuvem como *Lobo Azul*"; `QGConta.perfil()` para ver a conta.
- `QGConta.aoMudar(...)` atualiza o menu quando a pessoa entra ou sai. As cores da janela de login seguem o jogo pelas variáveis `--qgc-acento`, `--qgc-destaque`, `--qgc-fundo`, `--qgc-texto`, `--qgc-fonte`.
- `fetch` com `credentials: 'same-origin'` e `content-type: application/json`.
- **Quando envia** (econômico, porque o D1 grátis é dividido com o site todo): ao dormir, ao consertar um sistema, ao trocar de região e ao sair para o menu, **no máximo a cada 5 minutos**, e pelo botão "Salvar na nuvem agora" da pausa. Sempre grava no aparelho primeiro. Exemplo de conta: 20 crianças × 10 gravações por dia = 200 linhas, longe do limite de cerca de 100 mil.
- **Conflito:** ao tocar em "Continuar", se a nuvem tiver um save mais novo que o do aparelho, mostra os dois resumos ("Este aparelho: Dia 9, 3 sistemas" × "Nuvem: Dia 12, 4 sistemas") e a criança escolhe.
- Sem internet ou erro: marca "pendente" e tenta de novo na próxima ocasião. Nada trava o jogo.

**Antes de juntar na `main` do site** (regras do `queres-games`): `npm run build` passando, teste local com `npx wrangler@4 pages dev dist --d1 DB=teste-local`, `CLAUDE.md` do site atualizado (rota e tabela `rt_saves`), post no blog explicando o que é guardado e **confirmação do dono**, porque é guardar dados de jogadores num site infantil.

**Mais tarde, se outros jogos quiserem save na nuvem:** dá para transformar isso numa rota genérica do site (`/api/saves/<jogo>`). Por enquanto, seguimos o padrão atual (rota e tabela de cada jogo).

- **Privacidade (LGPD):** a conta já é anônima (apelido gerado + código). O save não tem nada pessoal e não é misturado com a telemetria. Um nome que a criança dê ao personagem ou ao mascote (se a decisão D9 pedir) fica **só no aparelho** e é retirado antes de enviar.

## 4.10 Telemetria (proposta, só com aprovação do dono)

O site já mede sozinho sessões, tempo, erros, aparelhos e cliques em botões com `id`. Para saber **onde as crianças travam**, a proposta é usar estes eventos (no máximo 12; valores sempre em faixas, nunca números exatos):

| Evento | Dados | Para descobrir |
|---|---|---|
| `partida_iniciada` | `modo: novo / continuar` | Quantos começam e quantos voltam |
| `dificuldade_escolhida` | `nivel: explorador / ...` | Qual modo as crianças preferem |
| `regiao_entrou` | `regiao: floresta` | Até onde chegam |
| `sistema_consertado` | `sistema: energia` | O funil da história principal |
| `jogador_desmaiou` | `regiao: vale` | Onde está difícil demais |
| `chefe_vencido` | `chefe: rainha` | Se algum chefe está travando todo mundo |
| `nave_decolou` | — | Quantos terminam |

**Botões com `id` estáveis**, por exemplo: `btn-novo-jogo`, `btn-continuar`, `btn-atirar`, `btn-pular`, `btn-acao`, `btn-trocar-arma`, `btn-lanterna`, `btn-mochila`, `btn-mapa`, `btn-pausar`, `btn-salvar-nuvem`, `btn-dormir`. Nunca texto digitado ou nome em `id` ou `data-...`.

Cuidados que vêm de como o site conta os botões:
- O site guarda **no máximo 60 nomes de botão por jogo, dia e versão** (o resto vira `outros`). Então, nas listas (mochila, oficina, receitas), use **um nome por tipo de ação** (`data-acao="usar-item"`, `data-acao="fabricar"`), e não um nome diferente para cada item.
- Botões criados por JavaScript só aparecem no painel depois de usados, e **gestos no canvas não são contados** (o joystick e o arrastar para olhar). Os botões de toque do HUD devem ser `<button>` de verdade, escritos no `index.html` sempre que possível.
- O site guarda no máximo **100 combinações de evento e valor** por jogo e dia. Os eventos acima somam umas 30.

## 4.11 Testes

- **Lógica** (`node --test tests/logica`): fome e frescor, receitas, inventário, missões, diálogos e a validação e migração do save. A pasta `src/logica/` não pode importar Three.js nem usar o DOM.
- **Validador do save compartilhado:** uma cópia da regra `conferirSave` do servidor do site fica nos testes, para garantir que nenhum save do jogo seria recusado. Se mudar de um lado, mude do outro.
- **Teste de fumaça** (Playwright com o Chromium do ambiente): abre o jogo em tela de iPhone deitado (844 × 390, toque ligado) e de iPad (1180 × 820); confere que não há erro no console; simula o joystick e um tiro; tira uma captura de tela; lê o contador de desempenho do `?debug=1`.
- **No aparelho de verdade:** o Safari do iPhone e do iPad usa o motor WebKit, não o Chromium. Por isso, a cada etapa, **o dono testa no iPad e no iPhone** (o mais importante: os controles estão gostosos? está liso?).
- **Verificador do queres.games** antes de cada publicação.

## 4.12 Cuidados específicos do iPhone e do iPad

- `touch-action: none` na área do jogo; impedir zoom com pinça (`gesturestart`) e com toque duplo; `user-select: none`; `-webkit-touch-callout: none`.
- Respeitar a área segura (entalhe e barra inferior) com `env(safe-area-inset-*)`.
- No iPhone, o Safari **não deixa** um site entrar em tela cheia de verdade nem travar a tela deitada. O jogo mostra "Gire o aparelho" quando está em pé e usa todo o espaço disponível quando está deitado.
- Deslizar da borda esquerda faz o Safari voltar a página: nada de controle colado na borda.
- **Perda do contexto WebGL** (o iOS pode derrubar o 3D quando o app vai para o fundo): tratar `webglcontextlost` e `webglcontextrestored`, reconstruir a cena e salvar antes.
- Áudio: criar e "destravar" o `AudioContext` no primeiro toque; `suspend()` ao esconder a aba.
- Sem vibração (o Safari do iPhone não tem `navigator.vibrate`).
- Voz da ÍRIS (opcional, decisão D13): `speechSynthesis` com voz pt-BR do próprio aparelho, sem enviar nada para fora.

## 4.13 Como o jogo vai para o site (publicação e cache)

- Quem publica é uma sessão do `queres-games` (skill `publicar-no-queres-games`). Ela copia **só o que o jogo usa** para `public/jogar/<slug>/` (nada de `docs/`, `tests/`, `ferramentas/`) e grava o `versao.json` com o commit.
- Para isso ficar simples e sem erro, este repositório terá um script **`ferramentas/montar-site.mjs <pasta-de-destino>`** que:
  1. copia `index.html`, `style.css`, `src/` e `vendor/three/` (só os arquivos usados);
  2. coloca a **versão (commit curto) no endereço** de cada arquivo: `style.css?v=<commit>`, `src/main.js?v=<commit>` e, no **import map**, uma linha para cada módulo de `src/` (`"./src/mundo/terreno.js": "./src/mundo/terreno.js?v=<commit>"`). Os `import` entre módulos (`'./terreno.js'`) passam pelo import map e também pegam a versão nova. É o mesmo método do `scripts/atualizar-bento-city.mjs` do site, que resolveu o problema do cache de 4 horas;
  3. avisa se sobrou algum endereço externo.
- A sessão do site roda: `node <jogo>/ferramentas/montar-site.mjs public/jogar/<slug>`, depois `node scripts/gravar-versao.mjs <slug> <pasta-do-jogo> --origem deadnessus/Jojo-4` e o verificador na cópia.
- Enquanto programa aqui, o jogo roda direto da raiz do repositório (sem versão nos endereços), com um servidor local simples (`python3 -m http.server`).
- `qg-eventos.json` fica na raiz deste repositório; a lista só vale depois da próxima publicação.

