
/* IMPORt */

import type Procedures from '../background/rpc.procedures';
import frontend from 'chrome-rpc/frontend';

/* MAIN */

const RPC = frontend<typeof Procedures>();

/* EXPORT */

export default RPC;
