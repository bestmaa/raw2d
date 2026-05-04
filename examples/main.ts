const statusElement = document.querySelector<HTMLElement>("#raw2d-copy-status");
const copyButtons = document.querySelectorAll<HTMLButtonElement>("[data-copy-command]");

if (!statusElement) {
  throw new Error("Examples copy status element not found.");
}

for (const button of copyButtons) {
  button.addEventListener("click", () => {
    void copyCommand(button.dataset.copyCommand ?? "");
  });
}

async function copyCommand(command: string): Promise<void> {
  if (command.length === 0) {
    setStatus("copy: missing command");
    return;
  }

  if (!navigator.clipboard) {
    setStatus(command);
    return;
  }

  try {
    await navigator.clipboard.writeText(command);
    setStatus(`copied: ${command}`);
  } catch {
    setStatus(command);
  }
}

function setStatus(message: string): void {
  statusElement.replaceChildren(message);
}
