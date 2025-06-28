
/* MAIN */

const isEqual = <T> ( a: T, b: T ): boolean => {

  return JSON.stringify ( a ) === JSON.stringify ( b );

};

const isSessionSaved = ( session: Session | SessionTemporary ): session is Session => {

  return !!session.id;

};

const isSessionTemporary = ( session: Session | SessionTemporary ): session is SessionTemporary => {

  return !session.id;

};

const isTruthy = <T> ( value: T ): value is Exclude<T, 0 | -0 | 0n | -0n | '' | false | null | undefined | void> => {

  return !!value;

};

/* EXPORT */

export {isEqual, isSessionSaved, isSessionTemporary, isTruthy};
