import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import { promisify } from 'util'
import Listr from 'listr'
import { install } from 'pkg-install'

const access = promisify(fs.access)
const copy = promisify(ncp)

export async function createProject (options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  }
  const lintGitRepository = {
    stylelint: {
      name: 'stylelint-config-ping',
      git: 'git+https://github.com/JinpingMa/style-guide.git#stylelint'
    },
    eslint: {
      name: 'eslint-config-ping',
      git: 'git+https://github.com/JinpingMa/style-guide.git#eslint'
    }
  }

  const installPkgArr = {}
  options.lintFileArr.forEach(item => {
    const lintFileObj = lintGitRepository[item]
    if (lintFileObj) {
      installPkgArr[lintFileObj['name']] = lintFileObj['git']
    }
  })

  const tasks = new Listr([
    {
      title: 'Install dependencies',
      task: () => install(installPkgArr)
    }
  ])

  await tasks.run()

  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true

}
