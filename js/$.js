// map, $filter, $reduce

export function map(array, func) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    newArray.push(func(array[i]));
  }
  return newArray;
}

export function filter(array, func) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (func(array[i])) newArray[newArray.length] = array[i];
  }
  return newArray;
}

export function reduce(array, start, func) {
  let acc = start;
  for (let i = 0; i < array.length; i++) {
    acc = func(acc, array[i]);
  }
  return acc;
}
