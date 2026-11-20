// Teste de fumaça: abre o jogo num navegador de verdade (Chromium do Playwright), deitado como iPhone e como iPad,
// com toque, e confere o básico: carrega sem erro, o joystick anda, arrastar olha, o botão de atirar atira
// (e mira ao arrastar), pular pula, pausar pausa, e o celular em pé pede para girar.
//
// Uso:  node tests/fumaca.mjs [pasta-para-as-capturas]
// Não substitui o teste no iPad/iPhone de verdade (o Safari usa outro motor).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pastaCapturas = resolve(process.argv[2] || join(tmpdir(), 'rumo-a-terra-capturas'));
mkdirSync(pastaCapturas, { recursive: true });

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json' };
const servidor = createServer(async (req, res) => {
  try {
    const caminho = join(raiz, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!caminho.startsWith(raiz)) throw new Error('fora');
    const corpo = await readFile(caminho.endsWith('/') ? join(caminho, 'index.html') : caminho);
    res.writeHead(200, { 'content-type': TIPOS[extname(caminho)] || 'application/octet-stream' });
    res.end(corpo);
  } catch { res.writeHead(404); res.end('não achei'); }
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}/index.html`;

const falhas = [];
const conferir = (ok, texto) => { console.log(`${ok ? 'ok  ' : 'FALHOU'} ${texto}`); if (!ok) falhas.push(texto); };
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const navegador = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] });

async function testar(nome, largura, altura) {
  console.log(`\n== ${nome} (${largura}x${altura}, toque)`);
  const ctx = await navegador.newContext({ viewport: { width: largura, height: altura }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  const cdp = await ctx.newCDPSession(page);
  const toque = (type, pontos) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pontos.map(([x, y, id]) => ({ x, y, id })) });
  const estado = () => page.evaluate(() => {
    const r = window.__rumo;
    return { estado: r.estado, x: r.jogador.pos.x, y: r.jogador.pos.y, z: r.jogador.pos.z, rumo: r.jogador.rumo, inclinacao: r.jogador.inclinacao, estourados: r.alvos.estourados };
  });

  const t0 = Date.now();
  await page.goto(`${base}?debug=1`);
  await page.waitForFunction(() => window.__rumo && window.__rumo.estado === 'inicio', null, { timeout: 60000 });
  conferir(true, `carregou em ${Date.now() - t0} ms`);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-menu.png`) });

  // Jogar (toque de verdade no botão)
  const jogar = await page.locator('#btn-jogar').boundingBox();
  await page.touchscreen.tap(jogar.x + jogar.width / 2, jogar.y + jogar.height / 2);
  await esperar(400);
  conferir((await estado()).estado === 'jogando', 'tocar em "Jogar" começa o jogo');

  // Joystick: dedão esquerdo empurrado para cima = andar para a frente
  let a = await estado();
  const jx = largura * 0.18, jy = altura * 0.7;
  await toque('touchStart', [[jx, jy, 1]]);
  for (let i = 1; i <= 6; i++) { await toque('touchMove', [[jx, jy - i * 12, 1]]); await esperar(30); }
  await esperar(1200);
  await toque('touchEnd', []);
  let b = await estado();
  const andou = Math.hypot(b.x - a.x, b.z - a.z);
  const frenteX = Math.sin(a.rumo), frenteZ = -Math.cos(a.rumo);
  const naFrente = ((b.x - a.x) * frenteX + (b.z - a.z) * frenteZ) / (andou || 1);
  conferir(andou > 2 && naFrente > 0.9, `joystick anda para a frente (${andou.toFixed(1)} m)`);
  await esperar(300);
  const parado = await estado();
  await esperar(300);
  conferir(Math.hypot((await estado()).x - parado.x, (await estado()).z - parado.z) < 0.05, 'soltar o joystick para');

  // Olhar: arrastar na metade direita
  a = await estado();
  const ox = largura * 0.65, oy = altura * 0.45;
  await toque('touchStart', [[ox, oy, 2]]);
  for (let i = 1; i <= 8; i++) { await toque('touchMove', [[ox + i * 10, oy - i * 3, 2]]); await esperar(16); }
  await toque('touchEnd', []);
  await esperar(100);
  b = await estado();
  conferir(b.rumo > a.rumo + 0.1 && b.inclinacao > a.inclinacao, 'arrastar à direita/para cima gira a câmera');

  // Andar e olhar ao mesmo tempo (dois dedos)
  a = await estado();
  await toque('touchStart', [[jx, jy, 3]]);
  await toque('touchStart', [[jx, jy, 3], [ox, oy, 4]]);
  for (let i = 1; i <= 8; i++) { await toque('touchMove', [[jx, jy - 60, 3], [ox - i * 8, oy, 4]]); await esperar(40); }
  await esperar(500);
  await toque('touchEnd', []);
  b = await estado();
  conferir(Math.hypot(b.x - a.x, b.z - a.z) > 1 && b.rumo < a.rumo - 0.05, 'dois dedos: anda e olha ao mesmo tempo');

  // Mirar num alvo e atirar segurando o botão
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador, alvo = r.alvos.lista[0];
    j.pos.set(alvo.base.x + 6, j.pos.y, alvo.base.z + 6);
    j.pos.y = j.pos.y; // a física acerta a altura no próximo passo
  });
  await esperar(300);
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador, alvo = r.alvos.lista[0];
    const dx = alvo.pos.x - j.pos.x, dz = alvo.pos.z - j.pos.z, dy = alvo.pos.y - (j.pos.y + 1.62);
    j.girar(Math.atan2(dx, -dz) - j.rumo, Math.atan2(dy, Math.hypot(dx, dz)) - j.inclinacao);
  });
  await esperar(200);
  const btn = await page.locator('#btn-atirar').boundingBox();
  const bx = btn.x + btn.width / 2, by = btn.y + btn.height / 2;
  a = await estado();
  await toque('touchStart', [[bx, by, 5]]);
  await esperar(900);
  const calor = await page.evaluate(() => getComputedStyle(document.getElementById('calor')).opacity);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-atirando.png`) });
  // arrastar em cima do botão de atirar também mira
  for (let i = 1; i <= 6; i++) { await toque('touchMove', [[bx - i * 10, by, 5]]); await esperar(16); }
  await toque('touchEnd', []);
  await esperar(1500);
  b = await estado();
  conferir(Number(calor) > 0, 'segurar o botão atira (a arma esquenta)');
  conferir(b.estourados > a.estourados, `o tiro estoura a bolha de treino (${b.estourados})`);
  conferir(b.rumo < a.rumo - 0.05, 'arrastar o dedo no botão de atirar também mira');

  // Pular
  a = await estado();
  const pulo = await page.locator('#btn-pular').boundingBox();
  await toque('touchStart', [[pulo.x + pulo.width / 2, pulo.y + pulo.height / 2, 6]]);
  await toque('touchEnd', []);
  let maiorY = a.y;
  for (let i = 0; i < 8; i++) { await esperar(50); maiorY = Math.max(maiorY, (await estado()).y); }
  conferir(maiorY > a.y + 0.5, `pular sobe (${(maiorY - a.y).toFixed(2)} m)`);

  // Ação perto da porta da nave
  await page.evaluate(() => { const r = window.__rumo, p = r.nave.porta; r.jogador.pos.set(p.x, r.jogador.pos.y, p.z); });
  await esperar(400);
  conferir(await page.locator('#btn-acao').isVisible(), 'perto da porta aparece o botão "Examinar"');

  // Pausar e continuar
  const pausa = await page.locator('#btn-pausar').boundingBox();
  await page.touchscreen.tap(pausa.x + pausa.width / 2, pausa.y + pausa.height / 2);
  await esperar(300);
  conferir((await estado()).estado === 'pausa' && await page.locator('#tela-pausa').isVisible(), 'botão de pausa pausa');
  const cont = await page.locator('#btn-continuar').boundingBox();
  await page.touchscreen.tap(cont.x + cont.width / 2, cont.y + cont.height / 2);
  await esperar(300);
  conferir((await estado()).estado === 'jogando', 'continuar volta ao jogo');

  // Celular em pé: pede para girar e pausa
  await page.setViewportSize({ width: altura, height: largura });
  await esperar(400);
  conferir(await page.locator('#tela-girar').isVisible() && (await estado()).estado === 'pausa', 'em pé aparece "Gire o aparelho" e o jogo pausa');
  await page.setViewportSize({ width: largura, height: altura });
  await esperar(400);
  conferir(!(await page.locator('#tela-girar').isVisible()), 'deitado de novo, o aviso some');

  // Os dois visuais carregam
  for (const v of ['liso', 'pixelado']) {
    await page.evaluate((x) => { window.__rumo.aplicarVisual(x); }, v);
    await page.evaluate(() => { document.getElementById('btn-continuar').click(); });
    await esperar(500);
    await page.screenshot({ path: join(pastaCapturas, `${nome}-${v}.png`) });
  }

  if (nome === 'iphone') await testarColeta(page, toque, conferir, nome);

  conferir(erros.length === 0, `sem erros no console${erros.length ? ': ' + erros.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}

// Coleta e criação: cortar árvore segurando a ação, criar pela mochila, colocar blocos, subir neles, salvar.
async function testarColeta(page, toque, conferir, nome) {
  console.log('-- coleta e criação');
  const centro = async (sel) => { const l = page.locator(sel); await l.scrollIntoViewIfNeeded(); const b = await l.boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
  const tocar = async (sel) => { const [x, y] = await centro(sel); await page.touchscreen.tap(x, y); await esperar(250); };
  // vai até a árvore mais perto e mira no tronco
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador;
    const arvores = r.recursos.lista.filter((x) => x.tipo === 'arvore' && x.estado === 'inteiro');
    arvores.sort((a, b) => Math.hypot(a.x - j.pos.x, a.z - j.pos.z) - Math.hypot(b.x - j.pos.x, b.z - j.pos.z));
    const a = arvores[0];
    window.__arvore = a;
    j.pos.set(a.x + 1.6, a.y + 0.2, a.z);
  });
  await esperar(400);
  await page.evaluate(() => {
    const r = window.__rumo, j = r.jogador, a = window.__arvore;
    const dx = a.x - j.pos.x, dz = a.z - j.pos.z, dy = a.y + 1.0 - (j.pos.y + 1.62);
    j.girar(Math.atan2(dx, -dz) - j.rumo, Math.atan2(dy, Math.hypot(dx, dz)) - j.inclinacao);
  });
  await esperar(300);
  conferir((await page.locator('#btn-acao-texto').textContent()) === 'Cortar', 'mirando no tronco aparece "Cortar"');
  const [ax, ay] = await centro('#btn-acao');
  await toque('touchStart', [[ax, ay, 9]]);
  await esperar(3800);
  await toque('touchEnd', []);
  await esperar(1500);
  const madeira = await page.evaluate(() => window.__rumo.inventario.quantos('madeira'));
  conferir(madeira >= 3 && await page.evaluate(() => window.__arvore.estado !== 'inteiro'), `segurar a ação corta a árvore e a madeira vem para a mochila (${madeira})`);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-coleta.png`) });

  // criar machado pela tela da mochila
  await page.evaluate(() => { const i = window.__rumo.inventario; i.adicionar('pedra', 5); i.adicionar('fibra', 2); i.adicionar('madeira', 4); });
  await tocar('#btn-mochila');
  conferir(await page.locator('#tela-mochila').isVisible(), 'a mochila abre (e o jogo pausa)');
  await page.screenshot({ path: join(pastaCapturas, `${nome}-mochila.png`) });
  await tocar('#aba-criar');
  await tocar('button[data-receita="machado"]');
  await tocar('button[data-receita="bloco_madeira"]');
  await tocar('button[data-receita="bloco_madeira"]');
  await page.screenshot({ path: join(pastaCapturas, `${nome}-criar.png`) });
  const tem = await page.evaluate(() => ({ machado: window.__rumo.inventario.quantos('machado'), blocos: window.__rumo.inventario.quantos('bloco_madeira') }));
  conferir(tem.machado === 1 && tem.blocos === 4, `criar machado e blocos pela tela (machado ${tem.machado}, blocos ${tem.blocos})`);

  // colocar blocos: aba Mochila -> Colocar -> mirar no chão -> Colocar
  await tocar('#aba-mochila');
  await tocar('button[data-item="bloco_madeira"]');
  conferir(await page.locator('#modo-colocar').isVisible(), 'tocar em "Colocar" volta ao jogo no modo de colocar');
  await page.evaluate(() => { const j = window.__rumo.jogador; j.girar(0, -0.75 - j.inclinacao); });
  await esperar(300);
  const antes = await page.evaluate(() => window.__rumo.construcoes.total);
  await tocar('#btn-acao');
  await esperar(200);
  await tocar('#btn-acao');
  const depois = await page.evaluate(() => window.__rumo.construcoes.total);
  conferir(depois >= antes + 2, `blocos colocados (${depois - antes}), o segundo em cima do primeiro`);
  await page.evaluate(() => { const j = window.__rumo.jogador; j.girar(0, 0.35 - j.inclinacao); });
  await esperar(400);
  await page.screenshot({ path: join(pastaCapturas, `${nome}-blocos.png`) });
  // subir nos blocos: põe o jogador em cima e deixa cair
  const subiu = await page.evaluate(async () => {
    const r = window.__rumo, b = r.construcoes.serializar().blocos.at(-1);
    r.jogador.pos.set(b[1] + 0.5, b[3] / 100 + 3, b[2] + 0.5);
    await new Promise((ok) => setTimeout(ok, 1200));
    return { y: r.jogador.pos.y, topo: b[3] / 100 + 1 };
  });
  conferir(Math.abs(subiu.y - subiu.topo) < 0.05, `dá para ficar em pé em cima do bloco (y ${subiu.y.toFixed(2)}, topo ${subiu.topo.toFixed(2)})`);

  // salvar e recarregar
  await tocar('#btn-cancelar');
  await page.evaluate(() => window.__rumo.salvarAgora());
  const guardado = await page.evaluate(() => ({ madeira: window.__rumo.inventario.quantos('madeira'), total: window.__rumo.construcoes.total }));
  await page.reload();
  await page.waitForFunction(() => window.__rumo && window.__rumo.estado === 'inicio', null, { timeout: 60000 });
  const voltou = await page.evaluate(() => ({ madeira: window.__rumo.inventario.quantos('madeira'), total: window.__rumo.construcoes.total, machado: window.__rumo.inventario.quantos('machado') }));
  conferir(voltou.madeira === guardado.madeira && voltou.total === guardado.total && voltou.machado === 1, 'depois de recarregar, a mochila e os blocos continuam lá');
  await page.evaluate(() => { localStorage.removeItem('rumo-a-terra:save:1'); });
}

async function testarComputador() {
  console.log('\n== computador (1280x720, teclado e mouse)');
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  await page.goto(`${base}?debug=1`);
  await page.waitForFunction(() => window.__rumo && window.__rumo.estado === 'inicio', null, { timeout: 60000 });
  await page.click('#btn-jogar');
  await esperar(300);
  conferir(!(await page.locator('#btn-atirar').isVisible()), 'sem toque, os botões de toque ficam escondidos');
  const pos = () => page.evaluate(() => ({ x: window.__rumo.jogador.pos.x, z: window.__rumo.jogador.pos.z }));
  const a = await pos();
  await page.keyboard.down('KeyW');
  await esperar(1000);
  await page.keyboard.up('KeyW');
  const b = await pos();
  conferir(Math.hypot(b.x - a.x, b.z - a.z) > 2, 'W anda para a frente');
  await page.evaluate(() => { const r = window.__rumo, p = r.nave.porta; r.jogador.pos.set(p.x, r.jogador.pos.y, p.z); });
  await esperar(300);
  conferir((await page.locator('#btn-acao-texto').textContent()).startsWith('E:'), 'perto da porta aparece "E: Examinar"');
  await page.keyboard.press('Escape');
  await esperar(200);
  conferir(await page.evaluate(() => window.__rumo.estado) === 'pausa', 'Esc pausa');
  conferir(erros.length === 0, `sem erros no console${erros.length ? ': ' + erros.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}

try {
  await testar('iphone', 844, 390);
  await testar('ipad', 1180, 820);
  await testarComputador();
} finally {
  await navegador.close();
  servidor.close();
}
console.log(`\nCapturas em ${pastaCapturas}`);
if (falhas.length) { console.log(`\n${falhas.length} falha(s).`); process.exit(1); }
console.log('\nTudo certo no teste de fumaça.');
