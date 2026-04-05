import { THEME_FOOTER_COLORS } from '../constants';
import type { Theme } from '../constants';

type FooterProps = {
  theme: Theme;
};

const Footer = ({ theme }: FooterProps) => {
  const colors = THEME_FOOTER_COLORS[theme];

  return (
    <footer className={`mt-8 w-full max-w-5xl text-center text-sm ${colors.text}`}>
      <p>
        Created by{' '}
        <a
          href="https://javid-mougamadou.pro/"
          className={`${colors.link} underline-offset-2 hover:underline`}
          target="_blank"
          rel="author noreferrer"
          aria-label="Javid Mougamadou - Creator"
        >
          Javid Mougamadou
        </a>{' '}
        on{' '}
        <a
          href="https://javid-space.cloud/"
          className={`${colors.link} underline-offset-2 hover:underline`}
          target="_blank"
          rel="noreferrer"
        >
          Javid Spaces
        </a>
      </p>
      <p className="mt-2">
        UI components by{' '}
        <a
          href="https://daisyui.com/"
          className={`${colors.link} underline-offset-2 hover:underline`}
          target="_blank"
          rel="noreferrer"
        >
          DaisyUI
        </a>
      </p>
    </footer>
  );
};

export default Footer;
