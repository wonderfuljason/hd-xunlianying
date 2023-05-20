import { initRouter, initRouterLayout } from '@hsui/core'

export default initRouter(
  [
    {
      path: '/',
      component: initRouterLayout((layout) => {
        return import('@/layouts/' + layout + '.vue')
      }),
      children: [
        {
          name: 'index',
          path: '',
          component: Index,
        },
        {
          name: 'module',
          path: 'module',
          component: Module,
          children: [
            {
              name: 'module-account',
              path: 'account',
              component: ModuleAccount,
            },
            {
              name: 'module-bankcard',
              path: 'bankcard',
              component: ModuleBankcard,
            },
            {
              name: 'module-buy',
              path: 'buy',
              component: ModuleBuy,
            },
            {
              name: 'module-id',
              path: 'id',
              component: ModuleId,
            },
            {
              name: 'module-liquidation',
              path: 'liquidation',
              component: ModuleLiquidation,
            },
            {
              name: 'module-orderservice',
              path: 'orderservice',
              component: ModuleOrderservice,
            },
            {
              name: 'module-production',
              path: 'production',
              component: ModuleProduction,
            },
            {
              name: 'module-sell',
              path: 'sell',
              component: ModuleSell,
            },
          ],
        },
        {
          name: '__404__',
          path: '*',
          component: __404__,
        },
      ],
    },
  ],
  { base: '/', mode: 'hash' }
)

function Index() {
  return import(/* webpackChunkName: "index" */ '@/views/index.vue')
}
function Module() {
  return import(/* webpackChunkName: "module" */ '@/views/module.vue')
}
function ModuleAccount() {
  return import(
    /* webpackChunkName: "module-account" */ '@/views/module/account.vue'
  )
}
function ModuleBankcard() {
  return import(
    /* webpackChunkName: "module-bankcard" */ '@/views/module/bankcard.vue'
  )
}
function ModuleBuy() {
  return import(/* webpackChunkName: "module-buy" */ '@/views/module/buy.vue')
}
function ModuleId() {
  return import(/* webpackChunkName: "module-id" */ '@/views/module/id.vue')
}
function ModuleLiquidation() {
  return import(
    /* webpackChunkName: "module-liquidation" */ '@/views/module/liquidation.vue'
  )
}
function ModuleOrderservice() {
  return import(
    /* webpackChunkName: "module-orderservice" */ '@/views/module/orderservice.vue'
  )
}
function ModuleProduction() {
  return import(
    /* webpackChunkName: "module-production" */ '@/views/module/production.vue'
  )
}
function ModuleSell() {
  return import(/* webpackChunkName: "module-sell" */ '@/views/module/sell.vue')
}
function __404__() {
  return import(/* webpackChunkName: "__404__" */ '@/views/__404__.vue')
}
