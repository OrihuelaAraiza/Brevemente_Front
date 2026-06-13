/**
 * Legacy no-op. El skin doodle (asteriscos y squiggles flotantes) no aplica
 * para el vertical paliativos. Se mantiene como componente vacío para no
 * romper imports en Register / Forgot / Reset, hasta migrarlos a un layout
 * minimal.
 */
export default function DoodleScatter() {
  return null;
}
