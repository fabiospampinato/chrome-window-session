
/* IMPORT */

import backend from 'chrome-rpc/backend';
import Procedures from './rpc.procedures';

/* MAIN */

const RPC = {

  listen: (): void => {

    backend ({
      procedures: Procedures
    });

  }

};

/* EXPORT */

export default RPC;
