
/* MAIN */

const getSessionUrls = ( session: Session | SessionTemporary ): string[] => {

  return session.tabs.map ( tab => tab.url );

};

const getWindowTabs = ( window: chrome.windows.Window ): Tab[] => {

  return window.tabs?.map ( tab => {

    const {active, pinned, selected} = tab;
    const url = tab.url ?? '';

    return {active, pinned, selected, url};

  }) || [];

};

const getWindowUrls = ( window: chrome.windows.Window ): string[] => {

  return window.tabs?.map ( tab => tab.url ).filter ( isString ) ?? [];

};

const isNumber = ( value: unknown ): value is number => {

  return typeof value === 'number';

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const isUndefined = ( value: unknown ): value is undefined => {

  return value === undefined;

};

/* EXPORT */

export {getSessionUrls, getWindowTabs, getWindowUrls, isNumber, isString, isUndefined};
