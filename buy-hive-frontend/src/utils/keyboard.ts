import type { KeyboardEvent } from "react";

export function onEnter<T extends HTMLElement>(e: KeyboardEvent<T>, callback: () => void) {
  if (e.key === "Enter") {
    callback();
  }
}