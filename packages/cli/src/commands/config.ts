import { Command, Flags } from "@oclif/core";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";

export default class Config extends Command {
  static description = "Configure StackPay project settings";

  static examples = [
    "$ stackpay config --price 0.01 --currency STX",
    "$ stackpay config --address SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "$ stackpay config --network testnet",
  ];

  static flags = {
    price: Flags.string({
      char: "p",
      description: "Price per API call (in STX/sBTC/USDCx)",
    }),
    currency: Flags.string({
      char: "c",
      description: "Currency (STX, sBTC, USDCx)",
      options: ["STX", "sBTC", "USDCx"],
    }),
    address: Flags.string({
      char: "a",
      description: "Payment recipient Stacks address",
    }),
    network: Flags.string({
      char: "n",
      description: "Network (testnet/mainnet)",
      options: ["testnet", "mainnet"],
    }),
    show: Flags.boolean({
      char: "s",
      description: "Show current configuration",
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Config);
    const configPath = path.join(process.cwd(), "stackpay.config.json");

    if (!fs.existsSync(configPath)) {
      this.error(
        "No stackpay.config.json found in current directory.\n" +
          "Run `stackpay init <project-name>` first to create a project.",
      );
    }

    const config = fs.readJsonSync(configPath);

    // If --show flag, just display current config
    if (flags.show) {
      this.log("");
      this.log(chalk.bold("  Current StackPay Configuration:"));
      this.log("");
      this.log(chalk.cyan(`  Project:  ${config.projectName}`));
      this.log(chalk.cyan(`  Price:    ${config.price} ${config.currency}`));
      this.log(chalk.cyan(`  Network:  ${config.network}`));
      this.log(
        chalk.cyan(
          `  Address:  ${config.paymentAddress || chalk.dim("(not set)")}`,
        ),
      );
      this.log(
        chalk.cyan(
          `  Escrow:   ${config.escrowContract || chalk.dim("(not set)")}`,
        ),
      );
      this.log("");
      return;
    }

    // Update configuration
    let updated = false;

    if (flags.price) {
      const price = parseFloat(flags.price);
      if (isNaN(price) || price <= 0) {
        this.error("Invalid price value. Must be a positive number (e.g., 0.01)");
      }
      config.price = price;
      updated = true;
    }
    if (flags.currency) {
      config.currency = flags.currency;
      updated = true;
    }
    if (flags.address) {
      config.paymentAddress = flags.address;
      updated = true;
    }
    if (flags.network) {
      config.network = flags.network;
      updated = true;
    }

    if (!updated) {
      this.log(
        chalk.yellow(
          "No configuration flags provided. Use --help to see options.",
        ),
      );
      return;
    }

    fs.writeJsonSync(configPath, config, { spaces: 2 });

    this.log("");
    this.log(chalk.bold.green("  ✅ Configuration updated!"));
    this.log("");
    this.log(chalk.cyan(`  Price:    ${config.price} ${config.currency}`));
    this.log(chalk.cyan(`  Network:  ${config.network}`));
    if (config.paymentAddress) {
      this.log(chalk.cyan(`  Address:  ${config.paymentAddress}`));
    }
    this.log("");
  }
}
