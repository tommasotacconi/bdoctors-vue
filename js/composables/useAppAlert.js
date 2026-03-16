import { ref } from "vue";

export function useAppAlert() {
  const alerts = ref([]);
  const alertCount = ref(0);

  async function triggerAlert(msg, minDistanceFromTop = 10, type = undefined, btn = null) {
    let currLastAlertInd;
    const alertsNum = alerts.value.reduce((acc, { show }) => acc + (show ? 1 : 0), 0);
    const firstShownAlert = alerts.value.find(({ show }) => show);

    // Prevent more than three alerts at the same time
    if (alertsNum >= 3) {
      clearTimeout(alerts.value[0].timeO);
      firstShownAlert.show = false;
      currLastAlertInd = alertsNum - 1;
    }

    if (!currLastAlertInd) currLastAlertInd = alertsNum;
    const cls = "top-" + (minDistanceFromTop + currLastAlertInd * 60);
    let alert = { id: ++alertCount.value, msg, type, show: true, cls, timeO: null, btn };
    alerts.value.push(alert);
    alert = alerts.value[alerts.value.length - 1];
    alert.timeO = setTimeout(() => {
      alert.show = false;
    }, 10000);
  }

  function removeFirstAlert(el) {
    const shownAlerts = alerts.value.filter(({ show }) => show);
    shownAlerts.forEach((alert, i, arr) => {
      const pos = parseInt(alert.cls.slice(4));
      if (pos >= 60 && i !== 2) alert.cls = `top-${pos - 60}`;
    });

    if (alerts.value.every(({ show }) => !show)) {
      alerts.value.length = 0;
    }
  }

  return { alerts, alertCount, triggerAlert, removeFirstAlert };
}
