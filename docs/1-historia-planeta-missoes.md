# 1. História, planeta e missões

## 1.1 A história em 3 atos

### Prólogo: a queda (feito em 20/11/2026: cena de abertura de ~18 s, com botão Pular)
> **Como ficou no jogo:** a câmera mostra a Andorinha de fora, no espaço, com o Colosso e Lúmen ao fundo; chega a chuva de meteoros com alarme vermelho; um meteoro grande acerta a nave, a asa se solta e ela pega fogo; a nave despenca em Lúmen entrando na atmosfera em chamas; clarão, tela preta, e você acorda deitado no Vale, olhando o céu, e se levanta. As falas aparecem na tela (narrador e ÍRIS). Código em `src/cenas/prologo.js`.

Ano 2193. Você pilota sozinho a **Andorinha**, uma nave de carga pequena, de volta para a Terra depois de dois anos trabalhando numa colônia distante. (A andorinha é a ave que sempre volta para casa.)

Naves como a Andorinha viajam entre estrelas aos **saltos**. Depois de cada salto, o motor precisa descansar umas horas perto de uma estrela. Numa dessas paradas, no sistema da estrela **Brasa**, a nave atravessa sem aviso o **rastro de um cometa**: uma chuva de pedrinhas e pedras grandes.

- Alarmes, luz vermelha, a ÍRIS (a inteligência da nave) avisa: *"Impacto no casco! Motor de salto desligado!"*
- O jogador aprende a olhar em volta e a apertar 2 ou 3 botões da cabine (é o tutorial disfarçado): puxar a alavanca de pouso de emergência e ligar os escudos.
- Pela janela, pedaços da nave se soltam e caem em lugares diferentes (é por isso que as peças estão espalhadas). Clarão branco. Silêncio.

### Ato 1: sobreviver (Vale da Queda)
- Você acorda nos destroços. A ÍRIS fala fraquinho: a bateria principal foi arrancada na queda.
- **Kit de emergência:** 6 rações (duram muito, mas são só 6), uma lanterna e sementes de feijão.
- Você sai da nave e vê o céu: o **Colosso**, um planeta gigante listrado, ocupa um pedaço enorme do céu.
- **O esqueleto:** perto da nave, um traje espacial antigo, com um esqueleto dentro do capacete. Ao lado, um **Desintegrador** (arma espacial que recarrega sozinha) e um gravador: *"Registro 1 de 12, Expedição Cruzeiro. Meu nome é Tavares..."* Quem era ele? Como chegou aqui? Começa o mistério. (O nome da expedição vem do Cruzeiro do Sul, a constelação que os navegadores usavam para achar o caminho.)
- Primeiros bichos: os **Saltitos** (inofensivos) e depois os **Rastejadores** (o primeiro inimigo).
- Primeira fogueira, primeiras frutas, primeira noite: a floresta do outro lado do lago **brilha no escuro**.
- **Primeira peça:** achar a **bateria principal**, que caiu numa colina perto do lago, num ninho de Rastejadores. Com a bateria no lugar: luz, porta, oficina, geladeira e scanner voltam a funcionar.
- A ÍRIS "acorda de vez", escaneia a região e acha os sinais das outras peças. Aparece o mapa.

### Ato 2: explorar (4 regiões)
- **Floresta Lumina:** você conhece o **Ulo**, um alienígena que vive ali há 120 anos. O tradutor dele está quebrado (fala tudo embaralhado, de um jeito engraçado). Consertado o tradutor, ele vira seu principal ajudante: troca coisas, ensina receitas e dá sementes. Ele já conheceu humanos: a **Expedição Cruzeiro**, 60 anos atrás. Por isso o tradutor fala português... com gírias de 60 anos atrás ("Que supimpa!"). Aqui também estão o mascote **Bolota** e o ninho da **Rainha Zumbidora**, um inseto gigante que coleciona coisas brilhantes, inclusive o **bocal do motor** da Andorinha.
- **Desfiladeiro dos Ventos:** a **base abandonada da Expedição Cruzeiro**, com uma antena de rádio. **Virada do meio da história:** com a antena consertada, você fala com a Terra. A resposta: *"Recebemos você! Mas a nave de resgate mais próxima leva 2 anos para chegar."* Ou seja, é você quem vai ter que consertar a nave. A Terra manda as instruções do motor de salto: ele precisa de um **Cristal de Salto**, e a Expedição Cruzeiro achou cristais neste planeta.
- **Terras Quentes:** gêiseres, lama quente e a **Estação de Mineração K-7**, abandonada pela Companhia Kronos há décadas. Os robôs continuam trabalhando e acham que você é um invasor. Lá estão o **núcleo do reator** e o **eletrolisador** (a máquina que faz combustível com água).
- **Picos Gelados:** o **observatório** da Expedição, com o **rastreador de estrelas**. É preciso calibrá-lo à noite, alinhando constelações.
- **Placas do escudo térmico:** uma escondida em cada região (são 6), em lugares difíceis, como os segredos do Quake.

### Ato 3: o cristal
- O Ulo conta o segredo: os cristais ficam nas **Cavernas de Cristal**, embaixo das **Ruínas dos Antigos**, um povo que viveu ali muito tempo atrás e foi embora para as estrelas. Ele tentou entrar há 100 anos e desistiu. A porta pede a **Chave dos Antigos**, quebrada em 3 pedaços.
- Último registro do Tavares: a Expedição consertou a nave dela com a ajuda do Ulo e foi embora antes da próxima chuva de meteoros. O Tavares se perdeu numa tempestade e não voltou a tempo. A última frase dele: *"Se alguém achar isto: o caminho para casa começa na casa-cogumelo."* (É uma história um pouco triste, mas sem susto.)
- Dentro das cavernas: quebra-cabeças de luz e o **Guardião de Cristal**, uma máquina dos Antigos que é o chefe final. Atrás dele está o **Cristal de Salto**.
- **Final:** você abastece a nave, faz a lista de verificação do lançamento ("Energia? OK! Combustível? OK!"), contagem regressiva e decolagem, com o **Ulo a bordo**: ele tinha desistido de voltar para casa, mas não quer ficar sozinho de novo, e na Terra os cientistas vão ajudá-lo a achar o caminho do planeta dele. No espaço, o salto... e a **Terra azul** aparece na janela. Créditos com "o que aconteceu com cada um" (o Bolota vai junto!).

## 1.2 O planeta: Lúmen

Lúmen é inventado, mas cada característica vem de uma ideia que cientistas estudam de verdade. Assim o jogo também ensina um pouco de ciência.

| Como é em Lúmen | De onde vem (ciência de verdade) | Como aparece no jogo |
|---|---|---|
| É uma **lua** que gira em volta de um planeta gigante de gás, o Colosso | Cientistas estudam se luas de planetas gigantes ("exoluas") podem ter vida. Ainda não acharam nenhuma, mas é possível ([Heller e Barnes, 2013](https://arxiv.org/abs/1209.5323)) | O Colosso fica **sempre no mesmo lugar do céu** (a lua mostra sempre o mesmo lado para ele, como a nossa Lua faz com a Terra). Serve de **bússola**: "a nave fica do lado do Colosso" |
| A estrela, **Brasa**, é uma **anã laranja** (tipo K), um pouco menor e mais fria que o Sol | Pesquisadores acham que planetas em volta de anãs laranjas podem ser até **melhores para a vida que a Terra**: essas estrelas vivem muito mais e são mais calmas ([Schulze-Makuch e outros, 2020](https://www.space.com/superhabitable-planets)) | Luz mais dourada, pores do sol longos e alaranjados |
| **Eclipses frequentes** | Numa exolua, o planeta gigante tapa a estrela com frequência, por minutos ou horas ([Heller e Barnes](https://phys.org/news/2013-03-habitable-edge-exomoons.html)) | Evento a cada 3 dias: **escurece no meio do dia**, os bichos noturnos saem e as plantas acendem |
| **Gêiseres e vulcões** | A gravidade do gigante aperta e solta a lua o tempo todo e isso aquece o seu interior ("aquecimento por maré"), como acontece com Io, lua de Júpiter | As **Terras Quentes**: gêiseres, fontes quentes e vapor |
| **Plantas vermelhas, laranjas e roxo-escuras** (quase nenhuma verde) | A cientista Nancy Kiang, da NASA, calculou que sob outras estrelas as plantas poderiam ser vermelhas, laranjas ou até **pretas**, mas dificilmente azuis ([Scientific American](https://www.scientificamerican.com/article/local-color-plants-under-alien-suns-come-in-variety-of-hues/)) | Floresta vinho e laranja; "grama" roxa; algumas árvores quase pretas |
| **Mais oxigênio no ar** (uns 30%; na Terra são 21%) | Há 300 milhões de anos a Terra teve talvez 35% de oxigênio, e viviam parentes das libélulas com **70 cm de asa**, como a *Meganeura* ([Discover](https://www.discovermagazine.com/insects-of-the-oxygeniferous-11783)). É uma hipótese ainda discutida | **Insetos gigantes** (os Zumbidores). Fogo **pega fácil**: a fogueira acende rápido e raios podem causar incêndios |
| **Gravidade menor** (0,8 da Terra) | Em mundos menores, a gravidade é mais fraca | **Pulo mais alto**, quedas mais leves, árvores mais altas. E a explicação do final: sair de um lugar com gravidade menor gasta menos combustível, por isso dá para decolar com uma nave consertada "na raça" |
| **Brilho no escuro** (bioluminescência) | Na Terra há fungos, vaga-lumes e bichos do fundo do mar que brilham | À noite, a Floresta Lumina brilha em azul e verde |
| O **dia** dura o tempo de uma volta em torno do Colosso | Numa exolua travada, o "dia" é o tempo da volta em torno do planeta gigante | No jogo, **1 dia = 16 minutos** de jogo (10 de dia, 4 de noite, 2 de amanhecer e entardecer) |
| **Chuvas de meteoros** que voltam de tempos em tempos | O rastro de um cometa cruza o sistema sempre na mesma época (como as chuvas de meteoros da Terra) | Explica a queda da Andorinha **e** a da Expedição Cruzeiro. À noite, às vezes caem meteoritos com **metal raro**: corra para pegar |

**O céu de Lúmen:** de dia, céu azul-esverdeado claro com o Colosso enorme (listras laranja e creme, anéis finos). À noite, a luz refletida pelo Colosso clareia um pouco o chão (a noite nunca fica preta), há estrelas e duas luazinhas. No eclipse, a Brasa some atrás do Colosso e fica um anel de luz em volta dele.

## 1.3 As regiões

```
                 [Picos Gelados]
                        |
[Desfiladeiro dos Ventos]—[Vale da Queda]—[Terras Quentes]
                        |
                 [Floresta Lumina]
                        |
          [Ruínas dos Antigos e Cavernas de Cristal]
```

O **Vale da Queda** é a base central. **Atualização (D21):** o Vale agora dá a volta: andando sempre para o mesmo lado, você volta ao mesmo lugar, como num planeta pequeno. As outras regiões podem virar áreas dentro desse mundo que dá a volta (em vez de mapas separados); isso se decide quando chegarmos nelas.

| Região | Como é | Bichos | Peça principal | Para entrar precisa de | Chefe |
|---|---|---|---|---|---|
| **Vale da Queda** (base) | Campo de grama roxa, lago, a nave caída, colinas | Saltitos, Rastejadores, Boca-do-Lago (no lago) | Bateria principal | nada | (ninho de Rastejadores) |
| **Floresta Lumina** | Cogumelos-árvore gigantes, sombra, brilha à noite; casa-cogumelo do Ulo | Zumbidores, Cuspidores, Planadores noturnos | Bocal do motor e musgo-de-ar | bateria instalada (lanterna forte) | **Rainha Zumbidora** |
| **Desfiladeiro dos Ventos** | Cânions vermelhos, pontes de pedra, vento forte, ninhos nos paredões; base da Expedição Cruzeiro | Zumbidores, Casco-de-Pedra | Antena | **gancho** (feito com fibra da floresta) | **Grande Casco** |
| **Terras Quentes** | Gêiseres, lama borbulhante, vapor; Estação de Mineração K-7 | Robôs da Kronos, Cuspidores de fogo | Núcleo do reator e eletrolisador | **botas térmicas** (achadas na base Cruzeiro) | **Escavadeira-Mãe** (robô gigante) |
| **Picos Gelados** | Neve azulada, cristais de gelo, aurora no céu; observatório | Hexamutes (neutros), Rastejadores brancos | Rastreador de estrelas | **traje térmico** (feito com isolante da estação K-7) | **Grande Garra** (Rastejador gigante das neves) |
| **Ruínas e Cavernas de Cristal** | Templos dos Antigos, cavernas que brilham, quebra-cabeças de luz e espelhos | Guardiões pequenos, Rastejadores de cristal | Cristal de Salto | os 3 pedaços da **Chave dos Antigos** | **Guardião de Cristal** |

Essa ordem é a sugerida, mas o jogador pode escolher um pouco: depois da Floresta, o Desfiladeiro e as Terras Quentes podem ser feitos em qualquer ordem.

## 1.4 Os bichos (e os robôs)

Regra de tom: os bichos têm formas bem claras (dá para reconhecer de longe), cores fortes e olhos que brilham, mas **nada de sangue**. Bicho derrotado **cai, some numa nuvenzinha e deixa cair itens** (carne, cristais, materiais); robô vira sucata (que serve para consertar coisas). Dá para **caçar** para comer. Ver as decisões D4 e D5.

| Bicho | O que é | Comportamento | Perigo | Como lidar | Curiosidade (ciência) |
|---|---|---|---|---|---|
| **Saltito** | Bichinho que pula com as patas de trás | Foge de você | nenhum | Ignore; ele mostra onde tem fruta | Parecido com o jerboa, um roedor do deserto que pula como canguru |
| **Bolota** | Bolinha peluda laranja de 6 patinhas | Vira seu **mascote** (missão) | nenhum | Fareja comida e rosna quando há perigo | Na Terra, cães farejam coisas que nós não sentimos |
| **Pernalta** | Herbívoro alto de 6 pernas finas | Pasta em grupo | baixo (chuta se você atirar nele) | Deixe em paz | Animais de manada vigiam juntos |
| **Rastejador** | Lagarto de 6 patas com espinhos de cristal | Caça em grupos de 2 a 4 | médio | Tem medo de **luz forte e fogo** | Lobos também caçam em grupo |
| **Zumbidor** | Inseto voador gigante, asas de 1 m | Voo rasante; **ama coisas brilhantes** | médio | Mire quando ele vira para atacar | Parente imaginário da *Meganeura*. A ave-jardineira da Austrália coleciona objetos azuis para enfeitar o ninho |
| **Cuspidor** | Planta que cospe sementes ácidas | Fica parada | médio | Dá para ver o brilho antes do tiro | O pepino-de-são-gregório, uma planta de verdade, "atira" as sementes |
| **Casco-de-Pedra** | Besouro do tamanho de um boi | Dá carga em linha reta | alto | Desvie e acerte o **ponto fraco atrás** | O besouro-rinoceronte levanta 100 vezes o próprio peso |
| **Planador noturno** | Bichinhos voadores que brilham, em bando | Só à noite; mordiscam | baixo | **Fogem da lanterna** | Morcegos e vaga-lumes |
| **Boca-do-Lago** | Bicho grande escondido no lago | Morde quem nada em água funda | alto | Não nade no fundo à noite | Jacarés esperam parados na água |
| **Hexamute** | Bichão peludo de 6 patas | Neutro; fica bravo perto do filhote | alto se irritado | Não chegue perto do filhote | Parecido com mamutes e bisões |
| **Robôs da Kronos** | Drones vigias (atiram), robôs-aranha coletores (cortam) | Patrulham a estação | médio | Desligue as torres de energia; atordoador funciona bem | Robôs seguem o programa mesmo quando ninguém mais está lá |

### O que cada bicho deixa cair

| Bicho | Deixa cair |
|---|---|
| Saltito | carne pequena |
| Pernalta | carne grande |
| Rastejador | carne + espinho de cristal (vale como cristal pequeno) |
| Zumbidor | carapaça (material para armadura) |
| Cuspidor | sementes (para a horta) e resina |
| Casco-de-Pedra | carne grande + placa de casco (material para armadura) |
| Hexamute | carne grande + pelo (deixa o traje térmico mais quente) |
| Robôs da Kronos | sucata e fios |

O **Bolota** e os filhotes nunca são caçados. A carne crua estraga em 1 dia; assada ou defumada dura bem mais (ver 3.3).

## 1.5 Personagens

- **Você, o piloto:** não aparece (primeira pessoa). A ÍRIS chama você de "Comandante". Sem nome nem gênero definidos (decisão D9).
- **ÍRIS:** a inteligência da nave. Voz calma, faz piadas ruins de robô, dá dicas e avisa dos perigos. Fica mais esperta a cada sistema consertado (começa sem energia nem para enxergar).
- **Ulo:** alienígena da espécie *vaari*, com 2,5 m de altura, quatro braços e pele cinza-azulada com manchas que **mudam de cor conforme o humor** (como o polvo faz de verdade). É jardineiro e inventor e mora numa casa-cogumelo com horta. Fala devagar. Caiu aqui há 120 anos; a nave dele se desfez na queda e os pedaços viraram a casa-cogumelo. Ele **desistiu de voltar**. Ao longo do jogo, você devolve a esperança a ele, e no final ele **embarca com você na Andorinha** (final fixo: o jogador não escolhe).
- **Tavares:** explorador da Expedição Cruzeiro (o esqueleto). Os 12 registros dele contam a história aos poucos.
- **Bolota:** o mascote. **Nunca morre**: se apanhar, volta correndo para a base.
- **Unidade 7:** um robô coletor da Kronos que dá para reprogramar (missão). Vira o guarda da base.

## 1.6 Missões secundárias (os "subplots")

Elas aparecem conforme você explora. Nenhuma é obrigatória, mas todas ajudam.

| # | Missão | Onde | O que acontece | Recompensa |
|---|---|---|---|---|
| 1 | **Os registros do Tavares** | todas | Achar os 12 gravadores da Expedição Cruzeiro | A história completa e o **traje antigo** (mais proteção) |
| 2 | **O tradutor do Ulo** | Floresta | Levar uma bobina da nave para consertar o tradutor | O Ulo passa a falar (e a ajudar) |
| 3 | **Bolota** | Vale/Floresta | Um filhote preso embaixo de um tronco; tirar e curar | **Mascote** que fareja comida e avisa de perigo |
| 4 | **A horta de feijão** | Base | Plantar as sementes do kit, regar e colher a cada 2 dias. Depois o Ulo dá sementes alienígenas | Comida que não acaba |
| 5 | **Pescaria** | Lago | Fazer a vara de pesca e pescar peixes-lanterna (minijogo) | Comida fresca |
| 6 | **O ladrão brilhante** | Base/Floresta | Um Zumbidor rouba ferramentas da base; siga-o até o ninho | Leva à Rainha Zumbidora e ao bocal do motor |
| 7 | **Noite de eclipse** | todas | A cada 3 dias escurece no meio do dia: fique perto da luz até passar | Plantas raras que só abrem no eclipse |
| 8 | **Chuva de meteoros** | todas | À noite caem meteoritos; corra até eles | **Metal raro** para melhorias |
| 9 | **O rádio da Base Cruzeiro** | Desfiladeiro | Achar 3 fusíveis para ligar a antena | Contato com a Terra (virada da história) |
| 10 | **O mapa das estrelas** | Picos Gelados | À noite, alinhar as constelações no observatório (minijogo) | Rastreador de estrelas calibrado |
| 11 | **As torres teimosas** | Terras Quentes | Redirecionar cabos para desligar as torres de vigilância (quebra-cabeça) | Entrar na estação K-7 sem ser visto |
| 12 | **Unidade 7** | Terras Quentes | Reprogramar um robô coletor | Guarda da base à noite |
| 13 | **Diário de criaturas** | todas | Escanear todos os bichos (cada um tem uma curiosidade de ciência) | Scanner melhor: mostra o ponto fraco |
| 14 | **A Chave dos Antigos** | Floresta, Desfiladeiro e Picos | 3 templos pequenos com quebra-cabeças de luz e espelhos | Abre as Cavernas de Cristal |
| 15 | **As peças da casa do Ulo** | Floresta | A casa-cogumelo foi feita com os restos da nave dele. Ele aceita desmontar uma parte para ajudar, se você trouxer material para refazer a parede | Uma placa do escudo e fios |
| 16 | **Receitas do Ulo** | Base | Cozinhar 5 receitas diferentes | Bônus: correr mais, ver no escuro, comida que dura mais |
| 17 | **O filhote de Hexamute** | Picos Gelados | Levar um filhote perdido de volta para a manada | A manada abre uma trilha secreta |

## 1.7 Tom do jogo (para ~10 anos)

- **Sim:** aventura, descoberta, um pouco de tensão à noite, chefes grandes, mistério, humor (ÍRIS e Ulo), amizade, ciência curiosa.
- **Não:** sangue, sustos de pular da cadeira, monstros nojentos, morte de personagem amigo na frente do jogador, música de terror.
- **Referências de clima** (só o clima, sem copiar nada): exploração de planeta, sobrevivência leve e o "estilo Quake 2" de formas simples e luz colorida.
