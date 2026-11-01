(() => {
'use strict';

/* =====================================================
   Elemental Duo 2D — HTML + CSS + JS puros
   Online: PeerJS (WebRTC) com salas por código.
   O anfitrião (Foguinho) roda o jogo; o convidado (Água)
   envia as teclas e recebe o estado.
   ===================================================== */

const TS = 32, W = 30, H = 17;
const $ = id => document.getElementById(id);
const cv = $('cv'), ctx = cv.getContext('2d', { alpha: false });

/* ---------------- FASES ----------------
   # parede  . vazio  L lava (mata Água)  A água (mata Foguinho)
   G gosma verde (mata os dois)  B botão  D portão
   F/W início  f/w portas  r gema vermelha  b gema azul
   p/P placa 1 + portão 1 (o portão só fica aberto ENQUANTO alguém pisa na placa)
   q/Q placa 2 + portão 2 (idem)
   v alavanca (empurre p/ direita = liga, p/ esquerda = desliga)  V portão que abre com a alavanca LIGADA  U portão que abre com a alavanca DESLIGADA */
function build(fn) {
  const g = Array.from({ length: H }, () => Array(W).fill('.'));
  const s = (c, r, ch) => { g[r][c] = ch; };
  const r = (c1, r1, c2, r2, ch) => { for (let y = r1; y <= r2; y++) for (let x = c1; x <= c2; x++) g[y][x] = ch; };
  r(0, 0, W - 1, 0, '#'); r(0, H - 1, W - 1, H - 1, '#');
  r(0, 0, 0, H - 1, '#'); r(W - 1, 0, W - 1, H - 1, '#');
  r(0, 15, W - 1, 15, '#');
  fn(s, r);
  return g.map(row => row.join(''));
}

const LEVELS = [
  { name: 'Fase 1 · O Templo', rows: build((s, r) => {
    r(1, 9, 24, 10, '#'); r(25, 13, 28, 14, '#'); r(26, 11, 28, 12, '#');
    r(6, 15, 8, 15, 'L'); r(12, 15, 14, 15, 'A'); r(18, 15, 19, 15, 'G');
    r(19, 9, 20, 9, 'G'); r(13, 9, 14, 9, 'L'); r(7, 9, 8, 9, 'A');
    r(10, 1, 10, 8, 'V'); s(22, 14, 'v');
    r(21, 7, 23, 7, '#'); r(15, 5, 18, 5, '#');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(5, 14, 'b'); s(10, 14, 'r'); s(16, 14, 'b'); s(22, 6, 'r'); s(16, 4, 'b'); s(17, 4, 'r'); s(16, 8, 'r'); s(11, 8, 'b');
    s(2, 8, 'f'); s(3, 8, 'w');
  }) },
  { name: 'Fase 2 · O Botão', rows: build((s, r) => {
    r(1, 9, 24, 10, '#'); r(25, 13, 28, 14, '#'); r(26, 11, 28, 12, '#');
    r(11, 1, 11, 8, 'D');
    r(15, 7, 16, 8, '#'); r(17, 5, 19, 8, '#'); r(20, 7, 21, 8, '#'); s(18, 4, 'B');
    r(22, 9, 23, 9, 'L'); r(7, 9, 8, 9, 'G');
    r(10, 15, 11, 15, 'L'); r(15, 15, 16, 15, 'A'); r(20, 15, 21, 15, 'G');
    r(4, 7, 8, 7, '#'); r(13, 4, 16, 4, '#');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(5, 14, 'b'); s(13, 14, 'r'); s(18, 14, 'b'); s(23, 14, 'r'); s(18, 3, 'b'); s(14, 3, 'r'); s(13, 8, 'r'); s(6, 6, 'b');
    s(2, 8, 'f'); s(3, 8, 'w');
  }) },
  { name: 'Fase 3 · A Torre', rows: build((s, r) => {
    r(1, 10, 24, 11, '#'); r(25, 13, 28, 14, '#'); r(26, 11, 28, 12, '#');
    r(4, 5, 28, 6, '#'); r(3, 8, 3, 9, '#'); r(1, 6, 2, 9, '#');
    r(7, 15, 8, 15, 'L'); r(12, 15, 13, 15, 'A'); r(17, 15, 18, 15, 'G');
    r(20, 10, 21, 10, 'G'); r(12, 10, 13, 10, 'L'); r(7, 10, 8, 10, 'A');
    r(10, 5, 12, 5, 'L'); r(16, 5, 18, 5, 'A');
    s(15, 9, 'v'); r(22, 1, 22, 4, 'V');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(5, 14, 'b'); s(10, 14, 'r'); s(15, 14, 'b'); s(23, 9, 'r'); s(10, 9, 'b'); s(5, 9, 'r'); s(14, 4, 'b'); s(8, 4, 'r');
    s(26, 4, 'f'); s(27, 4, 'w');
  }) },
  { name: 'Fase 4 · Rios Gêmeos', rows: build((s, r) => {
    r(1, 9, 24, 10, '#'); r(25, 13, 28, 14, '#'); r(26, 11, 28, 12, '#');
    r(6, 15, 8, 15, 'L'); r(12, 15, 14, 15, 'A'); r(18, 15, 20, 15, 'G');
    r(14, 1, 14, 8, 'P'); s(17, 8, 'p'); s(10, 8, 'p');
    r(20, 9, 21, 9, 'G'); r(7, 9, 8, 9, 'L');
    r(21, 7, 23, 7, '#'); r(16, 5, 19, 5, '#'); r(5, 7, 8, 7, '#');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(5, 14, 'r'); s(10, 14, 'b'); s(16, 14, 'r'); s(22, 14, 'b'); s(22, 6, 'r'); s(17, 4, 'b'); s(18, 4, 'r'); s(6, 6, 'b');
    s(2, 8, 'f'); s(3, 8, 'w');
  }) },
  { name: 'Fase 5 · Ilhas de Gosma', rows: build((s, r) => {
    r(1, 9, 24, 10, '#'); r(25, 13, 28, 14, '#'); r(26, 11, 28, 12, '#');
    r(6, 15, 8, 15, 'G'); r(11, 15, 13, 15, 'G'); r(16, 15, 18, 15, 'L'); r(21, 15, 23, 15, 'A');
    r(9, 11, 10, 11, '#'); r(14, 11, 15, 11, '#');
    r(17, 1, 17, 8, 'U'); r(10, 1, 10, 8, 'V'); s(13, 8, 'v');
    r(21, 9, 22, 9, 'L'); r(5, 9, 6, 9, 'A');
    r(19, 7, 21, 7, '#'); r(13, 5, 16, 5, '#');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(9, 14, 'r'); s(10, 14, 'b'); s(14, 14, 'r'); s(15, 14, 'b'); s(19, 14, 'r'); s(20, 14, 'b'); s(20, 6, 'b'); s(14, 4, 'r'); s(15, 4, 'b'); s(7, 8, 'r');
    s(2, 8, 'f'); s(3, 8, 'w');
  }) },
  { name: 'Fase 6 · O Botão da Montanha', rows: build((s, r) => {
    r(3, 13, 5, 14, '#'); r(6, 11, 8, 14, '#'); r(9, 9, 11, 14, '#'); r(12, 7, 16, 14, '#'); s(14, 6, 'B');
    r(10, 9, 10, 9, 'A'); r(17, 9, 19, 14, '#'); r(20, 11, 21, 14, '#'); r(22, 13, 23, 14, '#');
    r(24, 1, 24, 10, '#'); r(24, 11, 24, 14, 'D');
    r(26, 14, 28, 14, '#'); r(27, 12, 28, 13, '#');
    r(5, 3, 9, 3, '#'); r(12, 3, 16, 3, '#'); r(19, 5, 22, 5, '#');
    s(1, 14, 'F'); s(2, 14, 'W');
    s(4, 12, 'r'); s(7, 10, 'b'); s(13, 6, 'r'); s(15, 6, 'b'); s(20, 10, 'r'); s(22, 12, 'b'); s(7, 2, 'r'); s(14, 2, 'b');
    s(27, 11, 'f'); s(28, 11, 'w');
  }) },
  { name: 'Fase 7 · Placa de Pressão', rows: build((s, r) => {
    r(1, 9, 24, 10, '#'); r(25, 13, 28, 14, '#'); r(26, 11, 28, 12, '#');
    r(13, 11, 13, 14, 'P'); s(7, 14, 'p'); s(17, 14, 'p');
    r(4, 15, 4, 15, 'G'); r(20, 15, 22, 15, 'A');
    r(16, 1, 16, 8, 'Q'); s(19, 8, 'q'); s(13, 8, 'q');
    r(21, 9, 22, 9, 'L'); r(9, 9, 10, 9, 'G');
    r(6, 1, 6, 8, 'V'); s(22, 8, 'v');
    r(5, 7, 8, 7, '#'); r(21, 7, 22, 7, '#'); r(17, 5, 20, 5, '#');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(10, 14, 'r'); s(11, 14, 'b'); s(15, 14, 'b'); s(21, 13, 'r'); s(23, 8, 'b'); s(14, 8, 'r'); s(19, 4, 'r'); s(6, 6, 'b');
    s(2, 8, 'f'); s(3, 8, 'w');
  }) },
  { name: 'Fase 8 · Torre sobre o Lago', rows: build((s, r) => {
    r(5, 15, 12, 15, 'L'); r(13, 15, 20, 15, 'A'); r(21, 15, 28, 15, 'G');
    r(7, 13, 12, 13, '#'); r(15, 11, 20, 11, '#'); r(8, 9, 13, 9, '#'); r(16, 7, 21, 7, '#'); r(9, 5, 14, 5, '#'); r(17, 3, 28, 3, '#');
    r(23, 9, 25, 9, '#'); s(24, 8, 'v');
    r(20, 1, 20, 2, 'P'); s(22, 2, 'p'); r(25, 1, 25, 2, 'V');
    s(17, 10, 'p');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(10, 12, 'r'); s(19, 10, 'b'); s(10, 8, 'b'); s(18, 6, 'r'); s(11, 4, 'b'); s(19, 2, 'r');
    s(27, 2, 'f'); s(28, 2, 'w');
  }) },
  { name: 'Fase 9 · Duas Cores', rows: build((s, r) => {
    r(10, 1, 10, 7, '#'); r(10, 8, 10, 14, 'P'); r(20, 1, 20, 7, '#'); r(20, 8, 20, 14, 'Q');
    s(6, 14, 'p'); s(15, 14, 'p'); s(13, 14, 'q'); s(24, 14, 'q');
    r(8, 15, 8, 15, 'G'); r(17, 15, 18, 15, 'L'); r(22, 15, 22, 15, 'A');
    r(4, 13, 5, 13, '#'); r(7, 11, 9, 11, '#'); s(8, 10, 'v');
    r(26, 1, 26, 14, 'V');
    r(12, 11, 14, 11, '#');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(7, 14, 'b'); s(12, 14, 'b'); s(16, 12, 'r'); s(23, 12, 'b'); s(14, 14, 'r'); s(25, 14, 'b'); s(13, 10, 'r');
    s(27, 14, 'f'); s(28, 14, 'w');
  }) },
  { name: 'Fase 10 · O Alçapão', rows: build((s, r) => {
    r(4, 13, 5, 13, '#'); r(6, 11, 7, 11, '#'); r(8, 9, 10, 9, '#');
    r(11, 8, 28, 9, '#');
    r(23, 8, 24, 9, 'P');
    r(19, 8, 20, 8, 'G');
    r(20, 10, 20, 14, 'Q'); r(26, 10, 26, 14, 'V');
    r(13, 15, 14, 15, 'L');
    s(15, 7, 'q'); s(21, 14, 'p');
    r(13, 6, 14, 6, '#'); r(16, 4, 21, 4, '#'); s(18, 3, 'v');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(12, 7, 'r'); s(17, 7, 'b'); s(16, 14, 'r'); s(18, 14, 'b'); s(22, 7, 'r'); s(27, 7, 'b'); s(20, 3, 'r'); s(14, 5, 'b');
    s(27, 14, 'f'); s(28, 14, 'w');
  }) },
  { name: 'Fase 11 · Corredor Baixo', rows: build((s, r) => {
    r(5, 10, 24, 11, '#'); r(24, 1, 24, 9, '#');
    r(3, 13, 4, 13, '#'); r(1, 11, 2, 11, '#');
    r(9, 15, 10, 15, 'L'); r(13, 15, 14, 15, 'G'); r(17, 15, 18, 15, 'A');
    s(6, 14, 'p'); r(20, 12, 20, 14, 'P'); s(22, 14, 'p'); r(24, 12, 24, 14, 'V');
    r(25, 14, 28, 14, '#'); r(26, 12, 28, 13, '#'); r(27, 10, 28, 11, '#');
    r(11, 10, 13, 10, 'L'); r(17, 10, 18, 10, 'A'); s(21, 9, 'v');
    s(1, 14, 'F'); s(2, 14, 'W');
    s(8, 14, 'r'); s(12, 14, 'b'); s(16, 14, 'r'); s(19, 14, 'b'); s(8, 9, 'b'); s(15, 9, 'r'); s(22, 9, 'b'); s(25, 13, 'r');
    s(27, 9, 'f'); s(28, 9, 'w');
  }) },
  { name: 'Fase 12 · Três Salas', rows: build((s, r) => {
    r(8, 1, 8, 7, '#'); r(8, 8, 8, 14, 'P'); r(15, 1, 15, 7, '#'); r(15, 8, 15, 14, 'Q'); r(22, 1, 22, 7, '#'); r(22, 8, 22, 14, 'P');
    s(5, 14, 'p'); s(10, 14, 'p'); s(13, 14, 'q'); s(17, 14, 'q'); s(20, 14, 'p'); s(24, 14, 'p');
    r(6, 15, 6, 15, 'G'); r(11, 15, 12, 15, 'G'); r(18, 15, 19, 15, 'L'); r(25, 15, 25, 15, 'A');
    r(9, 13, 9, 13, '#'); r(11, 11, 13, 11, '#'); s(12, 10, 'v');
    r(26, 1, 26, 14, 'V');
    r(2, 10, 5, 10, '#'); r(17, 10, 20, 10, '#');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(7, 14, 'b'); s(14, 14, 'r'); s(21, 14, 'b'); s(23, 14, 'r'); s(12, 9, 'b'); s(19, 9, 'r'); s(4, 9, 'r');
    s(27, 14, 'f'); s(28, 14, 'w');
  }) },
  { name: 'Fase 13 · Torre do Relógio', rows: build((s, r) => {
    r(5, 15, 12, 15, 'L'); r(13, 15, 20, 15, 'A'); r(21, 15, 28, 15, 'G');
    r(7, 13, 12, 13, '#'); r(15, 11, 20, 11, '#'); r(8, 9, 13, 9, '#'); r(16, 7, 21, 7, '#'); r(9, 5, 14, 5, '#'); r(17, 3, 28, 3, '#');
    r(20, 1, 20, 2, 'P'); s(17, 10, 'p'); s(22, 2, 'p'); s(23, 2, 'q'); r(25, 1, 25, 2, 'Q'); s(26, 2, 'q');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(10, 12, 'r'); s(19, 10, 'b'); s(10, 8, 'b'); s(18, 6, 'r'); s(11, 4, 'b'); s(19, 2, 'r');
    s(27, 2, 'f'); s(28, 2, 'w');
  }) },
  { name: 'Fase 14 · A Grande Travessia', rows: build((s, r) => {
    r(5, 15, 7, 15, 'G'); r(9, 15, 11, 15, 'L'); r(13, 15, 15, 15, 'A'); r(17, 15, 19, 15, 'G');
    r(12, 1, 12, 11, '#');
    r(3, 13, 4, 13, '#'); r(1, 11, 2, 11, '#'); s(2, 10, 'v');
    r(22, 1, 22, 14, 'V'); r(25, 1, 25, 14, 'P');
    s(16, 14, 'p'); s(26, 14, 'p');
    s(1, 14, 'F'); s(2, 14, 'W');
    s(8, 14, 'r'); s(12, 14, 'b'); s(16, 13, 'r'); s(20, 14, 'b'); s(10, 12, 'b'); s(18, 12, 'r'); s(23, 14, 'r'); s(1, 10, 'b');
    s(27, 14, 'f'); s(28, 14, 'w');
  }) },
  { name: 'Fase 15 · O Cofre Triplo', rows: build((s, r) => {
    r(3, 13, 4, 14, '#'); r(5, 11, 7, 14, '#'); r(8, 13, 9, 14, '#'); s(6, 10, 'B');
    r(10, 1, 10, 10, '#'); r(10, 11, 10, 14, 'D');
    s(13, 14, 'p'); r(15, 15, 16, 15, 'L');
    r(11, 13, 11, 13, '#'); r(13, 11, 15, 11, '#'); s(14, 10, 'v');
    r(17, 1, 17, 14, 'V');
    r(19, 1, 19, 7, '#'); r(19, 8, 19, 14, 'P');
    s(21, 14, 'p'); r(22, 15, 22, 15, 'G'); s(23, 14, 'q');
    r(24, 1, 24, 7, '#'); r(24, 8, 24, 14, 'Q');
    s(26, 14, 'q');
    s(1, 14, 'F'); s(2, 14, 'W');
    s(4, 12, 'r'); s(7, 10, 'b'); s(12, 14, 'b'); s(15, 10, 'r'); s(20, 14, 'r'); s(25, 14, 'b');
    s(27, 14, 'f'); s(28, 14, 'w');
  }) },
  { name: 'Fase 16 · Rio de Gosma', rows: build((s, r) => {
    r(3, 15, 21, 15, 'G');
    r(5, 13, 6, 13, '#'); r(9, 12, 10, 12, '#'); r(13, 13, 13, 13, '#'); r(16, 11, 17, 11, '#'); r(19, 12, 19, 12, '#');
    r(19, 9, 21, 9, '#'); s(19, 8, 'v');
    r(23, 1, 23, 14, 'V'); r(24, 1, 24, 9, '#'); r(24, 10, 24, 14, 'P');
    s(13, 12, 'p'); s(26, 14, 'p');
    s(1, 14, 'F'); s(2, 14, 'W');
    s(5, 12, 'r'); s(10, 11, 'b'); s(16, 10, 'r'); s(17, 10, 'b'); s(22, 14, 'r'); s(21, 8, 'b');
    s(27, 14, 'f'); s(28, 14, 'w');
  }) },
  { name: 'Fase 17 · Três Andares', rows: build((s, r) => {
    r(1, 10, 24, 11, '#'); r(4, 5, 28, 6, '#');
    r(25, 13, 28, 14, '#'); r(26, 11, 28, 12, '#');
    r(3, 8, 3, 9, '#'); r(1, 6, 2, 9, '#');
    r(14, 7, 14, 9, 'P'); r(18, 1, 18, 4, 'Q'); r(25, 1, 25, 4, 'V');
    s(8, 14, 'p'); s(12, 9, 'p'); s(14, 4, 'q'); s(22, 4, 'q'); s(17, 9, 'v');
    r(11, 15, 12, 15, 'L'); r(16, 15, 17, 15, 'G'); r(21, 15, 22, 15, 'A');
    r(20, 10, 21, 10, 'L'); r(7, 10, 8, 10, 'A');
    r(10, 5, 11, 5, 'G'); r(23, 5, 24, 5, 'L');
    s(2, 14, 'F'); s(3, 14, 'W');
    s(14, 14, 'r'); s(19, 14, 'b'); s(23, 9, 'r'); s(10, 9, 'b'); s(8, 4, 'r'); s(20, 4, 'b');
    s(26, 4, 'f'); s(27, 4, 'w');
  }) },
  { name: 'Fase 18 · Poço de Cada Elemento', rows: build((s, r) => {
    r(4, 15, 10, 15, 'L'); s(7, 15, 'p');
    r(3, 13, 4, 13, '#'); r(6, 11, 9, 11, '#');
    r(12, 1, 12, 7, '#'); r(12, 8, 12, 14, 'P');
    s(13, 14, 'p');
    r(15, 15, 19, 15, 'A'); s(17, 15, 'q');
    r(14, 13, 15, 13, '#'); r(17, 11, 19, 11, '#');
    r(21, 1, 21, 7, '#'); r(21, 8, 21, 14, 'Q');
    s(23, 14, 'q'); r(25, 15, 25, 15, 'G');
    r(22, 13, 22, 13, '#'); r(24, 11, 25, 11, '#'); s(24, 10, 'v'); r(26, 1, 26, 14, 'V');
    s(1, 14, 'F'); s(2, 14, 'W');
    s(7, 10, 'b'); s(18, 10, 'r'); s(4, 12, 'r'); s(15, 12, 'b'); s(24, 14, 'r'); s(22, 12, 'b');
    s(27, 14, 'f'); s(28, 14, 'w');
  }) },
  { name: 'Fase 19 · Poços Invertidos', rows: build((s, r) => {
    r(4, 15, 10, 15, 'A'); s(7, 15, 'q');
    r(3, 13, 4, 13, '#'); r(6, 11, 9, 11, '#'); r(5, 1, 10, 7, '#'); s(7, 10, 'v');
    r(12, 1, 12, 7, '#'); r(12, 8, 12, 14, 'Q');
    s(13, 14, 'q');
    r(15, 15, 19, 15, 'L'); s(17, 15, 'p');
    r(14, 13, 15, 13, '#'); r(17, 11, 19, 11, '#'); r(16, 1, 20, 7, '#');
    r(21, 1, 21, 7, '#'); r(21, 8, 21, 14, 'P');
    s(23, 14, 'p'); r(25, 15, 25, 15, 'G'); r(26, 1, 26, 14, 'V');
    r(23, 11, 25, 11, '#'); r(22, 13, 22, 13, '#');
    s(1, 14, 'F'); s(2, 14, 'W');
    s(8, 10, 'r'); s(18, 10, 'b'); s(4, 12, 'b'); s(15, 12, 'r'); s(24, 14, 'b'); s(24, 10, 'r');
    s(27, 14, 'f'); s(28, 14, 'w');
  }) },
  { name: 'Fase 20 · O Grande Templo', rows: build((s, r) => {
    r(3, 13, 4, 14, '#'); r(5, 11, 7, 14, '#'); r(8, 13, 9, 14, '#'); s(6, 10, 'B');
    r(10, 1, 10, 10, '#'); r(10, 11, 10, 14, 'D');
    r(12, 15, 14, 15, 'L'); s(13, 15, 'p'); r(16, 15, 16, 15, 'G');
    r(11, 13, 11, 13, '#'); r(13, 11, 15, 11, '#'); s(14, 10, 'v'); r(17, 1, 17, 14, 'V');
    r(18, 1, 18, 7, '#'); r(18, 8, 18, 14, 'P');
    s(19, 14, 'p'); r(20, 15, 20, 15, 'G'); r(21, 15, 23, 15, 'A'); s(22, 15, 'q');
    r(25, 1, 25, 7, '#'); r(25, 8, 25, 14, 'Q');
    s(26, 14, 'q');
    s(1, 14, 'F'); s(2, 14, 'W');
    s(4, 12, 'r'); s(7, 10, 'b'); s(12, 14, 'b'); s(15, 10, 'r'); s(19, 12, 'b'); s(24, 14, 'r');
    s(27, 14, 'f'); s(28, 14, 'w');
  }) }
];

/* ---------------- ESTADO ---------------- */
let G = null;
let mode = 'local';           // local | host | guest
let frame = 0;
let remoteInput = [0, 0, 0], remoteJLatch = 0;
let lastSent = '';
const keys = {};
const touch = [{ l: 0, r: 0, j: 0 }, { l: 0, r: 0, j: 0 }];
const jLatch = [0, 0, 0]; // toques rápidos no pular ficam guardados até o próximo quadro (0,1 = local; 2 = tecla)

const SPEED = 3.1, GRAV = 0.55, JUMP = -10.8, MAXFALL = 12;
const COYOTE = 6, JBUF = 8; // em quadros (1/60 s)

function loadLevel(i, keepTime) {
  const L = LEVELS[i];
  const grid = L.rows.map(row => row.split(''));
  const gems = [], doors = [], sp = [[2, 14], [3, 14]];
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
    const ch = grid[r][c];
    if (ch === 'F') { sp[0] = [c, r]; grid[r][c] = '.'; }
    else if (ch === 'W') { sp[1] = [c, r]; grid[r][c] = '.'; }
    else if (ch === 'r' || ch === 'b') { gems.push({ c, r, t: ch === 'r' ? 0 : 1 }); grid[r][c] = '.'; }
    else if (ch === 'f' || ch === 'w') { doors[ch === 'f' ? 0 : 1] = [c, r]; grid[r][c] = '.'; }
  }
  const time = keepTime && G ? G.time : 0;
  G = {
    level: i, grid, gems, doors, collected: new Set(), gateOpen: false, hold: [false, false, false, false], down: [false, false], lever: false,
    status: 'play', deadWho: -1, time, clearTimer: 0,
    players: sp.map((s, k) => {
      const x = s[0] * TS + (TS - 22) / 2, y = (s[1] + 1) * TS - 28 - 0.01;
      return { x, y, rx: x, ry: y, w: 22, h: 28, vx: 0, vy: 0, ground: true, face: 1, alive: true, atDoor: false, type: k };
    }),
    bg: makeBg(grid)
  };
}

/* ---------------- FÍSICA ---------------- */
function solidAt(c, r) {
  if (c < 0 || r < 0 || c >= W || r >= H) return true;
  const ch = G.grid[r][c];
  return ch === '#' || (ch === 'D' && !G.gateOpen) || (ch === 'P' && !G.hold[0]) || (ch === 'Q' && !G.hold[1]) || (ch === 'V' && !G.lever && !G.hold[2]) || (ch === 'U' && G.lever && !G.hold[3]);
}
/* placas seguradas: o portão fica aberto enquanto alguém pisa na placa (ou ainda está dentro do portão, para nunca prender ninguém) */
function updateHolds() {
  const down = [false, false], hold = [false, false, false, false];
  G.players.forEach(p => {
    if (!p.alive) return;
    const c1 = Math.max(0, Math.floor((p.x + 3) / TS)), c2 = Math.min(W - 1, Math.floor((p.x + p.w - 3) / TS));
    const r1 = Math.max(0, Math.floor((p.y + 6) / TS)), r2 = Math.min(H - 1, Math.floor((p.y + p.h - 1) / TS));
    for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) {
      const ch = G.grid[r][c];
      if (ch === 'p') down[0] = true; else if (ch === 'q') down[1] = true;
    }
    const a1 = Math.floor(p.x / TS), a2 = Math.floor((p.x + p.w - 0.001) / TS);
    const b1 = Math.floor(p.y / TS), b2 = Math.floor((p.y + p.h - 0.001) / TS);
    for (let r = b1; r <= b2; r++) for (let c = a1; c <= a2; c++) {
      if (r < 0 || c < 0 || r >= H || c >= W) continue;
      const ch = G.grid[r][c];
      if (ch === 'P') hold[0] = true; else if (ch === 'Q') hold[1] = true; else if (ch === 'V') hold[2] = true; else if (ch === 'U') hold[3] = true;
    }
  });
  G.down = down; G.hold = [hold[0] || down[0], hold[1] || down[1], hold[2], hold[3]];
}
function collides(x, y, w, h) {
  const c1 = Math.floor(x / TS), c2 = Math.floor((x + w - 0.001) / TS);
  const r1 = Math.floor(y / TS), r2 = Math.floor((y + h - 0.001) / TS);
  for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) if (solidAt(c, r)) return true;
  return false;
}
function moveX(p, dx) {
  p.x += dx;
  if (collides(p.x, p.y, p.w, p.h)) {
    if (dx > 0) p.x = Math.floor((p.x + p.w) / TS) * TS - p.w - 0.001;
    else if (dx < 0) p.x = (Math.floor(p.x / TS) + 1) * TS;
  }
}
function moveY(p, dy) {
  p.y += dy; p.ground = false;
  if (collides(p.x, p.y, p.w, p.h)) {
    if (dy > 0) { p.y = Math.floor((p.y + p.h) / TS) * TS - p.h - 0.001; p.vy = 0; p.ground = true; }
    else if (dy < 0) { p.y = (Math.floor(p.y / TS) + 1) * TS; p.vy = 0; }
  }
}

function step(inp) {
  if (G.status === 'clear') {
    if (--G.clearTimer <= 0) {
      if (G.level + 1 < LEVELS.length) loadLevel(G.level + 1, true);
      else G.status = 'finished';
    }
    return;
  }
  if (G.status !== 'play') return;
  G.time += 1 / 60;

  G.players.forEach((p, i) => {
    const k = inp[i];
    p.vx = ((k.r ? 1 : 0) - (k.l ? 1 : 0)) * SPEED;
    if (p.vx) p.face = Math.sign(p.vx);
    // tempo do pulo: "coyote time" (pula logo após sair da borda) e buffer (toque um pouco antes de pousar vale)
    p.coy = p.ground ? COYOTE : Math.max(0, (p.coy || 0) - 1);
    if (k.j && !p.jHeld) p.jbuf = JBUF; else p.jbuf = Math.max(0, (p.jbuf || 0) - 1);
    p.jHeld = !!k.j;
    if (p.jbuf > 0 && p.coy > 0) { p.vy = JUMP; p.ground = false; p.jbuf = 0; p.coy = 0; }
    p.vy = Math.min(p.vy + GRAV, MAXFALL);
    moveX(p, p.vx);
    moveY(p, p.vy);

    // perigos, botão
    const c1 = Math.max(0, Math.floor((p.x + 3) / TS)), c2 = Math.min(W - 1, Math.floor((p.x + p.w - 3) / TS));
    const r1 = Math.max(0, Math.floor((p.y + 6) / TS)), r2 = Math.min(H - 1, Math.floor((p.y + p.h - 1) / TS));
    for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) {
      const ch = G.grid[r][c];
      if ((ch === 'L' && p.type === 1) || (ch === 'A' && p.type === 0) || ch === 'G') {
        if (p.alive) { p.alive = false; G.status = 'dead'; G.deadWho = i; }
      } else if (ch === 'B') G.gateOpen = true;
      else if (ch === 'v') { if (p.vx > 0) G.lever = true; else if (p.vx < 0) G.lever = false; }
    }
    // gemas
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    G.gems.forEach((g, gi) => {
      if (g.t === p.type && !G.collected.has(gi) &&
          Math.abs(cx - (g.c * TS + 16)) < 18 && Math.abs(cy - (g.r * TS + 16)) < 22) G.collected.add(gi);
    });
    // porta
    const d = G.doors[p.type];
    p.atDoor = !!d && Math.abs(cx - (d[0] * TS + 16)) < 14 && cy > d[1] * TS - 8 && cy < (d[1] + 1) * TS + 4;
  });

  updateHolds();
  if (G.status === 'play' && G.players.every(p => p.atDoor && p.alive)) {
    G.status = 'clear'; G.clearTimer = 80;
  }
}

/* ---------------- ENTRADA ---------------- */
addEventListener('keydown', e => {
  if (!keys[e.code] && ['ArrowUp', 'KeyW', 'Space'].includes(e.code)) { jLatch[2] = 1; if (e.code === 'ArrowUp') jLatch[0] = 1; if (e.code === 'KeyW') jLatch[1] = 1; }
  keys[e.code] = true;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'KeyR' && G && $('game').classList.contains('active') && G.status !== 'clear') doRetry();
});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

const mine = () => {
  const j = !!(keys.ArrowUp || keys.KeyW || keys.Space || touch[0].j || jLatch[0] || jLatch[2]);
  jLatch[0] = jLatch[2] = 0;
  return {
    l: !!(keys.ArrowLeft || keys.KeyA || touch[0].l),
    r: !!(keys.ArrowRight || keys.KeyD || touch[0].r),
    j
  };
};
function getInputs() {
  if (mode === 'local') {
    const a = { l: !!(keys.ArrowLeft || touch[0].l), r: !!(keys.ArrowRight || touch[0].r), j: !!(keys.ArrowUp || touch[0].j || jLatch[0]) };
    const b = { l: !!(keys.KeyA || touch[1].l), r: !!(keys.KeyD || touch[1].r), j: !!(keys.KeyW || touch[1].j || jLatch[1]) };
    jLatch[0] = jLatch[1] = jLatch[2] = 0;
    return [a, b];
  }
  const rj = !!(remoteInput[2] || remoteJLatch); remoteJLatch = 0;
  return [mine(), { l: remoteInput[0], r: remoteInput[1], j: rj }];
}

function buildTouch() {
  const el = $('touch'); el.innerHTML = '';
  touch.forEach(t => { t.l = t.r = t.j = 0; });
  el.classList.toggle('two', mode === 'local');
  (mode === 'local' ? [0, 1] : [0]).forEach(p => {
    const d = document.createElement('div');
    d.className = 'pad p' + p;
    d.innerHTML = `<div class="move"><button data-p="${p}" data-k="l" aria-label="Esquerda">◀</button><button data-p="${p}" data-k="r" aria-label="Direita">▶</button></div><button class="jump" data-p="${p}" data-k="j" aria-label="Pular">⬆</button>`;
    el.appendChild(d);
  });
  // mouse (para testar no PC); dedos são tratados em readTouches
  el.querySelectorAll('button').forEach(b => {
    const p = +b.dataset.p, k = b.dataset.k;
    b.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { touch[p][k] = 1; if (k === 'j') jLatch[p] = 1; } });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, e => { if (e.pointerType === 'mouse') touch[p][k] = 0; }));
    b.addEventListener('contextmenu', e => e.preventDefault());
  });
}
// Lê todos os dedos na tela: dá para deslizar entre botões e apertar vários ao mesmo tempo
function readTouches(e) {
  if (e.target && e.target.closest && e.target.closest('#touch') && e.cancelable) e.preventDefault();
  const was = [touch[0].j, touch[1].j];
  touch.forEach(t => { t.l = t.r = t.j = 0; });
  for (const tc of e.touches) {
    const el = document.elementFromPoint(tc.clientX, tc.clientY);
    const b = el && el.closest ? el.closest('#touch button') : null;
    if (b) touch[+b.dataset.p][b.dataset.k] = 1;
  }
  for (let i = 0; i < 2; i++) if (touch[i].j && !was[i]) jLatch[i] = 1;
}
['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(ev => document.addEventListener(ev, readTouches, { passive: false }));

/* ---------------- REDE (PeerJS) ---------------- */
const PREFIX = 'elemental-duo-v1-';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
/* Servidores para a conexão funcionar entre redes diferentes (ex.: PC no Wi-Fi + celular no 4G/5G).
   Os TURN abaixo são públicos e gratuitos (podem ficar lentos). Para ficar 100% estável,
   crie uma conta grátis em metered.ca (Open Relay) e troque username/credential pelos seus. */
const TURN_SERVERS = [
  { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turns:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' }
];
const PEER_OPTS = {
  debug: 0,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' },
      ...TURN_SERVERS
    ],
    iceCandidatePoolSize: 4
  }
};
let peer = null, conn = null, netGen = 0, roomCode = '', lastRx = 0;

function genCode() { let s = ''; for (let i = 0; i < 4; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]; return s; }
function lobbyMsg(t) { $('lobbyMsg').textContent = t || ''; }
setInterval(() => {
  if ((mode === 'host' || mode === 'guest') && G && performance.now() - lastRx > 8000) netLost('Conexão perdida com o outro jogador.');
}, 1000);
function cleanupNet() {
  netGen++;
  try { if (conn) conn.close(); } catch (e) {}
  try { if (peer) peer.destroy(); } catch (e) {}
  conn = null; peer = null; remoteInput = [0, 0, 0]; remoteJLatch = 0;
}
function netLost(msg) {
  cleanupNet(); G = null;
  showScreen('lobby'); lobbyMsg(msg);
}
function hasPeer() {
  if (typeof Peer === 'undefined') { lobbyMsg('Não foi possível carregar a biblioteca online. Verifique sua internet.'); return false; }
  return true;
}

function createRoom(attempt = 0) {
  if (!hasPeer()) return;
  cleanupNet();
  const my = netGen, code = genCode();
  lobbyMsg('Criando sala...');
  peer = new Peer(PREFIX + code, PEER_OPTS);
  peer.on('open', () => {
    if (my !== netGen) return;
    roomCode = code; $('roomCode').textContent = code; lobbyMsg('');
    showScreen('waiting');
  });
  peer.on('error', err => {
    if (my !== netGen) return;
    if (err.type === 'unavailable-id' && attempt < 5) return createRoom(attempt + 1);
    cleanupNet(); showScreen('lobby');
    lobbyMsg('Não foi possível criar a sala. Tente novamente.');
  });
  peer.on('connection', c => {
    if (my !== netGen) return;
    if (conn && conn.open) { c.close(); return; }          // sala cheia
    conn = c;
    const begin = () => { if (my === netGen) startGame('host'); };
    if (c.open) begin(); else c.on('open', begin);
    c.on('data', d => {
      if (my !== netGen || !d) return;
      lastRx = performance.now();
      if (d.t === 'in') { if (d.k[2] && !remoteInput[2]) remoteJLatch = 1; remoteInput = d.k; }
      else if (d.t === 'restart' && G) loadLevel(G.level, true);
      else if (d.t === 'again' && G && G.status === 'finished') loadLevel(0, false);
    });
    c.on('close', () => { if (my === netGen) netLost('Seu amigo saiu da sala.'); });
  });
}

function joinRoom() {
  const code = $('roomInput').value.trim().toUpperCase();
  if (code.length !== 4) return lobbyMsg('Digite o código de 4 caracteres.');
  if (!hasPeer()) return;
  cleanupNet();
  const my = netGen;
  lobbyMsg('Entrando na sala...');
  peer = new Peer(PEER_OPTS);
  peer.on('open', () => {
    if (my !== netGen) return;
    conn = peer.connect(PREFIX + code, { reliable: true, serialization: 'json' });
    conn.on('open', () => { if (my === netGen) startGame('guest'); });
    conn.on('data', d => { if (my === netGen && d && d.t === 's') { lastRx = performance.now(); applySnapshot(d); } });
    conn.on('close', () => { if (my === netGen) netLost('A sala foi fechada.'); });
  });
  peer.on('error', err => {
    if (my !== netGen) return;
    const msg = err.type === 'peer-unavailable' ? 'Sala não encontrada. Confira o código.' : 'Erro de conexão. Tente novamente.';
    cleanupNet(); lobbyMsg(msg);
  });
  setTimeout(() => {
    if (my === netGen && mode !== 'guest' && !(conn && conn.open)) { cleanupNet(); lobbyMsg('Tempo esgotado. Tente novamente.'); }
  }, 12000);
}

function snapshot() {
  return {
    t: 's', lv: G.level, st: G.status, gate: G.gateOpen, h: G.hold, dn: G.down, lev: G.lever, who: G.deadWho, time: G.time,
    col: [...G.collected],
    p: G.players.map(p => [p.x, p.y, p.face, p.alive ? 1 : 0, p.atDoor ? 1 : 0, p.vx, p.ground ? 1 : 0])
  };
}
function applySnapshot(d) {
  if (!G || G.level !== d.lv) loadLevel(d.lv, false);
  G.status = d.st; G.gateOpen = d.gate; G.hold = d.h || [false, false, false, false]; G.lever = !!d.lev; G.down = d.dn || [false, false]; G.deadWho = d.who; G.time = d.time;
  G.collected = new Set(d.col);
  d.p.forEach((a, i) => {
    const p = G.players[i];
    p.x = a[0]; p.y = a[1]; p.face = a[2]; p.alive = !!a[3]; p.atDoor = !!a[4]; p.vx = a[5]; p.ground = !!a[6];
  });
}
function sendInput() {
  if (!conn || !conn.open) return;
  const m = mine(), arr = [+m.l, +m.r, +m.j], s = arr.join('');
  if (s !== lastSent || frame % 10 === 0) { conn.send({ t: 'in', k: arr }); lastSent = s; }
}

/* ---------------- TELAS / UI ---------------- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  document.body.classList.toggle('ingame', id === 'game');
  if (id !== 'game') releaseAwake();
  window.scrollTo(0, 0);
}

/* --- dispositivo: mostra controles de toque em celular/tablet (e dá para alternar no botão) --- */
let showTouch = matchMedia('(pointer:coarse)').matches;
function applyTouch() { document.body.classList.toggle('touch', showTouch); $('btnTouch').classList.toggle('on', showTouch); }
applyTouch();
$('btnTouch').onclick = () => { showTouch = !showTouch; applyTouch(); };

/* --- tela cheia (onde o navegador permite) --- */
const rootEl = document.documentElement;
const reqFs = rootEl.requestFullscreen || rootEl.webkitRequestFullscreen;
$('btnFull').hidden = !reqFs;
$('btnFull').onclick = () => {
  const inFs = document.fullscreenElement || document.webkitFullscreenElement;
  if (inFs) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  Promise.resolve(reqFs.call(rootEl)).then(() => {
    try { screen.orientation.lock('landscape').catch(() => {}); } catch (e) {}
  }).catch(() => {});
};

/* --- impede a tela do celular de apagar durante a partida --- */
let wl = null;
async function keepAwake() {
  try {
    if ('wakeLock' in navigator && !wl) { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => { wl = null; }); }
  } catch (e) {}
}
function releaseAwake() { try { if (wl) wl.release(); } catch (e) {} wl = null; }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && G) keepAwake(); });
function startGame(m) {
  mode = m; frame = 0; lastSent = ''; ovKey = ''; lastRx = performance.now();
  G = null; loadLevel(0, false);
  buildTouch();
  $('hudRole').textContent = m === 'host' ? '🔥 Você é o Foguinho' : m === 'guest' ? '💧 Você é a Água' : '🔥 Setas  ·  💧 A D W';
  $('controls').textContent = m === 'local'
    ? '🔥 Foguinho: setas ← → ↑   |   💧 Água: A D W   |   R reinicia a fase'
    : 'Mova com ← → ↑ (ou A D W). Espaço também pula. R reinicia a fase.';
  $('btnRestart').hidden = false;
  showScreen('game');
  keepAwake();
}
function leaveGame() { cleanupNet(); G = null; mode = 'local'; showScreen('menu'); }

function doRetry() {
  if (!G) return;
  if (mode === 'guest') conn && conn.open && conn.send({ t: 'restart' });
  else loadLevel(G.level, true);
}
function doAgain() {
  if (!G) return;
  if (mode === 'guest') conn && conn.open && conn.send({ t: 'again' });
  else loadLevel(0, false);
}

const fmt = s => { s = Math.floor(s); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
let ovKey = '';
let uiLevel = -1, uiGems = '', uiTime = '';
function updateUI() {
  const gm = '💎 ' + G.collected.size + '/' + G.gems.length, tm = fmt(G.time);
  if (G.level !== uiLevel) { uiLevel = G.level; $('hudLevel').textContent = LEVELS[G.level].name; }
  if (gm !== uiGems) { uiGems = gm; $('hudGems').textContent = gm; }
  if (tm !== uiTime) { uiTime = tm; $('hudTime').textContent = tm; }
  const key = G.status + ':' + G.deadWho + ':' + G.level;
  if (key === ovKey) return;
  ovKey = key;
  const ov = $('overlay'), t = $('ovTitle'), x = $('ovText'), b = $('ovBtns');
  b.innerHTML = '';
  ov.hidden = G.status === 'play';
  if (G.status === 'dead') {
    t.textContent = '💀 Ops!';
    x.textContent = (G.deadWho === 0 ? 'O Foguinho' : 'A Água') + ' não resistiu a esse perigo.';
    b.innerHTML = '<button class="btn fogo" data-act="retry">Tentar de novo</button>';
  } else if (G.status === 'clear') {
    t.textContent = '⭐ Fase completa!'; x.textContent = 'Preparando a próxima fase...';
  } else if (G.status === 'finished') {
    t.textContent = '🎉 Vocês venceram!';
    x.textContent = 'Todas as fases concluídas em ' + fmt(G.time) + '.';
    b.innerHTML = '<button class="btn fogo" data-act="again">Jogar de novo</button><button class="btn ghost" data-act="menu">Menu</button>';
  }
}
$('ovBtns').addEventListener('click', e => {
  const a = e.target.dataset.act;
  if (a === 'retry') doRetry(); else if (a === 'again') doAgain(); else if (a === 'menu') leaveGame();
});

$('btnLocal').onclick = () => startGame('local');
$('btnOnline').onclick = () => { lobbyMsg(''); showScreen('lobby'); };
$('btnCreate').onclick = () => createRoom();
$('btnJoin').onclick = joinRoom;
$('roomInput').addEventListener('input', e => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});
$('roomInput').addEventListener('keydown', e => { if (e.key === 'Enter') joinRoom(); });
$('lobbyBack').onclick = () => { cleanupNet(); showScreen('menu'); };
$('waitBack').onclick = () => { cleanupNet(); lobbyMsg(''); showScreen('lobby'); };
$('btnLeave').onclick = leaveGame;
$('btnRestart').onclick = doRetry;
$('btnCopy').onclick = () => {
  const done = () => { $('btnCopy').textContent = 'Copiado!'; setTimeout(() => { $('btnCopy').textContent = 'Copiar código'; }, 1500); };
  if (navigator.clipboard) navigator.clipboard.writeText(roomCode).then(done, () => {}); 
};

/* ---------------- DESENHO (visual tecnológico) ---------------- */
const CYAN = '#00e5ff';
const hash = (a, b) => { const n = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return n - Math.floor(n); };
const HZ = {
  L: { body: ['#ff5a00', '#7a0d00'], line: '#ffd54f', glow: '255,90,0', spark: '#ff9a3c' },
  A: { body: ['#1e90ff', '#06306b'], line: '#b3e5fc', glow: '0,160,255', spark: '#7fd8ff' },
  G: { body: ['#7cff3a', '#1d5a0a'], line: '#eaffb0', glow: '124,255,58', spark: '#b6ff7a' }
};

function makeBg(grid) {
  const c = document.createElement('canvas'); c.width = W * TS; c.height = H * TS;
  const g = c.getContext('2d');
  const bgG = g.createLinearGradient(0, 0, 0, c.height);
  bgG.addColorStop(0, '#050912'); bgG.addColorStop(1, '#0d1a33');
  g.fillStyle = bgG; g.fillRect(0, 0, c.width, c.height);

  // grade
  g.lineWidth = 1;
  for (let x = 0; x <= c.width; x += TS) {
    g.strokeStyle = x % 128 === 0 ? 'rgba(0,229,255,.09)' : 'rgba(0,229,255,.04)';
    g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, c.height); g.stroke();
  }
  for (let y = 0; y <= c.height; y += TS) {
    g.strokeStyle = y % 128 === 0 ? 'rgba(0,229,255,.09)' : 'rgba(0,229,255,.04)';
    g.beginPath(); g.moveTo(0, y + .5); g.lineTo(c.width, y + .5); g.stroke();
  }
  // trilhas de circuito
  for (let i = 0; i < 16; i++) {
    let cx = Math.floor(hash(i, 1) * W), cy = Math.floor(hash(i, 2) * H);
    let horiz = hash(i, 3) > .5;
    g.strokeStyle = 'rgba(0,229,255,.11)'; g.fillStyle = 'rgba(0,229,255,.22)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx * TS + 16, cy * TS + 16);
    for (let s = 0; s < 4; s++) {
      const len = 1 + Math.floor(hash(i, 10 + s) * 5), dir = hash(i, 20 + s) > .5 ? 1 : -1;
      if (horiz) cx += len * dir; else cy += len * dir;
      cx = Math.max(0, Math.min(W - 1, cx)); cy = Math.max(0, Math.min(H - 1, cy));
      g.lineTo(cx * TS + 16, cy * TS + 16); horiz = !horiz;
    }
    g.stroke(); g.beginPath(); g.arc(cx * TS + 16, cy * TS + 16, 4, 0, 7); g.fill();
  }

  // painéis metálicos
  for (let r = 0; r < H; r++) for (let col = 0; col < W; col++) {
    if (grid[r][col] !== '#') continue;
    const x = col * TS, y = r * TS;
    g.fillStyle = '#121c33'; g.fillRect(x, y, TS, TS);
    g.fillStyle = '#1c2a48'; g.fillRect(x + 2, y + 2, TS - 4, TS - 4);
    const pg = g.createLinearGradient(x, y, x, y + TS);
    pg.addColorStop(0, 'rgba(120,170,255,.18)'); pg.addColorStop(1, 'rgba(0,0,0,.28)');
    g.fillStyle = pg; g.fillRect(x + 2, y + 2, TS - 4, TS - 4);
    g.fillStyle = '#0a1222';
    [[5, 5], [TS - 6, 5], [5, TS - 6], [TS - 6, TS - 6]].forEach(([a, b]) => { g.beginPath(); g.arc(x + a, y + b, 1.6, 0, 7); g.fill(); });
    g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1; g.strokeRect(x + .5, y + .5, TS - 1, TS - 1);
  }
  // bordas neon nas faces expostas
  const open = (r, col) => r >= 0 && col >= 0 && r < H && col < W && grid[r][col] !== '#';
  g.save(); g.shadowColor = CYAN; g.shadowBlur = 8; g.strokeStyle = CYAN; g.lineWidth = 2;
  for (let r = 0; r < H; r++) for (let col = 0; col < W; col++) {
    if (grid[r][col] !== '#') continue;
    const x = col * TS, y = r * TS;
    g.beginPath();
    if (open(r - 1, col)) { g.moveTo(x, y + 1); g.lineTo(x + TS, y + 1); }
    if (open(r + 1, col)) { g.moveTo(x, y + TS - 1); g.lineTo(x + TS, y + TS - 1); }
    if (open(r, col - 1)) { g.moveTo(x + 1, y); g.lineTo(x + 1, y + TS); }
    if (open(r, col + 1)) { g.moveTo(x + TS - 1, y); g.lineTo(x + TS - 1, y + TS); }
    g.stroke();
  }
  g.restore();
  // vinheta (assada no fundo, em vez de um gradiente de tela cheia a cada quadro)
  const vg = g.createRadialGradient(480, 272, 260, 480, 272, 620);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.5)');
  g.fillStyle = vg; g.fillRect(0, 0, c.width, c.height);
  return c;
}

function drawChar(c, type, cx, cy, o) {
  const face = o.face || 1, walking = o.moving && o.onGround, t = o.t || 0;
  const sw = walking ? Math.sin(t * 0.5) : 0, bob = walking ? -Math.abs(Math.sin(t * 0.5)) * 1.5 : 0;
  const glow = type === 0 ? '#ff6d00' : '#29b6f6';
  c.save(); c.translate(cx, cy);
  if (o.alive === false) c.globalAlpha = 0.35;
  c.lineJoin = 'round'; c.lineWidth = 2;
  const legs = col => {
    c.fillStyle = col; c.strokeStyle = '#05080f';
    c.fillRect(-7 + sw * 2, -9, 4, 9); c.strokeRect(-7 + sw * 2, -9, 4, 9);
    c.fillRect(3 - sw * 2, -9, 4, 9); c.strokeRect(3 - sw * 2, -9, 4, 9);
  };
  if (type === 0) {
    legs('#e53935'); c.translate(0, bob);
    const gr = c.createLinearGradient(0, -50, 0, -8);
    gr.addColorStop(0, '#fff176'); gr.addColorStop(.45, '#ff6d00'); gr.addColorStop(1, '#e53935');
    
    c.beginPath();
    c.moveTo(-12, -10);
    c.quadraticCurveTo(-18, -26, -10, -40);
    c.quadraticCurveTo(-8, -31, -4, -29);
    c.quadraticCurveTo(-4, -41, 1, -50);
    c.quadraticCurveTo(4, -37, 7, -31);
    c.quadraticCurveTo(9, -35, 12, -40);
    c.quadraticCurveTo(19, -26, 12, -10);
    c.quadraticCurveTo(0, -1, -12, -10);
    c.closePath(); c.fillStyle = gr; c.fill(); c.strokeStyle = '#3b0d00'; c.stroke();
    c.shadowBlur = 0;
    c.fillStyle = 'rgba(255,214,0,.55)'; c.beginPath(); c.ellipse(0, -22, 7, 11, 0, 0, 7); c.fill();
    c.fillStyle = '#ffeb3b'; c.lineWidth = 1.2; c.strokeStyle = '#2a0800';
    [-5, 5].forEach(ex => { c.beginPath(); c.arc(ex, -20, 4, 0, 7); c.fill(); c.stroke(); });
    c.fillStyle = '#000';
    [-5, 5].forEach(ex => { c.beginPath(); c.arc(ex + face, -20, 1.6, 0, 7); c.fill(); });
    c.lineWidth = 1.6; c.beginPath(); c.arc(0, -17, 6, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke();
  } else {
    legs('#29b6f6'); c.translate(0, bob);
    
    c.fillStyle = '#29b6f6'; c.strokeStyle = '#01579b';
    c.fillRect(-5, -13, 10, 6); c.strokeRect(-5, -13, 10, 6);
    c.beginPath(); c.ellipse(-3, -38, 8, 5.5, -0.3, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(11, -28); c.quadraticCurveTo(19, -22, 15, -14); c.quadraticCurveTo(10, -20, 9, -22); c.closePath(); c.fill(); c.stroke();
    const gr = c.createLinearGradient(0, -37, 0, -11);
    gr.addColorStop(0, '#b3ecff'); gr.addColorStop(1, '#039be5');
    c.beginPath(); c.arc(0, -24, 13, 0, 7); c.fillStyle = gr; c.fill(); c.stroke();
    c.shadowBlur = 0;
    c.fillStyle = 'rgba(225,245,254,.85)';
    c.beginPath(); c.ellipse(7, -31, 4, 2.5, 0.5, 0, 7); c.fill();
    c.beginPath(); c.ellipse(-8, -18, 3, 2, 0, 0, 7); c.fill();
    c.fillStyle = '#e1f5fe'; c.lineWidth = 1.2;
    [-5, 5].forEach(ex => { c.beginPath(); c.arc(ex, -24, 4, 0, 7); c.fill(); c.stroke(); });
    c.fillStyle = '#1565c0';
    [-5, 5].forEach(ex => { c.beginPath(); c.arc(ex + face, -24, 1.8, 0, 7); c.fill(); });
    c.strokeStyle = '#01579b'; c.lineWidth = 1.6; c.beginPath(); c.arc(0, -21, 6, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke();
  }
  c.restore();
}

function drawAura(c, type, cx, cy, r, a) {
  const col = type === 0 ? '255,109,0' : '0,184,255';
  const g = c.createRadialGradient(cx, cy, 2, cx, cy, r);
  g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g;
  c.fillRect(cx - r, cy - r, r * 2, r * 2); c.restore();
}

function drawDoor(type, c, r, open, t) {
  const col = type === 0 ? '#ff6d00' : '#00b8ff', col2 = type === 0 ? '#ffd180' : '#b3ecff';
  const x = c * TS + 2, y = (r + 1) * TS - 62, w = TS - 4, h = 62, cx = x + w / 2, cy = y + h / 2 + 4;
  const arch = () => {
    ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + 14);
    ctx.quadraticCurveTo(x, y, cx, y); ctx.quadraticCurveTo(x + w, y, x + w, y + 14);
    ctx.lineTo(x + w, y + h); ctx.closePath();
  };
  ctx.save();
  arch(); ctx.fillStyle = '#04060c'; ctx.fill();
  ctx.save(); arch(); ctx.clip();
  const rg = ctx.createRadialGradient(cx, cy, 2, cx, cy, 36);
  rg.addColorStop(0, open ? col2 : col + '99'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = rg; ctx.fillRect(x, y, w, h);
  ctx.lineWidth = 2; ctx.strokeStyle = open ? '#fff' : col; ctx.globalAlpha = .85;
  for (let k = 0; k < 3; k++) {
    const a = t * 0.06 * (k % 2 ? -1 : 1) + k * 2;
    ctx.beginPath(); ctx.arc(cx, cy, 8 + k * 7, a, a + Math.PI * 1.2); ctx.stroke();
  }
  ctx.restore();
  arch(); ctx.lineWidth = open ? 10 : 7; ctx.strokeStyle = col; ctx.globalAlpha = open ? .28 : .18; ctx.stroke();
  arch(); ctx.lineWidth = 3; ctx.globalAlpha = 1; ctx.stroke();
  ctx.fillStyle = col2; ctx.globalAlpha = .95;
  ctx.beginPath();
  if (type === 0) {
    ctx.moveTo(cx, cy - 9); ctx.quadraticCurveTo(cx + 9, cy, cx + 4, cy + 7);
    ctx.quadraticCurveTo(cx, cy + 10, cx - 4, cy + 7); ctx.quadraticCurveTo(cx - 9, cy, cx, cy - 9);
  } else {
    ctx.moveTo(cx, cy - 10); ctx.bezierCurveTo(cx + 9, cy + 1, cx + 6, cy + 9, cx, cy + 9);
    ctx.bezierCurveTo(cx - 6, cy + 9, cx - 9, cy + 1, cx, cy - 10);
  }
  ctx.fill();
  ctx.restore();
}

/* ---------------- PARTÍCULAS ---------------- */
const parts = []; let shake = 0;
function spawn(x, y, vx, vy, life, size, color) {
  if (parts.length < 160) parts.push({ x, y, vx, vy, life, max: life, size, color });
}
function burst(x, y, color, n, sp = 3) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.283, s = Math.random() * sp + .5;
    spawn(x, y, Math.cos(a) * s, Math.sin(a) * s, 30 + Math.random() * 20, 2 + Math.random() * 2.5, color);
  }
}
function fx() {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vx *= .97; p.vy *= .97;
    if (--p.life <= 0) parts.splice(i, 1);
  }
  shake *= .88; if (shake < .3) shake = 0;
  if (!G) return;
  if (!G._seen) {
    G._seen = new Set(G.collected); G._dead = [false, false]; G._clr = false; G._hz = [];
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
      const h = HZ[G.grid[r][c]]; if (h) G._hz.push({ x: c * TS, y: r * TS, col: h.spark });
    }
  }
  G.collected.forEach(gi => {
    if (G._seen.has(gi)) return;
    G._seen.add(gi);
    const g = G.gems[gi];
    if (g) burst(g.c * TS + 16, g.r * TS + 16, g.t === 0 ? '#ff5a7a' : '#4fd8ff', 14);
  });
  G.players.forEach((p, i) => {
    const cx = p.x + p.w / 2, fy = p.y + p.h;
    if (!p.alive && !G._dead[i]) { G._dead[i] = true; burst(cx, p.y + 14, i === 0 ? '#ff9a3c' : '#5fd0ff', 40, 5); shake = 14; }
    if (!p.alive) return;
    if (frame % 3 === 0) spawn(cx + (Math.random() - .5) * 10, p.y + 8, (Math.random() - .5) * .5, -0.6 - Math.random() * .6, 28, 2, i === 0 ? '#ff9a3c' : '#8be4ff');
    if (p.ground && p.vx !== 0 && frame % 4 === 0) spawn(cx - p.face * 6, fy - 1, -p.face * .6, -.3, 16, 2, '#9fb4d8');
  });
  if (G.status === 'clear' && !G._clr) {
    G._clr = true;
    G.doors.forEach((d, i) => d && burst(d[0] * TS + 16, (d[1] + 1) * TS - 30, i === 0 ? '#ff9a3c' : '#5fd0ff', 30, 4));
  }
  if (frame % 5 === 0 && G._hz.length) {
    const h = G._hz[Math.floor(Math.random() * G._hz.length)];
    spawn(h.x + Math.random() * TS, h.y + 8, (Math.random() - .5) * .4, -.8 - Math.random() * .8, 30, 2, h.col);
  }
}



/* ---------- sprites em cache (evita criar gradientes e sombras a cada quadro) ---------- */
const glowCache = {};
function gateGlow(glow, horiz) {
  const k = glow + (horiz ? 'h' : 'v');
  if (glowCache[k]) return glowCache[k];
  const cs = document.createElement('canvas'); cs.width = horiz ? TS : 24; cs.height = horiz ? 24 : TS;
  const g = cs.getContext('2d');
  const bg = horiz ? g.createLinearGradient(0, 2, 0, 22) : g.createLinearGradient(2, 0, 22, 0);
  bg.addColorStop(0, `rgba(${glow},0)`); bg.addColorStop(.5, `rgba(${glow},1)`); bg.addColorStop(1, `rgba(${glow},0)`);
  g.fillStyle = bg; g.fillRect(0, 0, cs.width, cs.height);
  return (glowCache[k] = cs);
}
function scanLines(c, x, y, t, horiz) {
  c.fillStyle = 'rgba(255,255,255,.4)';
  const off = (t * 1.5) % 16;
  for (let i = -1; i < 3; i++) {
    const d = off + i * 16;
    if (d < 0 || d > TS - 1.5) continue;
    if (horiz) c.fillRect(x + d, y + 11, 1.5, 10); else c.fillRect(x + 11, y + d, 10, 1.5);
  }
}
const hzCache = {};
function hzSprite(ch) {
  if (hzCache[ch]) return hzCache[ch];
  const hz = HZ[ch], cs = document.createElement('canvas'); cs.width = TS; cs.height = 26 + TS;
  const g = cs.getContext('2d');
  const gg = g.createLinearGradient(0, 0, 0, 33);
  gg.addColorStop(0, `rgba(${hz.glow},0)`); gg.addColorStop(1, `rgba(${hz.glow},.32)`);
  g.fillStyle = gg; g.fillRect(0, 0, TS, 33);
  const lg = g.createLinearGradient(0, 33, 0, 26 + TS);
  lg.addColorStop(0, hz.body[0]); lg.addColorStop(1, hz.body[1]);
  g.fillStyle = lg; g.fillRect(0, 33, TS, TS - 7);
  g.fillStyle = 'rgba(0,0,0,.2)';
  for (let yy = 37; yy < 26 + TS; yy += 4) g.fillRect(0, yy, TS, 1);
  return (hzCache[ch] = cs);
}
const gemCache = [];
function gemSprite(tp) {
  if (gemCache[tp]) return gemCache[tp];
  const col = tp === 0 ? '#ff3d5a' : '#18c7ff', dark = tp === 0 ? '#7a0020' : '#004a7a';
  const cs = document.createElement('canvas'); cs.width = 44; cs.height = 48;
  const g = cs.getContext('2d'); g.translate(22, 24);
  g.shadowColor = col; g.shadowBlur = 14;
  const gr = g.createLinearGradient(-8, -11, 8, 11);
  gr.addColorStop(0, '#fff'); gr.addColorStop(.4, col); gr.addColorStop(1, dark);
  g.beginPath(); g.moveTo(0, -11); g.lineTo(8, -4); g.lineTo(8, 5); g.lineTo(0, 11); g.lineTo(-8, 5); g.lineTo(-8, -4); g.closePath();
  g.fillStyle = gr; g.fill(); g.shadowBlur = 0;
  g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.4; g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(0, -11); g.lineTo(0, 11); g.moveTo(-8, -4); g.lineTo(0, 2); g.lineTo(8, -4); g.stroke();
  return (gemCache[tp] = cs);
}
const waveY = new Array(TS / 4 + 1);

/* portões e placas de pressão (canal 1 = prata, canal 2 = rosa) */
const CH = {
  P: { k: 0, col: '#d7ecff', glow: '215,236,255', n: '1' },
  Q: { k: 1, col: '#ff4fa3', glow: '255,79,163', n: '2' },
  p: { k: 0, col: '#d7ecff', glow: '215,236,255', n: '1' },
  q: { k: 1, col: '#ff4fa3', glow: '255,79,163', n: '2' }
};
function drawGate(c, ch, col, r, t) {
  const o = CH[ch], x = col * TS, y = r * TS, open = G.hold[o.k];
  const gt = (rr, cc) => G.grid[rr] && G.grid[rr][cc];
  const horiz = gt(r, col - 1) === ch || gt(r, col + 1) === ch;
  c.fillStyle = '#1b2447'; c.strokeStyle = open ? 'rgba(' + o.glow + ',.35)' : o.col; c.lineWidth = 1.5;
  if (!horiz) {
    const topEnd = gt(r - 1, col) !== ch, botEnd = gt(r + 1, col) !== ch;
    if (!open) {
      c.globalAlpha = .5 + .15 * Math.sin(t * .2);
      c.drawImage(gateGlow(o.glow, false), x + 4, y); c.globalAlpha = 1;
      scanLines(c, x, y, t, false);
      c.fillStyle = '#1b2447';
    }
    if (topEnd) { c.fillRect(x + 4, y, 24, 6); c.strokeRect(x + 4, y, 24, 6); }
    if (botEnd) { c.fillRect(x + 4, y + TS - 6, 24, 6); c.strokeRect(x + 4, y + TS - 6, 24, 6); }
    if (topEnd || botEnd) {
      c.fillStyle = open ? 'rgba(' + o.glow + ',.5)' : o.col; c.font = 'bold 11px Orbitron, sans-serif'; c.textAlign = 'center';
      c.fillText(o.n, x + 16, topEnd ? y + 18 : y + 14);
    }
  } else {
    const lEnd = gt(r, col - 1) !== ch, rEnd = gt(r, col + 1) !== ch;
    if (!open) {
      c.globalAlpha = .5 + .15 * Math.sin(t * .2);
      c.drawImage(gateGlow(o.glow, true), x, y + 4); c.globalAlpha = 1;
      scanLines(c, x, y, t, true);
      c.fillStyle = '#1b2447';
    }
    if (lEnd) { c.fillRect(x, y + 4, 6, 24); c.strokeRect(x, y + 4, 6, 24); }
    if (rEnd) { c.fillRect(x + TS - 6, y + 4, 6, 24); c.strokeRect(x + TS - 6, y + 4, 6, 24); }
  }
}
function drawPlate(c, ch, col, r, t) {
  const o = CH[ch], x = col * TS, y = r * TS, on = G.down[o.k], hh = on ? 2 : 5;
  c.fillStyle = '#243252'; c.fillRect(x + 3, y + TS - 5, TS - 6, 5);
  c.save(); c.fillStyle = o.col; c.globalAlpha = on ? .3 : .15; c.fillRect(x + 1, y + TS - 8 - hh, TS - 2, hh + 3);
  c.globalAlpha = on ? 1 : .8; c.fillRect(x + 4, y + TS - 5 - hh, TS - 8, hh);
  c.restore();
  c.fillStyle = o.col; c.globalAlpha = .75; c.font = 'bold 10px Orbitron, sans-serif'; c.textAlign = 'center';
  c.fillText(o.n, x + 16, y + TS - 11 - hh + 2); c.globalAlpha = 1;
}

/* alavanca (v) e portões da alavanca (V abre ligada, U abre desligada) */
function drawLever(c, col, r, t) {
  const x = col * TS, y = r * TS, on = G.lever;
  c.fillStyle = '#243252'; c.fillRect(x + 6, y + TS - 7, TS - 12, 7);
  c.save(); c.strokeStyle = '#ffcf40'; c.lineWidth = 4; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x + 16, y + TS - 7); c.lineTo(x + 16 + (on ? 10 : -10), y + 9); c.globalAlpha = .3; c.lineWidth = 9; c.stroke(); c.globalAlpha = 1; c.lineWidth = 4; c.stroke();
  c.fillStyle = on ? '#00ff9d' : '#ff5a5a'; c.beginPath(); c.arc(x + 16 + (on ? 10 : -10), y + 9, 4, 0, 7); c.fill();
  c.restore();
}
function drawLvGate(c, ch, col, r, t) {
  const x = col * TS, y = r * TS, open = ch === 'V' ? G.lever || G.hold[2] : !G.lever || G.hold[3];
  const gt = (rr, cc) => G.grid[rr] && G.grid[rr][cc];
  const horiz = gt(r, col - 1) === ch || gt(r, col + 1) === ch, glow = '255,207,64', colr = '#ffcf40';
  c.fillStyle = '#3a3010'; c.strokeStyle = open ? 'rgba(255,207,64,.35)' : colr; c.lineWidth = 1.5;
  if (!open) {
    c.globalAlpha = .5 + .15 * Math.sin(t * .2);
    if (!horiz) c.drawImage(gateGlow(glow, false), x + 4, y); else c.drawImage(gateGlow(glow, true), x, y + 4);
    c.globalAlpha = 1;
    c.fillStyle = '#3a3010';
  }
  const endA = horiz ? gt(r, col - 1) !== ch : gt(r - 1, col) !== ch, endB = horiz ? gt(r, col + 1) !== ch : gt(r + 1, col) !== ch;
  if (!horiz) {
    if (endA) { c.fillRect(x + 4, y, 24, 6); c.strokeRect(x + 4, y, 24, 6); }
    if (endB) { c.fillRect(x + 4, y + TS - 6, 24, 6); c.strokeRect(x + 4, y + TS - 6, 24, 6); }
    if (endA || endB) { c.fillStyle = open ? 'rgba(255,207,64,.5)' : colr; c.font = 'bold 11px Orbitron, sans-serif'; c.textAlign = 'center'; c.fillText(ch === 'V' ? '+' : '−', x + 16, endA ? y + 18 : y + 14); }
  } else {
    if (endA) { c.fillRect(x, y + 4, 6, 24); c.strokeRect(x, y + 4, 6, 24); }
    if (endB) { c.fillRect(x + TS - 6, y + 4, 6, 24); c.strokeRect(x + TS - 6, y + 4, 6, 24); }
  }
}

/* ---------------- RENDER ---------------- */
function render() {
  const t = frame, c = ctx;
  c.save();
  if (shake > 0) { c.clearRect(0, 0, cv.width, cv.height); c.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake); }
  c.drawImage(G.bg, 0, 0);
  const gt = (r, col) => G.grid[r] && G.grid[r][col];

  for (let r = 0; r < H; r++) for (let col = 0; col < W; col++) {
    const ch = G.grid[r][col], x = col * TS, y = r * TS;
    const hz = HZ[ch];
    if (hz) {
      c.drawImage(hzSprite(ch), x, y - 26);
      for (let i = 0, k = 0; i <= TS; i += 4, k++) waveY[k] = y + 7 + Math.sin((x + i) * 0.3 + t * 0.1) * 2;
      c.fillStyle = hz.body[0]; c.beginPath(); c.moveTo(x, y + 8);
      for (let i = 0, k = 0; i <= TS; i += 4, k++) c.lineTo(x + i, waveY[k]);
      c.lineTo(x + TS, y + 8); c.closePath(); c.fill();
      c.beginPath();
      for (let i = 0, k = 0; i <= TS; i += 4, k++) { if (k) c.lineTo(x + i, waveY[k]); else c.moveTo(x, waveY[0]); }
      c.strokeStyle = `rgba(${hz.glow},.35)`; c.lineWidth = 6; c.stroke();
      c.strokeStyle = hz.line; c.lineWidth = 2; c.stroke();
    } else if (ch === 'D') {
      const topOpen = gt(r - 1, col) !== 'D', botOpen = gt(r + 1, col) !== 'D';
      if (!G.gateOpen) {
        c.globalAlpha = .55 + .15 * Math.sin(t * .2);
        c.drawImage(gateGlow('224,64,251', false), x + 4, y); c.globalAlpha = 1;
        scanLines(c, x, y, t, false);
      }
      c.fillStyle = '#2a2057'; c.strokeStyle = G.gateOpen ? '#6a4fb0' : '#e040fb'; c.lineWidth = 1.5;
      if (topOpen) { c.fillRect(x + 4, y, 24, 6); c.strokeRect(x + 4, y, 24, 6); }
      if (botOpen) { c.fillRect(x + 4, y + TS - 6, 24, 6); c.strokeRect(x + 4, y + TS - 6, 24, 6); }
    } else if (ch === 'B') {
      const hh = G.gateOpen ? 2 : 5;
      c.fillStyle = '#243252'; c.fillRect(x + 3, y + TS - 5, TS - 6, 5);
      c.save(); c.fillStyle = G.gateOpen ? '#00ff9d' : '#ffea00';
      c.globalAlpha = .3; c.fillRect(x + 3, y + TS - 8 - hh, TS - 6, hh + 3);
      c.globalAlpha = 1; c.fillRect(x + 6, y + TS - 5 - hh, TS - 12, hh);
      c.restore();
    } else if (ch === 'P' || ch === 'Q') drawGate(c, ch, col, r, t);
    else if (ch === 'p' || ch === 'q') drawPlate(c, ch, col, r, t);
    else if (ch === 'v') drawLever(c, col, r, t);
    else if (ch === 'V' || ch === 'U') drawLvGate(c, ch, col, r, t);
  }

  G.doors.forEach((d, type) => d && drawDoor(type, d[0], d[1], G.players[type].atDoor, t));

  G.gems.forEach((g, gi) => {
    if (G.collected.has(gi)) return;
    const cx = g.c * TS + 16, cy = g.r * TS + 16 + Math.sin(t * 0.08 + g.c) * 3;
    c.save(); c.translate(cx, cy); c.scale(0.45 + 0.55 * Math.abs(Math.cos(t * 0.05 + g.c)), 1);
    c.drawImage(gemSprite(g.t), -22, -24);
    c.restore();
  });

  G.players.forEach(p => {
    if (mode === 'guest') { p.rx += (p.x - p.rx) * 0.4; p.ry += (p.y - p.ry) * 0.4; }
    else { p.rx = p.x; p.ry = p.y; }
    const cx = p.rx + p.w / 2, fy = p.ry + p.h;
    if (p.alive) drawAura(c, p.type, cx, fy - 14, 36, .3);
    drawChar(c, p.type, cx, fy, { face: p.face, moving: p.vx !== 0, onGround: p.ground, alive: p.alive, t });
  });

  c.save(); c.globalCompositeOperation = 'lighter';
  parts.forEach(p => {
    c.globalAlpha = Math.max(0, p.life / p.max); c.fillStyle = p.color;
    c.beginPath(); c.arc(p.x, p.y, p.size, 0, 7); c.fill();
  });
  c.restore();
  c.restore();

}

/* ---------------- MENU: PRÉVIA ---------------- */
const pv = $('preview').getContext('2d');
function drawPreview() {
  pv.clearRect(0, 0, 360, 150);
  const bob = Math.sin(frame * 0.05) * 2;
  drawAura(pv, 0, 55 * 2.4, 44 * 2.4 + bob * 2.4, 90, .35);
  drawAura(pv, 1, 95 * 2.4, 44 * 2.4 - bob * 2.4, 90, .35);
  const fl = pv.createLinearGradient(0, 0, 360, 0);
  fl.addColorStop(0, 'rgba(0,229,255,0)'); fl.addColorStop(.5, 'rgba(0,229,255,.9)'); fl.addColorStop(1, 'rgba(0,229,255,0)');
  pv.fillStyle = fl; pv.fillRect(0, 140, 360, 2);
  pv.save(); pv.scale(2.4, 2.4);
  drawChar(pv, 0, 55, 58 + bob, { face: 1, t: frame });
  drawChar(pv, 1, 95, 58 - bob, { face: -1, t: frame });
  pv.restore();
}

/* ---------------- LOOP ---------------- */
const STEP = 1000 / 60, gameEl = $('game'), menuEl = $('menu');
let last = performance.now(), acc = 0;
function tick() {
  frame++;
  fx();
  if (mode === 'guest') { sendInput(); return; }
  step(getInputs());
  if (mode === 'host' && frame % 2 === 0 && conn && conn.open && !(conn.dataChannel && conn.dataChannel.bufferedAmount > 32768)) conn.send(snapshot());
}
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(100, now - last); last = now;
  if (!G || !gameEl.classList.contains('active')) {
    acc = 0;
    if (menuEl.classList.contains('active')) { frame++; if (frame % 2 === 0) drawPreview(); }
    return;
  }
  acc += dt;
  let n = 0;
  // no máximo 3 passos por quadro: se o aparelho engasgar, o jogo não tenta "correr atrás" e piora o travamento
  while (acc >= STEP - 2 && n < 3) { acc -= STEP; tick(); n++; }
  if (acc > STEP * 2) acc = 0;
  if (n) { render(); updateUI(); }   // telas de 120/144 Hz não redesenham sem necessidade
}
requestAnimationFrame(loop);

})();
