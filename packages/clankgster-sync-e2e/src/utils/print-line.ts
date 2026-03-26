import chalk from 'chalk';

/** Prefixes e2e log lines with a colored bullet so failures, info, and success scan quickly in the terminal. */
export const printLine = {
  /** Formats a failure line (red ✖) with optional status segment. */
  error(message: string, status = ''): string {
    const statusSegment = status.length > 0 ? ` ${chalk.red(status)}` : '';
    return `${chalk.red(' ✖')} ${message}${statusSegment}`;
  },
  /** Formats a failure line with a separately-styled path/link segment. */
  errorWithLink(message: string, link: string, status = ''): string {
    return `${this.error(message, status)} ${chalk.cyan(link)}`;
  },
  /** Formats a neutral info line (cyan •) with optional status segment. */
  info(message: string, status = ''): string {
    const statusSegment = status.length > 0 ? ` ${chalk.cyan(status)}` : '';
    return `${chalk.cyan('•')} ${message}${statusSegment}`;
  },
  /** Formats an info line with a separately-styled path/link segment. */
  infoWithLink(message: string, link: string, status = ''): string {
    return `${this.info(message, status)} ${chalk.cyan(link)}`;
  },
  /** Formats a success line (green ✓) with optional status segment. */
  success(message: string, status = ''): string {
    const statusSegment = status.length > 0 ? ` ${chalk.green(status)}` : '';
    return `${chalk.green(' ✓')} ${message}${statusSegment}`;
  },
  /** Formats a success line with a separately-styled path/link segment. */
  successWithLink(message: string, link: string, status = ''): string {
    return `${this.success(message, status)} ${chalk.cyan(link)}`;
  },
};
