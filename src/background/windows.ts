
/* MAIN */

const Windows = {

  get: (): Promise<chrome.windows.Window[]> => {

    return chrome.windows.getAll ({ populate: true });

  }

};

/* EXPORT */

export default Windows;
