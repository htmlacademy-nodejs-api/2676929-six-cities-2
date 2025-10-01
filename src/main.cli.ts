#!/usr/bin/env node

import { CLIApplication } from "./cli/cli-application.ts";
import { HelpCommand } from "./cli/commands/help.command.ts";
import { ImportCommand } from "./cli/commands/import.command.ts";
import { VersionCommand } from "./cli/commands/version.command.ts";

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
