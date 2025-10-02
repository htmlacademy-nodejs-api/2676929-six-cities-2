import { CommandParser } from "./commands/command-parser.js";
import { ICommand } from "./commands/command.interface.js";

type CommandCollection = Record<string, ICommand>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(private readonly defaultCommand: string = "--help") {}

  public registerCommands(commandList: ICommand[]): void {
    commandList.forEach((command) => {
      this.commands[command.getName()] = command;
    });
  }

  public getDefaultCommand(): ICommand | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(
        `The default command ${this.defaultCommand} is not registered`
      );
    }

    return this.commands[this.defaultCommand];
  }

  public getCommand(commandName: string): ICommand {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
