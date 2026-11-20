# Rumo à Terra: plano do jogo

> **Jogo do Jojô.** Endereço no site (quando publicar): `queres.games/jogar/rumo-a-terra/`.
> **Situação:** decisões respondidas (ver o documento 6); construção começando pela Etapa 0.

## O jogo em 1 minuto

- Você é o piloto da nave de carga **Andorinha** e está voltando para a Terra. No meio do caminho, uma chuva de meteoros acerta a nave, que cai em **Lúmen**, uma lua com ar respirável que gira em volta de um planeta gigante (o **Colosso**).
- **Missão principal:** consertar os **8 sistemas da nave**. As peças se espalharam pela região durante a queda.
- **Três preocupações ao mesmo tempo:**
  1. **Consertar** (a aventura: explorar, achar peças, pedir ajuda);
  2. **Comer** (a comida estraga em poucos dias, então é preciso coletar, cozinhar, conservar e plantar);
  3. **Ficar em segurança** (bichos selvagens, monstros e robôs abandonados; a noite é mais perigosa).
- **Quem ajuda:** a inteligência da nave (**ÍRIS**), o alienígena ermitão **Ulo** (desistiu de voltar para o planeta dele e, no fim, embarca com você), o mascote **Bolota** e os diários de uma **expedição perdida**, cujo esqueleto você acha logo no começo, com uma arma espacial.
- **Como é:** primeira pessoa, com visual "anos 90" no nível do Quake 2, feito para **iPad e iPhone deitados**, jogado com toque. Aventura com um pouco de tensão, **sem terror e sem sangue**. Público: **por volta de 10 anos**.
- **Salvar:** sempre no aparelho. Na **nuvem (Cloudflare)** para quem tem conta do queres.games, assim dá para começar no iPad e continuar no iPhone.
- **Sem online** por enquanto.

## O que já foi conferido no queres.games
O repositório do site (`deadnessus/queres-games`) foi lido: como os jogos são copiados para o site, a conta de apelido (`/conta.js`), as funções do Cloudflare com o banco D1, a telemetria, o cache de 4 horas dos arquivos e os outros jogos 3D (Ilha Selvagem, Fúria, Bento City). O plano segue o que já existe lá: o save na nuvem copia o jeito que o Infiltrados na Órbita guarda o personagem na conta, e a publicação copia o jeito do Bento City de evitar arquivos velhos no cache.

## Os documentos

| # | Documento | O que tem |
|---|-----------|-----------|
| 1 | [História, planeta e missões](1-historia-planeta-missoes.md) | Enredo em 3 atos, como é o planeta (com a ciência de verdade), as regiões, os bichos, os personagens e **17 missões secundárias** |
| 2 | [Peças da nave](2-pecas-da-nave.md) | Do que uma nave de verdade precisa para voar e qual peça do jogo representa cada sistema |
| 3 | [Jogabilidade e controles](3-jogabilidade-e-controles.md) | Fome e comida que estraga, dia e noite, armas, equipamentos, base, controles de toque |
| 4 | [Arquitetura técnica](4-arquitetura-tecnica.md) | Como o jogo vai ser feito por dentro: motor 3D, pastas, desempenho no iPhone, salvar na nuvem com Cloudflare, testes |
| 5 | [Plano de construção](5-plano-de-construcao.md) | A ordem de construção, em etapas que dá para testar com as crianças |
| 6 | [Decisões](6-decisoes.md) | As respostas do dono e o que ainda está pendente |

## Como usar estes documentos

- **Para o dono e para as crianças:** leiam o 1, o 2 e o 6. As respostas do 6 definem o jogo.
- **Para quem for programar (uma sessão do Claude):** leia tudo antes de começar e siga o 5, uma etapa por vez. Quando uma decisão do 6 for respondida, atualize os documentos para que fiquem sempre iguais ao jogo.
