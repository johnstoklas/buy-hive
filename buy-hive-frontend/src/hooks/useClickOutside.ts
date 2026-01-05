import { useEffect, type Dispatch, type RefObject, type SetStateAction } from "react";

export function useClickOutside(
    targetRef: RefObject<HTMLElement | null>,
    bool: boolean,
    setBool: Dispatch<SetStateAction<boolean>>,
    ignoreRefs: RefObject<HTMLElement | null>[] = []
) {
    useEffect(() => {
        if (!bool) return;

        const handler = (e: PointerEvent) => {
        const target = e.target as Node;
        const path = e.composedPath?.() ?? [];

        const clickedTarget =
            targetRef.current &&
            (targetRef.current.contains(target) || path.includes(targetRef.current));

        const clickedIgnored = ignoreRefs.some(
            (ref) =>
            ref.current &&
            (ref.current.contains(target) || path.includes(ref.current))
        );

        if (!clickedTarget && !clickedIgnored) {
            setBool(!bool);
        }
    };

    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [bool, setBool, targetRef, ignoreRefs]);
}
