import test from 'tape'
import { rowToProp, rowsToProps } from '../../js/reducers/'

test(
  `rowToProp takes an object and returns a new object with the desired key from the
  original object associated with the entire original object`, (t) => {

  t.deepEqual(rowToProp('x', {x: 'a', y: 'b'}), {a: {x: 'a', y: 'b'}})
  t.end()
})

test(
  `rowsToProps is a reducer function that performs rowToProp on an item and merges
  accumulates the result into the accumulator`, (t) => {

  t.deepEqual(rowsToProps('x', {}, {x: 'a', y: 'b'}), {a: {x: 'a', y: 'b'}})
  t.end()
})