#! /usr/bin/env node

const {Command} = require('commander')
const {name, version} = require('../package.json')
const {promisify} = require('util')
const figlet = promisify(require('figlet'))
const chalk = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora')
const spinner = ora('try to get the registry ...')
const process = require('child_process') // node 环境下的子进程
// import chalk from 'chalk'
const program = new Command()
const gitClone = (type, name) => {
  let url
  if (type === 'headline-news') {
    url = 'https://github.com/xizhutao/Healine_News.git '
  } else if (type === 'geek-h5') {
    url = 'git@github.com:xizhutao/geek-h5.git '
  }
  spinner.start()
  process.exec('git clone ' + url + name, (error, stdout, stderr) => {
    if (error !== null) {
      spinner.fail('exec error: ' + error)
      console.log(stdout)
      return
    }
    console.log(stdout)
    process.exec(
      `cd ${name} && rm -rf .git && git init && git add . && git commit -m "init with create-cli"`,
      (error, stdout, stderr) => {
        if (error !== null) {
          spinner.fail('exec error: ' + error)
          console.log(stdout)
          return
        }
        console.log(stdout)
        spinner.succeed('download successfully!!!')
      }
    )
  })
}
program
  .version(require('../package.json').version)
  .command('create <project-name>')
  .description('create a new project')
  .alias('c')
  .action(async (name) => {
    console.log(
      '\r\n' +
        chalk.yellow(
          figlet.textSync('jsonxi-cli', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
          })
        ) +
        '\r\n'
    )
    // console.log(`\r\nRun ${chalk.cyan(`jsonxi-cli <command> --help`)} for detailed usage of given command\r\n`)
    const {type} = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'which do you want',
        choices: ['geek-h5', 'headline-news'],
        filter: function (val) {
          return val.toLowerCase()
        }
      }
    ])
    gitClone(type, name)
  })

program.parse()
