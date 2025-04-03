const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: 'http://localhost:9000',
    token: '52b03d58eb492af4662fe6a835469ef20eb982ad',
    options: {
      'sonar.projectName': 'cooptaliteBack',
      'sonar.projectDescription': 'cooptaliteBack',
      'sonar.projectKey': 'cooptaliteBack',
      'sonar.projectVersion': '0.0.1',
      'sonar.exclusions': '',
      'sonar.sourceEncoding': 'UTF-8',
    },
  },
  () => process.exit(),
);
