/* eslint-disable */

const program = require('commander');

module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  program
    .option('-b, --branch [branch]', 'git branch')
    .parse(process.argv);

  const shipitSyncingSourceFolder = './shipit-syncing-source';
  const deploymentFolder = '/var/www/geronimo/cs';
  const releasesFolder = `${deploymentFolder}/releases`;
  const sshKeyPath = '~/.ssh/id_rsa';
  const gitRepUrl = 'git@git.snpdev.ru:saltpepper/gl-geronimo-html.git';

  const branch = program.branch || 'develop';
  const buildServerPort = 3000;
  const buildServerAppName = 'buildServer';

  const stagingServer = 'geronimo@geronimo-direct.snpdev.ru';
  const productionServer = 'geronimo@52.59.239.13';

  /* init main config */
  shipit.initConfig({
    default: {
      workspace: shipitSyncingSourceFolder,
      deployTo: deploymentFolder,
      repositoryUrl: gitRepUrl,
      branch: branch,
      ignores: ['.git', 'node_modules'],
      keepReleases: 1,
      deleteOnRollback: true,
      key: sshKeyPath,
      shallowClone: false
    },
    staging: {
      servers: stagingServer
    },
    production: {
      servers: productionServer
    }
  });

  shipit.blTask('installPackages', function() {
    return shipit.remote(`cd ${releasesFolder}/${shipit.releaseDirname} && yarn install`);
  });

  shipit.blTask('buildApp', function() {
    return shipit.remote(`cd ${releasesFolder}/${shipit.releaseDirname} && yarn build:static`);
  });

  shipit.blTask('startBuildServer', function() {
    return shipit.remote(`cd ${releasesFolder}/${shipit.releaseDirname}
      PORT=${buildServerPort} pm2 start build-server.js -n ${buildServerAppName} && cd ${releasesFolder} && ls -t | tail -n +2 | xargs rm -rf`);
  });

  shipit.blTask('deleteBuildServer', function() {
    return shipit.remote(`pm2 delete -s ${buildServerAppName} || :`);
  });

  // shipit.blTask('deleteShipitWorkspace', function() {
  //   return shipit.local(`rm -rf ${shipitSyncingSourceFolder}`);
  // });

  shipit.task('postSetup', [
    'installPackages',
    'buildApp',
    'deleteBuildServer',
    'startBuildServer',
  ], function() {
    shipit.remote('echo Post setup finished!');
  });

  shipit.on('updated', function () {
    shipit.start('postSetup');
  });

  // shipit.on('deployed', function() {
  //   shipit.start('deleteShipitWorkspace');
  // });
};
