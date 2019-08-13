import arg from 'arg'
import inquirer from 'inquirer'
import { createProject } from  './main'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install'
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false
  }
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'eslint';
  if(options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  }

  // const prompt = new MultiSelect({
  //   name: 'alphabet',
  //   message: 'Favorite color?',
  //   choices: ['Blue', 'Green', 'Orange', 'Red', 'Violet'],
  //   maxSelected: 3,
  //   format() {
  //     let n = this.maxSelected - this.selected.length;
  //     let s = (n === 0 || n > 1) ? 's' : '';
  //     return `You may select ${n} more choice${s}`;
  //   }
  // });
  // let answers = {
  //   template: '',
  //   git: ''
  // }
  //
  // prompt.run()
  //   .then(answer => { answers = answer; console.log('Answer:', answer)})
  //   .catch(console.error);


  const questions = [];
  if (!options.template) {
    questions.push({
      type: 'checkbox',
      name: 'template',
      message: 'Please choose which lint to use',
      choices: ['eslint', 'stylelint'],
      default: defaultTemplate
    })
  }

  // if (!options.git) {
  //   questions.push({
  //     type: 'confirm',
  //     name: 'git',
  //     message: 'Initialize a git repository?',
  //     default: false
  //   })
  // }

  const answers = await inquirer.prompt(questions);
  console.log(answers, 'answers');
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git
  }

}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  // await createProject(options);
}
