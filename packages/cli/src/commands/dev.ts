import { Command, Flags } from "@oclif/core";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import ora from "ora";
import { spawn } from "child_process";

export default class Dev extends Command {
  static description = "Start local development server with payment middleware";

  static examples = ["$ stackpay dev", "$ stackpay dev --port 3001"];

  static flags = {
    port: Flags.integer({
      char: "p",
      description: "Port to run on",
      default: 3000,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Dev);
    const configPath = path.join(process.cwd(), "stackpay.config.json");

    if (!fs.existsSync(configPath)) {
      this.error(
        "No stackpay.config.json found.\n" +
          "Run `stackpay init <project-name>` first.",
      );
    }

    const config = fs.readJsonSync(configPath);
    const spinner = ora("Starting development server...").start();

    // Check if index.js exists
    const entryFile = path.join(process.cwd(), "index.js");
    if (!fs.existsSync(entryFile)) {
      spinner.fail("No index.js found in current directory");
      return;
    }

    spinner.succeed("Development server starting...");
    this.log("");
    this.log(chalk.bold("  🚀 StackPay Development Server"));
    this.log("");
    this.log(chalk.cyan(`  Local:    http://localhost:${flags.port}`));
    this.log(
      chalk.cyan(`  Price:    ${config.price} ${config.currency} per call`),
    );
    this.log(chalk.cyan(`  Network:  ${config.network}`));
    if (config.paymentAddress) {
      this.log(chalk.cyan(`  Address:  ${config.paymentAddress}`));
    }
    this.log("");
    this.log(chalk.dim("  Press Ctrl+C to stop"));
    this.log("");

    // Start the node process
    const child = spawn("node", ["index.js"], {
      cwd: process.cwd(),
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: String(flags.port),
        STACKPAY_NETWORK: config.network,
        STACKPAY_PRICE: String(config.price),
        STACKPAY_CURRENCY: config.currency,
        STACKPAY_ADDRESS: config.paymentAddress || "",
      },
    });

    child.on("error", (error) => {
      this.error(`Failed to start server: ${error.message}`);
    });

    child.on("close", (code) => {
      if (code !== 0 && code !== null) {
        this.log(chalk.red(`\n  Server exited with code ${code}`));
      }
    });

    // Handle graceful shutdown
    const shutdown = () => {
      this.log(chalk.dim("\n  Shutting down..."));
      child.kill("SIGTERM");
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }
}
