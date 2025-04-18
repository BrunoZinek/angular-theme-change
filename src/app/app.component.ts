import { Component } from '@angular/core';
import { MaterialModule } from './core/material/material.module';
import { CommonModule } from '@angular/common';
import {
  argbFromHex,
  themeFromSourceColor,
  hexFromArgb,
} from '@material/material-color-utilities';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'base-theme';
  isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

  themeHex: any = {};
  customThemeColor: any = {};
  customColor = localStorage.getItem('customColor') || '#0020c2';

  constructor() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    }
  }

  ngOnInit() {
    this.changeThemeColor();
  }

  toggleDarkTheme() {
    document.body.classList.toggle('dark-theme');
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
    this.changeThemeColor();
  }

  changeThemeColor() {
    localStorage.setItem('customColor', this.customColor);
    const theme = themeFromSourceColor(argbFromHex(this.customColor), []);

    this.themeHex.ligth = this.getLightDarkThemeColor(
      theme.schemes.light.toJSON()
    );
    this.themeHex.dark = this.getLightDarkThemeColor(
      theme.schemes.dark.toJSON()
    );
    const activeTheme = this.isDarkTheme
      ? this.themeHex.dark
      : this.themeHex.ligth;

    // Set CSS variables dynamically
    Object.entries(activeTheme).forEach(([key, value]) => {
      const cssVariable = `--mat-sys-${key
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()}`;
      document.body.style.setProperty(cssVariable, value as string);
    });
  }

  getLightDarkThemeColor(scheme: Record<string, number>) {
    let colorsHex: Record<string, string> = {};
    for (const [key, value] of Object.entries(scheme)) {
      colorsHex[key] = hexFromArgb(value);
    }
    return colorsHex;
  }
}
