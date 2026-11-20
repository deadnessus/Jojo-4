#!/usr/bin/env node
// Monta a cópia do jogo para o queres.games (só o que o jogo usa) com a VERSÃO no endereço de cada arquivo.
//
// Uso:  node ferramentas/montar-site.mjs <pasta-de-destino>
//   ex.: (numa sessão do repositório queres-games)
//        node ../Jojo-4/ferramentas/montar-site.mjs public/jogar/rumo-a-terra
//
// Por que a versão no endereço: o Cloudflare deixa o navegador guardar JS e CSS por 4 horas, mas o index.html é
// sempre conferido. Sem isso, depois de uma atualização a página nova rodaria misturada com módulos antigos.
// Aqui cada arquivo vira "arquivo.js?v=<commit>" e o import map aponta cada módulo de src/ para a mesma versão
// (os "import './x.js'" entre módulos passam pelo import map). É o mesmo método do Bento City no site.
//
// Copia: index.html, style.css, src/ e vendor/three/ (three.module.min.js e LICENSE). Não copia docs/, tests/,
// ferramentas/, package.json nem nada de .claude/.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv[2]) {
  console.error('Uso: node ferramentas/montar-site.mjs <pasta-de-destino>');
  process.exit(1);
}
const destino = resolve(process.argv[2]);
if (destino === raiz || raiz.startsWith(destino + sep)) {
  console.error('A pasta de destino não pode ser este repositório nem uma pasta acima dele.');
  process.exit(1);
}

let versao = String(Date.now());
try {
  versao = execFileSync('git', ['-C', raiz, 'rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim();
  const sujo = execFileSync('git', ['-C', raiz, 'status', '--porcelain', '--', 'index.html', 'style.css', 'src', 'vendor'], { encoding: 'utf8' }).trim();
  if (sujo) console.warn('[aviso] há mudanças não commitadas no jogo: a versão', versao, 'não representa exatamente o que foi copiado.');
} catch {
  console.warn('[aviso] sem git: usei a data como versão');
}

// Limpa só o que este script copia (para não sobrar arquivo apagado no jogo) e copia de novo.
mkdirSync(destino, { recursive: true });
rmSync(join(destino, 'src'), { recursive: true, force: true });
rmSync(join(destino, 'vendor', 'three'), { recursive: true, force: true });
cpSync(join(raiz, 'src'), join(destino, 'src'), { recursive: true });
mkdirSync(join(destino, 'vendor', 'three'), { recursive: true });
for (const f of ['three.module.min.js', 'LICENSE']) cpSync(join(raiz, 'vendor', 'three', f), join(destino, 'vendor', 'three', f));
cpSync(join(raiz, 'style.css'), join(destino, 'style.css'));

function listarJs(pasta) {
  const saida = [];
  for (const nome of readdirSync(pasta)) {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) saida.push(...listarJs(caminho));
    else if (nome.endsWith('.js')) saida.push(caminho);
  }
  return saida;
}
const modulos = listarJs(join(raiz, 'src')).map((c) => './' + relative(raiz, c).split(sep).join('/')).sort();

let html = readFileSync(join(raiz, 'index.html'), 'utf8');
html = html.replace(/<script type="importmap">\s*([\s\S]*?)\s*<\/script>/, (m, json) => {
  const mapa = JSON.parse(json);
  for (const [nome, alvo] of Object.entries(mapa.imports)) mapa.imports[nome] = `${alvo}?v=${versao}`;
  for (const mod of modulos) mapa.imports[mod] = `${mod}?v=${versao}`;
  return '<script type="importmap">\n' + JSON.stringify(mapa, null, 1) + '\n</script>';
});
if (!html.includes(`?v=${versao}`)) throw new Error('import map não encontrado no index.html; o jogo mudou?');
const antes = html;
html = html.replace('src="src/main.js"', `src="src/main.js?v=${versao}"`).replace('href="style.css"', `href="style.css?v=${versao}"`);
if (html === antes) throw new Error('não achei src/main.js nem style.css no index.html; o jogo mudou?');
writeFileSync(join(destino, 'index.html'), html);

const externos = [...html.matchAll(/https?:\/\/(?!www\.w3\.org)[^"'\s)<>]+/g)].map((m) => m[0]);
if (externos.length) console.warn('[aviso] endereços externos no index.html:', externos);
if (!existsSync(join(destino, 'src', 'main.js'))) throw new Error('a cópia falhou: falta src/main.js');
console.log(`[rumo-a-terra] versão ${versao}: ${modulos.length} módulos, cópia em ${destino}`);
console.log('Depois, no queres-games: node scripts/gravar-versao.mjs rumo-a-terra <pasta do Jojo-4> --origem deadnessus/Jojo-4');
