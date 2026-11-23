/**
 * Estado da rolagem compartilhado com a cena 3D.
 * É um objeto mutável (não é estado do React) de propósito: a cena lê a cada quadro
 * sem provocar re-renderização.
 */
export const scrollState = {
  /** 0 no topo da página, 1 no fim */
  progress: 0,
  /** 0 com a Home inteira na tela, 1 depois de rolar uma tela inteira */
  heroProgress: 0,
}
