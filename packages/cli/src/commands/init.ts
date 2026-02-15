import { Command, Flags, Args } from "@oclif/core";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import ora from "ora";
import Handlebars from "handlebars";

export default class Init extends Command {
  static description = "Initialize a new StackPay API project";

  static examples = [
    "$ stackpay init my-api",
    "$ stackpay init my-api --template fastify",
    "$ stackpay init my-api --template express",
  ];

  static flags = {
    template: Flags.string({
      char: "t",
      description: "Template to use",
      options: ["express", "fastify"],
      default: "express",
    }),
  };

  static args = {
    "project-name": Args.string({
      required: true,
      description: "Name of your API project",
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Init);
    const projectName = args["project-name"];
    const spinner = ora("Creating StackPay project...").start();

    try {
      // Create project directory
      const projectPath = path.join(process.cwd(), projectName);

      if (fs.existsSync(projectPath)) {
        spinner.fail(`Directory ${projectName} already exists`);
        return;
      }

      fs.mkdirSync(projectPath, { recursive: true });

      // Generate from template
      await this.generateFromTemplate(projectPath, flags.template, projectName);

      spinner.succeed("Project created successfully!");

      this.log("");
      this.log(chalk.bold.green("  ✅ StackPay project created!"));
      this.log("");
      this.log(chalk.white("  Next steps:"));
      this.log("");
      this.log(chalk.cyan(`    cd ${projectName}`));
      this.log(chalk.cyan("    npm install"));
      this.log(
        chalk.cyan(
          "    stackpay config --price 0.01 --currency STX --address <YOUR_STX_ADDRESS>",
        ),
      );
      this.log(chalk.cyan("    npm start"));
      this.log("");
      this.log(chalk.dim("  Documentation: https://docs.x402stacks.xyz/"));
      this.log("");
    } catch (error) {
      spinner.fail("Failed to create project");
      this.error(error as Error);
    }
  }

  async generateFromTemplate(
    projectPath: string,
    template: string,
    projectName: string,
  ): Promise<void> {
    const templatesDir = path.join(__dirname, "../../templates", template);

    if (!fs.existsSync(templatesDir)) {
      throw new Error(`Template "${template}" not found`);
    }

    const context = {
      projectName,
      timestamp: new Date().toISOString(),
    };

    // Define template files mapping
    const templateFiles: Record<string, string> = {
      "index.js": "index.js.hbs",
      "package.json": "package.json.hbs",
      "stackpay.config.json": "stackpay.config.json.hbs",
      "middleware/x402-handler.js": "middleware/x402-handler.js.hbs",
      ".env.example": ".env.example.hbs",
      "README.md": "README.md.hbs",
    };

    // Process each template file
    for (const [outputFile, templateFile] of Object.entries(templateFiles)) {
      const templatePath = path.join(templatesDir, templateFile);

      if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, "utf-8");
        const compiled = Handlebars.compile(templateContent);
        const outputPath = path.join(projectPath, outputFile);

        // Create directory if needed
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, compiled(context));
      }
    }

    // Create .gitignore
    const gitignoreContent = `node_modules/
.env
dist/
*.log
.DS_Store
`;
    fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);
  }
}
