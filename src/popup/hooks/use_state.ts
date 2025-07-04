
/* IMPORt */

import {$, useEffect} from 'voby';
import RPC from '../rpc';
import {isEqual} from '../utils';

/* MAIN */

const useState = (): $<State> => {

  const state = $<State>({
    sessions: [],
    session: undefined
  }, {
    equals: isEqual
  });

  const refresh = async (): Promise<void> => {
    const stateNext = await RPC.getState ();
    state ( stateNext );
  };

  useEffect ( () => {
    refresh ();
    chrome.storage.onChanged.addListener ( refresh );
    chrome.windows.onFocusChanged.addListener ( refresh );
    return () => {
      chrome.storage.onChanged.removeListener ( refresh );
      chrome.windows.onFocusChanged.removeListener ( refresh );
    };
  });

  return state;

};

/* EXPORT */

export default useState;
