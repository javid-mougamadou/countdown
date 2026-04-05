import { SunIcon, MoonIcon, MenuIcon, DownloadIcon } from './icons';
import { THEME_ICON_COLORS, THEME_TEXT_COLORS } from '../constants';
import type { Theme } from '../constants';
import { useRef } from 'react';

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

const getThemeToggleLabel = (theme: Theme): string =>
  theme === 'dark' ? 'Enable light mode' : 'Enable dark mode';

const getThemeMenuLabel = (theme: Theme): string =>
  theme === 'dark' ? 'Light mode' : 'Dark mode';

const ThemeIconButton = ({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) => {
  const iconClassName = THEME_ICON_COLORS[theme];
  const isDarkMode = theme === 'dark';

  return (
    <button
      type="button"
      className="btn btn-circle btn-ghost"
      onClick={onToggleTheme}
      aria-label={getThemeToggleLabel(theme)}
    >
      {isDarkMode ? <SunIcon className={iconClassName} /> : <MoonIcon className={iconClassName} />}
    </button>
  );
};

const ThemeMenuButton = ({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) => {
  const iconClassName = THEME_ICON_COLORS[theme];
  const isDarkMode = theme === 'dark';

  return (
    <button type="button" onClick={onToggleTheme} className="flex items-center justify-between">
      <span>{getThemeMenuLabel(theme)}</span>
      {isDarkMode ? (
        <SunIcon className={iconClassName} size="sm" />
      ) : (
        <MoonIcon className={iconClassName} size="sm" />
      )}
    </button>
  );
};

const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  const textColor = THEME_TEXT_COLORS[theme];
  const iconColor = THEME_ICON_COLORS[theme];
  const installDialogRef = useRef<HTMLDialogElement | null>(null);

  const openInstallDialog = () => {
    installDialogRef.current?.showModal();
  };

  return (
    <header className="navbar fixed top-0 z-50 w-full bg-transparent backdrop-blur-sm">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4">
        <div className="flex-none">
          <a href="/" className={`btn btn-ghost text-xl font-bold ${textColor}`}>
            Countdown
          </a>
        </div>

        <div className="hidden flex-none items-center gap-1 md:flex">
          <button
            type="button"
            className="btn btn-circle btn-ghost"
            onClick={openInstallDialog}
            aria-label="Install app"
          >
            <DownloadIcon className={iconColor} />
          </button>
          <ThemeIconButton theme={theme} onToggleTheme={onToggleTheme} />
        </div>

        <div className="dropdown dropdown-end flex-none md:hidden">
          <label tabIndex={0} className={`btn btn-circle btn-ghost ${iconColor}`} aria-label="Menu">
            <MenuIcon />
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg"
          >
            <li>
              <button type="button" onClick={openInstallDialog} className="flex items-center justify-between">
                <span>Install app</span>
                <DownloadIcon className={iconColor} size="sm" />
              </button>
            </li>
            <li>
              <ThemeMenuButton theme={theme} onToggleTheme={onToggleTheme} />
            </li>
          </ul>
        </div>
      </div>

      <dialog ref={installDialogRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Install Countdown</h3>
          <div className="mt-3 space-y-4 text-sm">
            <div>
              <div className="font-semibold">iPhone / iPad (Safari)</div>
              <ol className="mt-1 list-decimal space-y-1 pl-4">
                <li>Open this site in Safari.</li>
                <li>Tap the Share button.</li>
                <li>Select “Add to Home Screen”.</li>
              </ol>
            </div>
            <div>
              <div className="font-semibold">Android (Chrome)</div>
              <ol className="mt-1 list-decimal space-y-1 pl-4">
                <li>Open this site in Chrome.</li>
                <li>Tap the menu (⋮).</li>
                <li>Select “Install app” (or “Add to Home screen”).</li>
              </ol>
            </div>
            <div className="opacity-80">
              Tip: once installed, Countdown runs fullscreen like any installed PWA.
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close" />
        </form>
      </dialog>
    </header>
  );
};

export default Header;
