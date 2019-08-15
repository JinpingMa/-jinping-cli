import arg from 'arg'
import inquirer from 'inquirer'
import { createProject } from  './main'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--all': Boolean,
      '-a': '--all'
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    lintFileArr: args._[0],
    runInstallAll: args['--all'] || false
  }
}

async function promptForMissingOptions(options) {
  const defaultLintFileArr = [];
  if(options.runInstallAll) {
    return {
      ...options,
      lintFileArr: ['eslint', 'stylelint']
    };
  }

  const questions = [];
  if (!options.lintFileArr) {
    questions.push({
      type: 'checkbox',
      name: 'lintFileArr',
      message: 'Please choose which lint to use',
      choices: ['eslint', 'stylelint'],
      default: defaultLintFileArr
    })
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    lintFileArr: options.lintFileArr || answers.lintFileArr
  }

}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
