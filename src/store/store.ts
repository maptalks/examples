import { getExampleByKey, getHtmlCodeTitle } from "@/utils";

import { makeAutoObservable } from "mobx";

export class Store {
  constructor() {
    makeAutoObservable(this);
  }

  language: Language | null = null;
  tab = "basic";
  filter = "";
  openKeys = ["basic"];
  selectedKey = "";
  code = "";
  description = "";

  get example() {
    if (!this.selectedKey) {
      return null;
    }
    const example = getExampleByKey(this.selectedKey);
    return example;
  }

  get title() {
    const title = getHtmlCodeTitle(this.selectedKey, this.language);
    return title;
  }

  setLanguage(language: Language) {
    this.language = language;
  }

  setTab(tab: string) {
    this.tab = tab;
  }

  setFilter(filter: string) {
    this.filter = filter;
  }

  setOpenKey(key: string) {
    const index = this.openKeys.indexOf(key);
    if (index > -1) {
      this.openKeys.splice(index, 1);
    } else {
      this.openKeys.push(key);
    }
  }

  setOpenKeys(keys: string[]) {
    this.openKeys = keys;
  }

  setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  setCode(code: string) {
    this.code = code;
  }

  setDescription(des: string) {
    this.description = des;
  }

  init() {
    this.language = null;
    this.tab = "basic";
    this.filter = "";
    this.selectedKey = "";
    this.code = "";
    this.description = "";
  }
}
