import { Observable } from 'rxjs'

// A convenience function for combining and mapping observables
export function K<T, R>(o1: Observable<T>, 
                        f: (t: T) => R): Observable<R>;
export function K<T, U, R>(o1: Observable<T>,
                           o2: ((t: T) => R) | Observable<U>, 
                           f: (t: T, u: U) => R): Observable<R>;
export function K<T, U, V, R>(o1: Observable<T>,
                              o2: ((t: T) => R) | Observable<U>,
                              o3: ((t: T, u: U) => R) | Observable<V>,
                              f: (t: T, u: U, v: V) => R): Observable<R>;
export function K<T, U, V, W, R>(o1: Observable<T>,
                                 o2?: ((t: T) => R) | Observable<U>,
                                 o3?: ((t: T, u: U) => R) | Observable<V>,
                                 o4?: ((t: T, u: U, v: V) => R) | Observable<W>,
                                 f?: (t: T, u: U, v: V, w: W) => R): Observable<R> {
  if (typeof o2 === 'function') {
    return o1.map(o2)
  }
  if (typeof o3 === 'function') {
    return Observable.combineLatest(o1, o2).map(([t, u]) => o3(t, u))
  }
  if (typeof o4 === 'function') {
    return Observable.combineLatest(o1, o2, o3).map(([t, u, v]) => o4(t, u, v))
  }
  return Observable.combineLatest(o1, o2, o3, o4).map(([t, u, v, w]) => f(t, u, v, w))
}