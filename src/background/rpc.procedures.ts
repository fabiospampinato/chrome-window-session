
/* IMPORT */

import Session from './session';
import Sessions from './sessions';

/* MAIN */

const Procedures = {

  deleteSession: Session.delete,
  insertSession: Session.insert,
  openSession: Session.open,
  renameSession: Session.rename,

  getState: async (): Promise<State> => {

    const sessions = await Sessions.getSaved ();
    const session = await Sessions.getCurrent ();

    return { sessions, session };

  }

};

/* EXPORT */

export default Procedures;
