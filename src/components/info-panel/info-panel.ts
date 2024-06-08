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
                >Raw Data</a
              >
            </div>
          </div>
          <div class="row">
            <div class="label">Photos</div>
            <div class="value"><a href="google.com">Link</a></div>
          </div>
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
