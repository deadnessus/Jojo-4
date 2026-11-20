# 3. Jogabilidade e controles

## 3.1 O ciclo do jogo

```
explorar → coletar (peças, comida, materiais) → voltar à base
   ↑                                              ↓
dormir e salvar ← cozinhar, plantar, fabricar ← consertar a nave
```

Cada volta pelo ciclo deixa o jogador mais forte (equipamento novo) e abre uma região nova. No começo, a comida e a segurança apertam. Com a horta, a geladeira e as defesas da base, a preocupação passa a ser a aventura. Isso é de propósito: a sobrevivência **não pode virar chatice** depois de 1 hora.

## 3.2 O que aparece na tela (status)

| Status | O que é | Quando fica ruim |
|---|---|---|
| ❤️ **Vida** | Sua saúde | Ataques, quedas altas, comer coisa estragada |
| 🍖 **Fome** | Barriga cheia ou vazia | Barriga vazia: você anda mais devagar e a vida cai **devagar** (nunca de uma vez) |
| 🛡️ **Escudo do traje** | Proteção extra (como a armadura do Quake) | Gasta antes da vida; recarrega na base |
| 🔋 **Energia da arma** | O Desintegrador recarrega sozinho | Se atirar sem parar, superaquece e espera uns segundos |

Sem sede e sem oxigênio: o planeta tem ar, e sede seria mais uma barra para cuidar (decisão D6).

## 3.3 Comida e o tempo que ela dura

O tempo passa em **dias de Lúmen** (1 dia = 16 minutos de jogo). Cada comida tem um **frescor** e mostra uma bolinha colorida: 🟢 fresca, 🟡 quase estragando, 🟤 estragada.

| Comida | Onde | Enche | Dura (crua) | Cozida / conservada |
|---|---|---|---|---|
| Ração da nave | Kit (só 6) | muito | 30 dias | não precisa |
| Fruta-lanterna | Floresta, Vale | pouco | 2 dias | doce de fruta: 6 dias |
| Cogumelo-pão | Floresta | médio | 2 dias | assado: 4 dias. **Atenção: há cogumelos parecidos que fazem mal** (o scanner diferencia) |
| Raiz-pedra | Vale, Picos | médio | 5 dias | assada: 8 dias |
| Peixe-lanterna | Lago (pesca) | muito | 1 dia | assado: 3 dias; **defumado: 8 dias** |
| Ovos de Pernalta | Ninhos no chão | médio | 3 dias | cozidos: 5 dias |
| Carne pequena | Caça (Saltito) | médio | 1 dia | assada: 3 dias; **defumada: 8 dias** |
| Carne grande | Caça (Pernalta, Rastejador, Casco-de-Pedra, Hexamute) | muito | 1 dia | assada: 3 dias; **defumada: 8 dias** |
| Feijão | Horta da base | muito | 10 dias (seco) | cozido: 3 dias |
| Receitas do Ulo | Fogão da base | muito + bônus | 4 a 6 dias | — |

**Estragou:** comer dá "dor de barriga": anda devagar por um tempo e perde um pouco de vida. Engraçado, não nojento.

**Conservar comida, com a ciência de verdade** (a ÍRIS explica):
- **Cozinhar** (fogueira ou fogão da nave): o calor mata os micróbios que estragam a comida.
- **Defumar e secar** (varal e defumador na base): sem água, os micróbios não crescem. Era assim que se guardava comida antes da geladeira.
- **Geladeira da nave** (depois que a energia volta): no frio, os micróbios crescem devagar. Tudo dentro dela estraga **2 vezes mais devagar**.
- **Horta:** feijão do kit + sementes alienígenas do Ulo. Plantou, regou, colhe a cada 2 dias.

## 3.4 Dia, noite e eclipse

| Momento | Duração (jogo) | O que muda |
|---|---|---|
| Dia | 10 min | Luz dourada, Colosso no céu, bichos calmos |
| Entardecer / amanhecer | 1 min cada | Céu laranja e roxo |
| Noite | 4 min | A floresta brilha, aparecem Planadores noturnos, Rastejadores ficam mais ousados. Às vezes, chuva de meteoros |
| **Eclipse** (a cada 3 dias, ao meio-dia) | 1 a 2 min | Escurece de repente, os bichos noturnos saem, plantas raras abrem |

**Dormir** na cama da nave pula a noite e **salva o jogo** (só se não houver inimigos por perto).

## 3.5 Segurança e a base

- **A nave é a base:** com energia, tem luz, porta que fecha, oficina, fogão, geladeira e cama.
- **Melhorias da base:** holofotes (afastam Rastejadores), cerca, armadilhas, a torre do **Unidade 7** e o varal/defumador.
- **Quando a vida acaba ("desmaio"):** você acorda na nave (o drone da ÍRIS foi buscar você) e perde **metade da comida que carregava**. Peças, armas e materiais especiais nunca se perdem (decisão D7).

## 3.6 Armas e combate

Inspiração Quake 2 (armas diferentes para situações diferentes), mas com cara de aventura:

| Arma | Como funciona | Onde |
|---|---|---|
| **Desintegrador** | Tiro de energia, recarrega sozinho, superaquece | Já vem com você desde o começo |
| **Chave-laser** | Ferramenta de perto: corta cipó, abre caixas, golpe corpo a corpo | Kit da nave |
| **Atordoador** | Anel elétrico que paralisa bichos grandes e robôs por alguns segundos | Base Cruzeiro |
| **Dispersor** | Rajada de curta distância (tipo espingarda), usa células de energia | Fabricado na oficina |
| **Lança-luz** | Granada de luz que espanta bichos (muito boa contra Rastejadores e Planadores) | Fabricada (cristal pequeno) |
| **Rifle de raio** | Tiro carregado: segurando 2 segundos, solta um raio forte (dano 12, e 5 em quem está perto). Botão para trocar de arma | Com o esqueleto do Tavares, perto da nave (pedido do dono, D26) |

- **Mira assistida:** no toque, a mira "gruda" de leve no alvo mais próximo do centro (mais forte no modo Explorador). **Não há tiro automático**: quem atira é sempre a criança. Decisão D12.
- **Bichos derrotados** caem, somem numa nuvenzinha e **deixam cair itens** (carne, cristais, materiais); **robôs** viram sucata. Dá para **caçar** para comer. Decisões D4 e D5.
- **Chefes** têm um padrão para aprender e um ponto fraco brilhante. Nada de "esponja de tiros".

## 3.7 Equipamentos que abrem caminhos

Como em jogos de exploração clássicos, cada equipamento novo abre uma parte do mapa que antes era fechada:

| Equipamento | Abre | Como consegue |
|---|---|---|
| Lanterna forte | Cavernas escuras, afasta Planadores | Bateria instalada |
| Scanner | Mostra itens, comida boa ou ruim, fraquezas | Bateria instalada |
| Gancho | Paredões do Desfiladeiro | Fabricado com fibra |
| Botas térmicas | Chão quente das Terras Quentes | Base Cruzeiro |
| Traje térmico | Frio dos Picos Gelados | Fabricado com isolante da K-7 |
| Mochila-jato | Pulos longos (a gravidade baixa ajuda) | Fabricada com metal raro (opcional, facilita) |
| Chave dos Antigos | Cavernas de Cristal | 3 templos |

## 3.8 Coletar, criar e construir (pedido do dono em 20/11/2026, já no jogo)

**Coletar:** mire numa coisa do mundo e **segure ✋** (no computador, segure **E**). A cada golpe ela treme e solta lascas; quando quebra, os itens pulam e voam até você (como um ímã) e vão para a mochila. O que foi quebrado **cresce de novo** depois de alguns minutos, quando você está longe.

| Coisa | Botão | Dá | Sem ferramenta | Com ferramenta | Volta em |
|---|---|---|---|---|---|
| Árvore-taça | Cortar | 🪵 madeira ×3–4 | 8 golpes (luva) | 3 golpes (machado) | 4 min |
| Arbusto-chama | Colher | 🌿 fibra ×1–2 | 2 golpes | — | 2,5 min |
| Pedra pequena | Quebrar | 🪨 pedra ×1–2 | 3 golpes | 1 golpe (picareta) | 6 min |
| Pedra grande | Quebrar | 🪨 pedra ×4–6 | **precisa de picareta** | 4 golpes | 10 min |
| Cristais azuis | Quebrar | 💎 cristal ×2–3 | **precisa de picareta** | 3 golpes | 10 min |

**Mochila e criar (🎒):** a tela pausa o jogo e tem duas abas. **Mochila** mostra o que você tem (e "Colocar" nos itens de construir). **Criar** mostra as receitas, o que já tem e o que falta:

| Receita | Ingredientes | Para que serve |
|---|---|---|
| 🪓 Machado de pedra | 🪵 2 + 🪨 2 + 🌿 1 | Corta árvores bem mais rápido |
| ⛏️ Picareta de pedra | 🪵 2 + 🪨 3 + 🌿 1 | Quebra pedras grandes e cristais |
| 🔥 Fogueira | 🪵 4 + 🪨 3 | Ilumina e esquenta (depois: cozinhar e espantar bichos) |
| 📦 Bloco de madeira ×2 | 🪵 1 | Construir |
| 🧱 Bloco de pedra ×2 | 🪨 2 | Construir |
| 🔷 Bloco de cristal ×2 | 💎 1 | Construir (brilha) |

**Construir:** os blocos encaixam numa grade de 1 metro, ao lado ou em cima uns dos outros. Dá para subir neles (pulando) e fazer ponte por cima do lago. Uma prévia verde mostra onde vai ficar (vermelha = não cabe). Mirando num bloco ou numa fogueira, o botão vira **Desmontar** e o item volta para a mochila.

**Fica salvo neste aparelho:** a mochila e tudo que foi construído (ver 4.9).

### Mais receitas para depois

Receitas simples: **no máximo 3 ingredientes** e sempre mostrando o que falta. Exemplos:
- Gancho = fibra ×4 + sucata ×2
- Vara de pesca = fibra ×2 + resina ×1
- Célula de energia = cristal pequeno ×1 + fios ×1
- Kit de cura = fruta-lanterna ×2 + resina ×1
- Placa de armadura = sucata ×3 + metal raro ×1

## 3.9 Dificuldade

| Modo | Fome | Inimigos | Mira | Desmaio |
|---|---|---|---|---|
| **Explorador** | lenta | fracos e menos numerosos | assistida forte | não perde nada |
| **Sobrevivente** (padrão) | normal | normais | assistida leve | perde metade da comida carregada |
| **Veterano** | rápida | fortes | sem assistência | perde toda a comida carregada |

Dá para trocar o modo a qualquer momento no menu de pausa.

## 3.10 Controles de toque (iPad e iPhone deitados)

```
┌────────────────────────────────────────────────────────────────────┐
│ [II]   ❤️▮▮▮▮▮▯  🍖▮▮▮▯▯  🛡️▮▮▯       ☀️ Dia 3     ◀ nave    [🎒] [🗺️] │
│                                                                    │
│                              ·  (mira)                             │
│                                                         [🔦]       │
│                                                   [🔄 arma]        │
│   ( o joystick aparece                                    [✋]      │
│     onde o dedão                                       (ação:      │
│     esquerdo tocar )            (arrastar aqui = olhar) pegar,     │
│                                                        falar...)   │
│                                                   [⤒ PULO]         │
│                                                         [🔥 ATIRAR] │
└────────────────────────────────────────────────────────────────────┘
```

- **Metade esquerda:** joystick que aparece onde o dedão encostar. Empurrar até a borda = correr.
- **Metade direita:** arrastar o dedo para olhar em volta. A sensibilidade é ajustável.
- **ATIRAR:** botão grande. Ao segurar e arrastar o dedo **em cima dele**, também dá para mirar (assim o dedão direito atira e mira ao mesmo tempo, como nos jogos de tiro de celular).
- **AÇÃO (✋):** o ícone muda conforme o que está na frente: pegar, falar, abrir, consertar, comer.
- **PULO**, **trocar arma** (tocar ou deslizar), **lanterna**.
- **Mochila (🎒)** e **mapa (🗺️)** abrem telas com o jogo pausado. **Pausa (II)** no canto.
- Botões longe das bordas e do "entalhe" da tela, e fora da borda esquerda (no iPhone, deslizar dali faz o Safari voltar a página).
- Botões grandes (no mínimo 56 px no iPhone) e semitransparentes.
- **Celular em pé:** aparece "Gire o aparelho" com uma animação.

**Também funciona com:** teclado e mouse no computador (WASD, mouse para olhar, clique para atirar, E para ação, espaço para pular) e **controle de videogame** conectado ao iPad (Xbox, PlayStation ou MFi).

**Mais tarde (opcional):** mirar inclinando o aparelho (giroscópio). No iPhone, isso pede uma permissão.

## 3.11 Acessibilidade e conforto

- Tamanho do texto (normal ou grande) e legendas sempre ligadas.
- Sensibilidade do olhar, inverter eixo vertical, tamanho e transparência dos botões.
- "Reduzir tremor da tela" (para quem fica enjoado).
- Cores sempre acompanhadas de ícone (para daltônicos).
- Textos curtos (2 a 3 linhas por vez), linguagem simples.

## 3.12 Quanto tempo de jogo

- **Primeira versão jogável** (Vale da Queda): cerca de 20 minutos.
- **Jogo completo:** de 3 a 5 horas, em sessões de 20 a 40 minutos (o jogo salva sozinho com frequência).

## 3.13 Lições dos outros jogos do queres.games

O Jojô e o Bento já fizeram jogos parecidos em partes. O que aprendemos com eles (pelo blog e pelo código do site):

- **A Ilha Misteriosa** (sobrevivência): o começo estava **difícil demais** e foi preciso pôr mais comida e água nos destroços. Depois os tempos foram encurtados ("menos espera, mais ação"), e dormir passou a ter custo quando se está com fome. **Para nós:** kit de emergência generoso, primeira meia hora gentil, nada de ficar esperando (a horta e o tanque de combustível enchem **enquanto você explora**), e dormir não pode ser um jeito de fugir da fome.
- **O Fúria** (do Bento) já tem tiro em **primeira pessoa no tablet**, com joystick à esquerda e botões à direita, e o botão **ATIRAR também serve para mirar** ao arrastar o dedo. Ou seja, as crianças já conhecem esse jeito de jogar, e o nosso controle segue a mesma ideia.
- **A Ilha Selvagem** (3D, construir e animais) e o **Bento City** (até vai à Lua de foguete) mostram que as crianças gostam de mundo 3D para explorar e de espaço. **Para nós:** o diferencial é a **história** (mistério, Ulo, voltar para casa) e o planeta alienígena.
- **A Invasão Estelar** já tem naves alienígenas. Por isso o nome deste jogo não deveria parecer com "Invasão Estelar" (ver a decisão D1).
