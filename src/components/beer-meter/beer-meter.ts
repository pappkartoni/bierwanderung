import {html, LitElement, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import BEER_METER_CSS from './beer-meter.css?inline';
import SHARED_CSS from '../../style.css?inline';
import beerTopUrl from '/beertop.png?url';
import beerMiddleUrl from '/beermiddle.png?url';
import beerBottomUrl from '/beerbottom.png?url';

@customElement('beer-meter')
export default class BeerMeterElement extends LitElement {
  static styles = [unsafeCSS(SHARED_CSS), unsafeCSS(BEER_METER_CSS)];

  @property()
  public count: number = 0;

  @property()
  public text: string = '';

  override render() {
    const beerLengths = [];

    for (let i = this.count; i > 0; i--) {
      beerLengths.push(html`<img src=${beerMiddleUrl} />`);
    }
    return html`
      <div class="beer-meter">
        <div class="beer">
          <img src=${beerTopUrl} />
          ${beerLengths}
          <img src=${beerBottomUrl} />
        </div>
        <div class="beer-label">${this.text.substring(0, 7)}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'beer-meter': BeerMeterElement;
  }
}
