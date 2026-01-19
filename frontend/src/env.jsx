
const environment = () => {
    const deployment = false; //false if you want to run locally
    var linktobackend = "http://localhost:3000";
    var linktows = `ws://localhost:3000/subscriptions`
    if (deployment) {
      linktobackend = "https://backend-harjotus-sosi.fly.dev/";
      linktows = `wss://backend-harjotus-sosi.fly.dev/subscriptions`
    }
    const env = {linktobackend:linktobackend,linktows:linktows,deployment:deployment}
    return env
}
export default environment