// Only diagnostic builds alias EmailJS to this deterministic local stub.
export const emailTest = {
  outcome: 'error', calls: [],
  reset() { this.calls = []; this.outcome = 'error'; },
};
async function send(...args) {
  emailTest.calls.push(args);
  if (emailTest.outcome === 'error') throw { status: 500, text: 'Local test failure' };
  return { status: 200, text: 'Local test success' };
}
if (typeof window !== 'undefined') window.__EMAILJS_TEST__ = emailTest;
export default { send };
