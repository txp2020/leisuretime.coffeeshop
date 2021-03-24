export const routes = [{
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('../views/Main.vue'),
        children: [{
                path: '/home',
                name: 'Home',
                component: () => import('../views/Home.vue')
            },
            {
                path: '/menu',
                name: 'Menu',
                component: () => import('../views/Menu.vue')
            },
            {
                path: '/shopcat',
                name: 'Shopcat',
                component: () => import('../views/Shopcat.vue')
            },
            {
                path: '/my',
                name: 'My',
                component: () => import('../views/My.vue')
            }
        ]
    },

    {
        path: '/detail/:pid',
        name: 'Detail',
        component: () => import('../views/Detail.vue')
    },

    {
        path: '/addaddress',
        name: 'Addaddress',
        component: () => import('../views/Addaddress.vue')
    },
    {
        path: '/pay',
        name: 'Pay',
        component: () => import('../views/Pay.vue')
    },
    {
        path: '/addresslist',
        name: 'AddressList',
        component: () => import('../views/AddressList.vue')
    },

    {
        path: '/order',
        name: 'Order',
        component: () => import('../views/Order.vue')
    },

    {
        path: '/collection',
        name: 'Collection',
        component: () => import('../views/Collection.vue')
    },
    {
        path: '/secure',
        name: 'Secure',
        component: () => import('../views/Secure.vue')
    },
    {
        path: '/account',
        name: 'Account',
        component: () => import('../views/Account.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },
    {
        path: '/forgot',
        name: 'Forgot',
        component: () => import('../views/Forgot.vue')
    },
    {
        path: '/history',
        name: 'History',
        component: () => import('../views/History.vue')
    },
    

    {
        path: '*',
        redirect: {
            name: 'Home'
        }
    }
]