

/** @example findLastIndex([1,2,6,7], (n) => n % 2 == 1); //3 */
function findLastIndex(iterable, predicate) {
  if (iterable === undefined || iterable === null) {
    throw new TypeError()
  }
  var index = iterable.length
  while (index--) {
    if (predicate(iterable[index])) {
      return index
    }
  }
  return -1
}

/** @example findLastValue([1,2,6,7], (n) => n % 2 == 1) = 6 */
function findLastValue(iterable = new Array(0), predicate) {
  var index = iterable.length
  while (index--) {
    if (predicate(iterable[index])) {
      return iterable[index]
    }
  }
  return undefined
}


const partial = (func, ...boundArgs) => (...remainingArgs) => func(...boundArgs, ...remainingArgs);

const remove = (arr, value) => arr.filter((ele) =>ele != value);