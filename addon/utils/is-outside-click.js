export default function isOutsideClick (elem, target) {
  return !target.isSameNode(elem) && !elem.contains(target)
}
