const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
// const generateHTML = require('generateHTML');
const axios = require('axios');
const generateHTML = require('./generateHTML.js');
const writeFileAsync = util.promisify(fs.writeFile);
const htmlPDF = require ('html-pdf')
const options = { format: 'Letter' };

function inquirerAsk() {
    return inquirer
        .prompt([
            {
                message: "Enter your GitHub username:",
                name: "username"
            },
            {
                message: "Pick a favorite color:",
                type: "list",
                name: "color",
                choices: [
                    "green",
                    "blue",
                    "pink",
                    "red"
                ]
            },
            {
                message: "Enter your name:",
                name: "name"
            }
        ]);
}

async function init() {
    const inquirerData = await inquirerAsk();
    console.log(inquirerData);

    const githubUrl = `https://api.github.com/users/${inquirerData.username}`;
    const githubStarUrl = `https://api.github.com/users/${inquirerData.username}/starred`;

    const githubApiData = await axios.get(githubUrl);
    const githubStarApiData = await axios.get(githubStarUrl);
    const data = Object.assign(githubApiData.data, inquirerData);


    const htmlToWrite = generateHTML(data);
    console.log(htmlToWrite);

    htmlPDF.create(htmlToWrite, options).toFile(`./pdf/${data.username}.pdf`, function(err, res){
        if(err){
          console.log(err)
        }
        console.log(`Successfully wrote PDF`);
      })
}

init();
