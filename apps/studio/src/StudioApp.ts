import type { StudioAppOptions } from "./StudioApp.type";

export class StudioApp {
  private readonly root: HTMLElement;

  public constructor(options: StudioAppOptions) {
    this.root = options.root;
  }

  public mount(): void {
    this.root.innerHTML = `
      <section class="studio-shell" aria-label="Raw2D Studio">
        <header class="studio-topbar">
          <div>
            <p class="studio-kicker">Raw2D Studio</p>
            <h1>Visual editor shell</h1>
          </div>
          <span class="studio-status">MVP planning</span>
        </header>
        <div class="studio-grid">
          <aside class="studio-panel" aria-label="Tools">
            <h2>Tools</h2>
            <button type="button">Select</button>
            <button type="button">Rect</button>
            <button type="button">Circle</button>
          </aside>
          <section class="studio-workspace" aria-label="Canvas workspace">
            <div class="studio-canvas-placeholder">Canvas workspace</div>
          </section>
          <aside class="studio-panel" aria-label="Properties">
            <h2>Properties</h2>
            <p>No object selected.</p>
          </aside>
        </div>
      </section>
    `;
  }
}
