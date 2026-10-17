// Animations permises ? Décidé avant le premier rendu, sinon les entrées
// animées clignoteraient. MotionService prend ensuite le relais.
// Fichier à part (et non script dans index.html) : la politique de sécurité
// du site (CSP) n'autorise que les scripts servis par le site lui-même.
(function () {
  var forced = false;
  try {
    forced = localStorage.getItem('lagon-anime') === '1';
  } catch (e) {}
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced || forced) document.documentElement.classList.add('motion-ok');
})();
