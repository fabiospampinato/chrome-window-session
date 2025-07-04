
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

/* EXPORT */

export {isEqual, isSessionSaved, isSessionTemporary};
