import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const instructorAtom = atom([]);
export const userAtom = atomWithStorage(null);
export const userEmailAtom = atomWithStorage("");
export const eventAtom = atom([]);
export const clubsListAtom = atom([]);
