
/* IMPORT */

import RPC from './rpc';
import Badge from './badge';
import Registry from './registry';
import Tabs from './tabs';

/* MAIN */

const init = async (): Promise<void> => {

  RPC.listen ();
  Tabs.listen ();

  await Registry.update ();
  await Badge.updateWindows ();

};

/* INIT */

init ();
