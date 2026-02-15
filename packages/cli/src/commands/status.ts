import { Command } from "@oclif/core";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import ora from "ora";
import { PaymentHandler } from "@stackpay/sdk";

export default class Status extends Command {
  static description = "Check StackPay project status and payment metrics";

  static examples = ["$ stackpay status"];

  async run(): Promise<void> {
    const configPath = path.join(process.cwd(), "stackpay.config.json");

    if (!fs.existsSync(configPath)) {
      this.error(
        "No stackpay.config.json found.\n" +
          "Run `stackpay init <project-name>` first.",
      );
    }

    const config = fs.readJsonSync(configPath);
    const spinner = ora("Fetching payment metrics...").start();

    try {
      const handler = new PaymentHandler(config.network);

      if (config.paymentAddress) {
        // Fetch balance and recent transactions
        const balance = await handler.getBalance(config.paymentAddress);
        const transactions = await handler.getRecentTransactions(
          config.paymentAddress,
          10,
        );

        const incomingPayments = transactions.filter(
          (tx: {
            tx_type: string;
            token_transfer?: { recipient_address: string };
          }) =>
            tx.tx_type === "token_transfer" &&
            tx.token_transfer?.recipient_address === config.paymentAddress,
        );

        spinner.succeed("Metrics loaded");

        this.log("");
        this.log(chalk.bold("  StackPay Status"));
        this.log("");
        this.log(chalk.white("  Configuration:"));
        this.log(chalk.cyan(`    Project:  ${config.projectName}`));
        this.log(chalk.cyan(`    Price:    ${config.price} ${config.currency}`));
        this.log(chalk.cyan(`    Network:  ${config.network}`));
        this.log(chalk.cyan(`    Address:  ${config.paymentAddress}`));
        this.log("");

        this.log(chalk.white("  Balance:"));
        this.log(chalk.green(`    Available: ${balance.stx.toFixed(6)} STX`));
        this.log(
          chalk.yellow(`    Locked:    ${balance.locked.toFixed(6)} STX`),
        );
        this.log("");

        this.log(chalk.white("  Recent Activity:"));
        this.log(chalk.cyan(`    Total Transactions: ${transactions.length}`));
        this.log(
          chalk.cyan(`    Incoming Payments:  ${incomingPayments.length}`),
        );

        if (incomingPayments.length > 0) {
          const totalRevenue = incomingPayments.reduce(
            (sum: number, tx: { token_transfer?: { amount: string } }) =>
              sum + Number(tx.token_transfer?.amount || 0) / 1_000_000,
            0,
          );
          this.log(
            chalk.green(
              `    Total Revenue:      ${totalRevenue.toFixed(6)} STX`,
            ),
          );
        }
        this.log("");
      } else {
        spinner.warn("No payment address configured");
        this.log("");
        this.log(chalk.bold("  StackPay Status"));
        this.log("");
        this.log(chalk.white("  Configuration:"));
        this.log(chalk.cyan(`    Project:  ${config.projectName}`));
        this.log(chalk.cyan(`    Price:    ${config.price} ${config.currency}`));
        this.log(chalk.cyan(`    Network:  ${config.network}`));
        this.log(chalk.cyan(`    Address:  ${chalk.dim("(not set)")}`));
        this.log("");
        this.log(chalk.yellow("  Set your payment address:"));
        this.log(
          chalk.cyan("    stackpay config --address <YOUR_STX_ADDRESS>"),
        );
        this.log("");
      }
    } catch (error) {
      spinner.fail("Failed to fetch metrics");
      this.error(error as Error);
    }
  }
}
