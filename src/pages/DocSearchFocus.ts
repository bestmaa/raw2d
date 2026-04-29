export function shouldRestoreSearchFocus(sidebar: HTMLElement): boolean {
  const activeElement = document.activeElement;
  return activeElement instanceof HTMLInputElement && sidebar.contains(activeElement) && activeElement.closest(".doc-search") !== null;
}

export function restoreSidebarSearchFocus(sidebar: HTMLElement, shouldRestore: boolean, searchTerm: string): void {
  if (!shouldRestore) {
    return;
  }

  const input = sidebar.querySelector<HTMLInputElement>(".doc-search input");
  input?.focus();
  input?.setSelectionRange(searchTerm.length, searchTerm.length);
}
