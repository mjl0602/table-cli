import { createInterface } from "readline";


export const getUserInput = question =>
  new Promise(resolve => {
    const terminal = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    terminal.question(question, answer => {
      terminal.close();
      resolve(answer.trim());
    });
  });