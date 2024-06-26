import {html, LitElement, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import INFO_PANEL_CSS from './info-panel.css?inline';
import SHARED_CSS from '../../style.css?inline';

@customElement('info-panel')
export default class InfoPanelElement extends LitElement {
  static styles = [unsafeCSS(SHARED_CSS), unsafeCSS(INFO_PANEL_CSS)];

  @property()
  paused: boolean = false;

  @property()
  autoPan: boolean = true;

  @property()
  date: Date = new Date('2024-06-01T05:54:38.000Z');

  @property()
  speed: number = 1;

  override render() {
    return html`
      <div class="info-panel">
        <div class="info-table">
          <div class="row">
            <div class="label">Distance</div>
            <div class="value">~92km</div>
          </div>
          <div class="row">
            <div class="label">Beer</div>
            <div class="value">
              <a
                href="https://raw.githubusercontent.com/pappkartoni/bierwanderung/main/src/assets/beer.json"
                target="_blank"
                rel="noopener noreferrer"
                >Raw Data</a
              >
            </div>
          </div>
          <div class="row">
            <div class="label">Photos</div>
            <div class="value">
              <a
                href="https://photos.app.goo.gl/D2hT4QLcgpHDsRk28"
                target="_blank"
                rel="noopener noreferrer"
                >Link</a
              >
            </div>
          </div>
        </div>
        <div class="time-info">
          <div class="speed">
            <label for="speed">Speed</label>
            <input
              id="speed"
              type="number"
              min="0.01"
              max="10"
              value=${this.speed}
              step="0.01"
              @change=${(e: InputEvent) =>
                (this.speed = Number((e.target as HTMLInputElement).value))}
            />
          </div>
          <div class="date">${this.date.toLocaleString()}</div>
        </div>
        <div class="control-buttons">
          <span
            class="material-symbols-outlined ${!this.autoPan ? 'inactive' : ''}"
            @click=${() => (this.autoPan = !this.autoPan)}
            >open_with</span
          >
          <span class="material-symbols-outlined" @click=${() => (this.paused = !this.paused)}>
            ${this.paused ? 'play_arrow' : 'pause'}
          </span>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'info-panel': InfoPanelElement;
  }
}
