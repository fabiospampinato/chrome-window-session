
/* MAIN */

const castTabGroupColor = ( color: string ): TabGroupColor => {

  return isTabGroupColor ( color ) ? color : 'blue';

};

const getSessionUrls = ( session: Session | SessionTemporary ): string[] => {

  return session.tabs.map ( tab => tab.url );

};

const getWindowTabs = ( window: chrome.windows.Window ): Tab[] => {

  return window.tabs?.map ( tab => {

    const {active, pinned, selected, groupId} = tab;
    const url = tab.url ?? '';

    return {active, pinned, selected, groupId, url};

  }) || [];

};

const getWindowsTabGroups = async ( window: chrome.windows.Window ): Promise<TabGroup[]> => {

  const tabGroupsRaw = await chrome.tabGroups.query ({ windowId: window.id });

  return tabGroupsRaw.map ( group => {

    const {id, color, collapsed} = group;
    const title = group.title ?? '';

    return {id, title, color, collapsed};

  });

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

const isTabGroupColor = (() => {

  const COLORS = new Set ([ 'blue', 'cyan', 'green', 'grey', 'orange', 'pink', 'purple', 'red', 'yellow' ]);

  return ( value: string ): value is TabGroupColor => {

    return COLORS.has ( value );

  };

})();

const isUndefined = ( value: unknown ): value is undefined => {

  return value === undefined;

};

/* EXPORT */

export {castTabGroupColor, getSessionUrls, getWindowTabs, getWindowsTabGroups, getWindowUrls, isNumber, isString, isTabGroupColor, isUndefined};
