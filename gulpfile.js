'use strict';

const gulp = require('gulp');
const browser_sync = require('browser-sync').create();

function startDevelopment() {
  browser_sync.init({
    server: "./"
  });

  const _onChangeFiles = (done) => {
    browser_sync.reload();
    done();
  }
  _onChangeFiles.displayName = 'Browser reload';

  gulp.watch([
      './**/*.*',
    ],
    {},
    _onChangeFiles
  );
}

startDevelopment.displayName = 'Start development';

gulp.task(startDevelopment);
