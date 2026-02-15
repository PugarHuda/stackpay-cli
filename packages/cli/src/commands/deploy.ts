import { Command, Flags } from "@oclif/core";
import {
  makeContractDeploy,
  broadcastTransaction,
  PostConditionMode,
} from "@stacks/transactions";
import { StacksTestnet, StacksMainnet } from "@stacks/network";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import ora from "ora";

export default class Deploy extends Command {
  static description =
    "Deploy StackPay escrow smart contract to Stacks blockchain";

  static examples = [
    "$ stackpay deploy",
    "$ stackpay deploy --network testnet",
  ];

  static flags = {
    network: Flags.string({
      char: "n",
      description: "Network to deploy to",
      options: ["testnet", "mainnet"],
      default: "testnet",
    }),
    "contract-name": Flags.string({
      description: "Smart contract name",
      default: "stackpay-escrow",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Deploy);
    const spinner = ora("Preparing contract deployment...").start();

    try {
      // Check for private key
      const privateKey = process.env.STACKS_PRIVATE_KEY;
      if (!privateKey) {
        spinner.fail("Missing STACKS_PRIVATE_KEY environment variable");
        this.log("");
        this.log(chalk.yellow("  Set your Stacks private key:"));
        this.log(
          chalk.cyan("    export STACKS_PRIVATE_KEY=your_private_key_here"),
        );
        this.log("");
        return;
      }

      // Read contract - resolve from monorepo root
      const contractPath = this.findContractPath();
      if (!contractPath) {
        spinner.fail("Contract file not found");
        this.log(
          chalk.red(
            "  Expected escrow.clar in contracts/ directory at project root",
          ),
        );
        return;
      }

      const contractCode = fs.readFileSync(contractPath, "utf-8");
      const network =
        flags.network === "mainnet"
          ? new StacksMainnet()
          : new StacksTestnet();

      spinner.text = "Deploying contract to Stacks...";

      const txOptions = {
        contractName: flags["contract-name"],
        codeBody: contractCode,
        senderKey: privateKey,
        network,
        postConditionMode: PostConditionMode.Deny,
        fee: 10000n, // 0.01 STX fee
      };

      const transaction = await makeContractDeploy(txOptions);
      const result = await broadcastTransaction(transaction, network);

      // broadcastTransaction returns string txId on success,
      // or object with error/reason on rejection
      if (typeof result !== "string") {
        spinner.fail("Contract deployment failed");
        this.log(chalk.red(`  Error: ${JSON.stringify(result)}`));
        return;
      }

      const txId = result;
      spinner.succeed("Contract deployed successfully!");

      this.log("");
      this.log(chalk.bold.green("  Smart Contract Deployed"));
      this.log("");
      this.log(chalk.cyan(`  Transaction ID: ${txId}`));
      this.log(chalk.cyan(`  Network:        ${flags.network}`));
      this.log(chalk.cyan(`  Contract:       ${flags["contract-name"]}`));
      this.log("");

      const explorerBase =
        flags.network === "mainnet"
          ? "https://explorer.hiro.so"
          : "https://explorer.hiro.so";
      const chainParam = flags.network === "testnet" ? "?chain=testnet" : "";
      this.log(
        chalk.dim(`  Explorer: ${explorerBase}/txid/${txId}${chainParam}`),
      );
      this.log("");

      // Update config if exists
      const configPath = path.join(process.cwd(), "stackpay.config.json");
      if (fs.existsSync(configPath)) {
        const config = fs.readJsonSync(configPath);
        config.escrowContract = txId;
        fs.writeJsonSync(configPath, config, { spaces: 2 });
        this.log(
          chalk.dim("  Updated stackpay.config.json with contract reference"),
        );
      }
    } catch (error) {
      spinner.fail("Deployment failed");
      this.error(error as Error);
    }
  }

  /**
   * Search for escrow.clar in common locations
   */
  private findContractPath(): string | null {
    const candidates = [
      // From CWD (if user is in project root)
      path.join(process.cwd(), "contracts", "escrow.clar"),
      // From CLI package dist/commands/ -> monorepo root
      path.resolve(__dirname, "..", "..", "..", "..", "contracts", "escrow.clar"),
      // From CLI package src/commands/ -> monorepo root
      path.resolve(__dirname, "..", "..", "..", "contracts", "escrow.clar"),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    return null;
  }
}
