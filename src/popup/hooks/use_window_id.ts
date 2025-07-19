
/* IMPORT */

import {$, useEffect} from 'voby';

/* MAIN */

const useWindowId = (): $<number> => {

  const windowId = $(-1);

  const refresh = async (): Promise<void> => {
    const window = await chrome.windows.getCurrent ();
    windowId ( window.id ?? -1 );
  };

  useEffect ( () => {
    refresh ();
  });

  return windowId;

};

/* EXPORT */

export default useWindowId;
