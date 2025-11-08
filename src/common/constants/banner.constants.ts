// ============================================================
// FILE: src/common/constants/banner.constants.ts
// ============================================================
import { AppConfig } from '../../config/index';

export const showBanner = () => {
  const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    white: '\x1b[37m',
  };

  const banner = `
${colors.cyan}╔══════════════════════════════════════════════════════════════════════════════╗${colors.reset}
${colors.cyan}║${colors.reset}                                                                              ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.green}██████╗ ███████╗██████╗ ██████╗ ███████╗██╗   ██╗██████╗ ███████╗██████╗  ${colors.reset}${colors.cyan}  ║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.green}██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗ ${colors.reset}${colors.cyan}  ║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.green}██████╔╝█████╗  ██║  ██║██████╔╝█████╗  ██║   ██║██████╔╝█████╗  ██████╔╝ ${colors.reset}${colors.cyan}  ║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.green}██╔══██╗██╔══╝  ██║  ██║██╔══██╗██╔══╝  ██║   ██║██╔══██╗██╔══╝  ██╔══██╗ ${colors.reset}${colors.cyan}  ║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.green}██████╔╝███████╗██████╔╝██████╔╝███████╗╚██████╔╝██║  ██║███████╗██║  ██║ ${colors.reset}${colors.cyan}  ║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.green}╚═════╝ ╚══════╝╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ${colors.reset}${colors.cyan}  ║${colors.reset}
${colors.cyan}║${colors.reset}                                                       ${colors.cyan}                       ║${colors.reset}
${colors.cyan}║${colors.reset}                                ${colors.bright}${colors.yellow}🚀 Express Server Running 🚀${colors.reset}          ${colors.cyan}        ║${colors.reset}
${colors.cyan}║${colors.reset}                                                                              ${colors.cyan}║${colors.reset}
${colors.cyan}╠══════════════════════════════════════════════════════════════════════════════╣${colors.reset}
${colors.cyan}║${colors.reset}                                                                              ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.blue}📦${colors.reset} Version:    ${AppConfig.version.padEnd(60)} ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.magenta}🌍${colors.reset} Environment: ${AppConfig.env.padEnd(59)} ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.yellow}🚪${colors.reset} Port:       ${String(AppConfig.port).padEnd(60)} ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.cyan}🔗${colors.reset} API:        http://localhost:${String(AppConfig.port).padEnd(43)} ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.blue}📚${colors.reset} Docs:       http://localhost:${String(AppConfig.port)}/api/docs${' '.padEnd(30)} ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset}  ${colors.blue}❤️${colors.reset}  Health:     http://localhost:${String(AppConfig.port)}/api/v1/health${' '.padEnd(25)} ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset}                                                                              ${colors.cyan}║${colors.reset}
${colors.cyan}╚══════════════════════════════════════════════════════════════════════════════╝${colors.reset}
`;

  console.log(banner);
};