import { StudioApp } from "./StudioApp";
import "./properties.css";
import "./style.css";

const root = document.querySelector<HTMLElement>("#studio-root");

if (!root) {
  throw new Error("Studio root element not found.");
}

const app = new StudioApp({ root });

app.mount();
