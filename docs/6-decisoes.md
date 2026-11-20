# 6. Decisões para tomar

Cada pergunta tem opções e a **recomendação** (⭐). Para responder, basta dizer, por exemplo: "D2: A, D4: B, D10: ⭐". O que ficar sem resposta segue a recomendação.

## História e tom

**D1. Nomes.** Os nomes atuais são provisórios. O Jojô e o Bento querem escolher?
- Jogo: *Náufrago Estelar*, *Rumo à Terra*, *Andorinha*, *Planeta Perdido*, ... ou outro. Atenção: o site já tem a **Invasão Estelar** e o **Horizonte**, então é bom fugir de nomes parecidos (por isso a expedição perdida virou **Expedição Cruzeiro**). O nome também define o endereço: `queres.games/jogar/<nome>/`.
- Planeta (lua): *Lúmen*. Planeta gigante: *Colosso*. Estrela: *Brasa*.
- Nave: *Andorinha*. Inteligência da nave: *ÍRIS*. Alienígena: *Ulo*. Mascote: *Bolota*.
- ⭐ As crianças escolhem os que quiserem; o resto fica como está.

**D4. O que acontece com um bicho derrotado?**
- A ⭐ Desmaia e foge, ou some em faíscas de luz. Robôs viram sucata.
- B Morre e fica caído (sem sangue).
- C Nunca derrota: só atordoa e espanta.

**D8. O esqueleto do começo.**
- A ⭐ Esqueleto dentro do traje, aparecendo só pelo vidro do capacete (sem susto, misterioso).
- B Só o traje vazio e o gravador (nada de esqueleto).

**D9. O protagonista.**
- A ⭐ Sem nome e sem gênero definidos: a ÍRIS chama de "Comandante".
- B A criança escolhe um nome (fica **só no aparelho**, nunca vai para a nuvem).

**D10. O final do Ulo.**
- A ⭐ Você ajuda o Ulo a voltar para o planeta dele também (as duas naves decolam juntas).
- B A criança escolhe: o Ulo vai para a Terra com você, volta para o planeta dele ou fica em Lúmen.
- C O Ulo fica em Lúmen (mais agridoce).

## Como se joga

**D2. Tamanho da primeira versão publicada.**
- A ⭐ Só o Vale da Queda (cerca de 20 minutos, 1 sistema consertado), publicada logo para as crianças testarem; o resto vem em etapas.
- B Esperar até ter Vale + Floresta (cerca de 1 hora de jogo).
- C Só publicar com o jogo completo.

**D3. Como o mundo é dividido.**
- A ⭐ Base central + regiões separadas, ligadas por trilhas (carrega uma região por vez: **mais leve no iPhone**, como no Quake 2).
- B Um mundo aberto contínuo, sem telas de carregamento (mais bonito, mas mais pesado e mais demorado de fazer).

**D5. Caçar animais para comer?**
- A ⭐ Não. A comida vem de plantas, cogumelos, peixes, ovos, horta e rações.
- B Sim, alguns bichos dão carne (sem mostrar nada feio).

**D6. Sede também?**
- A ⭐ Não: só fome (já existe bastante coisa para cuidar).
- B Sim: uma barra de sede (beber água do lago fervida, chuva).

**D7. Quando a vida acaba.**
- A ⭐ Acorda na nave e perde parte da comida que carregava (depende da dificuldade).
- B Volta para o último save.
- C Como A, e um modo extra "Veterano de verdade" em que perder significa recomeçar do zero.

**D12. Mira no toque.**
- A ⭐ Mira assistida leve sempre e **tiro automático** no modo Explorador (atira sozinho quando a mira passa no inimigo).
- B Só o botão de atirar, sem tiro automático em nenhum modo.

**D17. Quanto dura um dia em Lúmen.**
- A 12 minutos (a comida estraga mais rápido no relógio).
- B ⭐ 16 minutos (10 de dia + 4 de noite + 2 de transição).
- C 24 minutos (mais calmo).

## Visual e som

**D11. O visual.**
- A ⭐ "Anos 90" de propósito: texturas pixeladas, luz colorida, névoa (como o Quake 2). Combina com o feito por código e é leve.
- B Formas simples e cores lisas, sem pixelado (estilo "low poly" moderno).
- (A decisão final pode ficar para a Etapa 0, olhando as capturas de tela das duas opções.)

**D13. Voz da ÍRIS e do Ulo.**
- A Só texto (com um "bip" de fala).
- B ⭐ Texto + voz opcional, falada pelo próprio iPad ou iPhone em português (nada vai para a internet). Pode ficar robótica, o que combina com a ÍRIS.

**D16. Desenhos das crianças.** O Jojô e o Bento querem desenhar bichos, plantas ou peças em papel para virar modelo ou textura no jogo?
- A ⭐ Sim, a partir da Etapa 2 (fotografar o desenho e mandar na sessão).
- B Não, tudo feito por código.

## Técnica

**D14. Salvar na nuvem.** (Já li o repositório `queres-games`: a conta, as funções do Cloudflare e o banco D1 já existem, e o Infiltrados na Órbita já guarda dados por conta do mesmo jeito. Então é viável e segue o padrão do site, ver 4.9.)
- Quando: A ⭐ logo depois da Floresta (Etapa 3) / B já na primeira versão / C no fim.
- Como: ⭐ rota e tabela só deste jogo (`/api/<slug>/saves`, tabela `nf_saves`), como os outros jogos do site fazem. Se depois outros jogos quiserem, vira uma rota genérica.
- Quem faz a parte do site: uma sessão do `queres-games` com permissão de escrita (a leitura já funciona daqui, porque o repositório é público). Pela regra do site, **você confirma antes do merge**, por ser dado de jogador num site infantil.

**D15. Quais aparelhos as crianças usam?** Modelo do iPad e do iPhone (por exemplo "iPad 9ª geração", "iPhone 11") e a versão do iOS. Isso define o orçamento de desempenho. O jogo vai precisar de **iOS 16.4 ou mais novo**.

**D18. Medição de acontecimentos do jogo** (para saber onde as crianças travam). Aprova os eventos propostos em 4.10 (`partida_iniciada`, `dificuldade_escolhida`, `regiao_entrou`, `sistema_consertado`, `jogador_desmaiou`, `chefe_vencido`, `nave_decolou`)?
- A ⭐ Sim, a partir da primeira versão publicada.
- B Não, só a medição automática do site.
