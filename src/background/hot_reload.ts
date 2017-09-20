
/* IMPORT */

import * as pify from 'pify';

/* HELPERS */

async function filesInDirectory ( directory: DirectoryEntry ) {

  const reader = directory.createReader (),
        entries = await pify ( reader.readEntries.bind ( reader ) )(),
        entriesFiltered = entries.filter ( entry => entry.name[0] !== '.' ),
        filesPromises = entriesFiltered.map ( entry => entry.isDirectory ? filesInDirectory ( entry ) : entry.file () ),
        files = await Promise.all<any> ( filesPromises );

  return files;

}

async function timestampForFilesInDirectory  ( directory: DirectoryEntry ) {

  const files = await filesInDirectory ( directory );

  return files.map ( file => file.name + file.lastModifiedDate ).join ();

}

function reload () {

  chrome.tabs.query ( { active: true, currentWindow: true }, tabs => {

    if ( tabs.length ) {

      chrome.tabs.reload ( tabs[0].id as number );

    }

    chrome.runtime.reload ();

  });

}

async function watchChanges ( directory: DirectoryEntry, lastTimestamp?: string ) {

  const timestamp = await timestampForFilesInDirectory ( directory );

  if ( !lastTimestamp || ( lastTimestamp === timestamp ) ) {

    const retry = () => watchChanges ( directory, timestamp );

    setTimeout ( retry, 750 );

  } else {

    reload ();

  }

}

/* WATCH */

chrome.management.getSelf ( self => {

  if ( self.installType !== 'development' ) return;

  chrome.runtime.getPackageDirectoryEntry ( watchChanges );

});
