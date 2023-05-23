export function useDialog(message: string, title: string = "Confirm", actionText = "Ok") {

  let resolvePromise: ((value: unknown) => void);
  // let rejectPromise: ((value: unknown) => void);
  const open = () => {
    return new Promise((resolve/*, reject*/) => {
      resolvePromise = resolve;
      // rejectPromise = reject;
    })
  }

  const confirm = () => {
    resolvePromise(true);
  }

  const close = () => {
    resolvePromise(false);
  }



  return {
    open,
    confirm,
    close,
  }
}
