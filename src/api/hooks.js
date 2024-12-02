class HookManager {
  constructor() {
    if (HookManager.instance) {
      return HookManager.instance;
    }
    this.hooks = new Map(); // stores enabled/disabled state of hooks
    HookManager.instance = this;
  }

  enable(hookName) {
    this.hooks.set(hookName, true);
  }

  disable(hookName) {
    this.hooks.set(hookName, false);
  }

  set(hookName, enabled) {
    this.hooks.set(hookName, enabled);
  }

  process(hooks, data) {
    let adjustedData = data;

    for (const hook of hooks) {
      const [[hookName, hookFn]] = Object.entries(hook);
      
      if (this.hooks.get(hookName) === true) {
        try {
          console.debug('Hook modified response before delivery: ', hookName, { original_data: JSON.parse(JSON.stringify(data)), modified_data: adjustedData })
          adjustedData = { ...adjustedData, ...hookFn(adjustedData)};
        } catch (err) {
          console.warn(`Hook ${hookName} failed:`, err);
        }
      }
    }

    return adjustedData
  }

  clear() {
    this.hooks.clear();
  }
}

export const hookManager = new HookManager();