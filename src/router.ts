import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard/Dashboard.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:companyId',
      name: 'home',
      component: Dashboard,
      meta: {
        title: "All Bridges",
      }
    },
    // {
    //   path: '/add-sensor',
    //   name: 'addSensor',
    //   component: () => import('./views/AddSensor/AddSensor.vue'),
    // },
    /*{
      path: '/add-bridge',
      name: 'addBridge',
      component: () => import('./views/AddBridge/AddBridge.vue'),
    },*/
    {
      path: '/view-bridge-data/:bridgeName',
      name: 'viewBridgeData',
      component: () => import('./views/ViewBridgeData/ViewBridgeData.vue'),
      meta: {
        title: "Variable Mart",
      }
    },
    {
      path: '/bridge/view-bridge',
      name: 'viewBridge',
      component: () => import('./views/ViewBridge/ViewBridge.vue'),
    },
    {
      path: "/bridge/spectrum-analysis",
      name: "spectrumAnalysis",
      component: () => import('./views/SpectrumAnalysis/SpectrumAnalysis.vue'),
      meta: {
        title: "Spectrum Analysis",
      }
    },
    {
      path: "/bridge/settings",
      name: "settings",
      component: () => import("./views/Settings/Settings.vue"),
      meta: {
        title: "Settings",
      }
    },
    {
      path: "/bridge/event-trap",
      name: "eventTrap",
      component: () => import("./views/EventTrap/EventTrap.vue"),
      meta: {
        title: "Event Trap",
      }
    },

  ],
});
