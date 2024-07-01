if (process.env.REACT_APP_RUN_MODE === 'template') {
  require('./template/index');
} else {
  require('./main/index');
}
