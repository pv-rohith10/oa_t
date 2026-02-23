import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Open Agent",
  version: packageJson.version,
  copyright: `© ${currentYear}, Open Agent.`,
  meta: {
    title: "Open Agent — SEC-Compliant Equity Management",
    description:
      "Open Agent is a SEC-compliant equity management platform for transfer agents, issuers, and auditors.",
  },
};
