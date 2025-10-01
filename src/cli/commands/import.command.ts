import { TSVFileReader } from "../../shared/libs/file-reader/tsv-file-reader.ts";
import { ICommand } from "./command.interface.ts";

export class ImportCommand implements ICommand {
  public getName(): string {
    return "--import";
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${error.message}`);
    }
  }
}
