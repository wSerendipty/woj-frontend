import {createRouter, createWebHistory} from "vue-router";

const pages = import.meta.glob("../views/**/page.js", {
    eager: true,
    import: "default",
});

const modules = import.meta.glob("../views/**/Index.vue");

const routers = Object.entries(pages).map(([path, meta]) => {
    const pageJsPath = path;
    path = path.replace("../views", "").replace("/page.js", "");
    path = path || "/";
    const name = path.split("/").filter(Boolean).join("-");
    const compPath = pageJsPath.replace("page.js", "Index.vue");
    return {
        path,
        name,
        component: modules[compPath],
        meta,
    };
});

routers.push({
    path: "/",
    redirect: "/index"
});

const router = createRouter({
    // 指定路由模式
    history: createWebHistory(),
    // 路由地址
    routes: routers
});

// 全局路由前置钩子
router.beforeEach( (to, from, next)=>{
    if (to.matched.length === 0) {
       next('/resultPage/404');
    }else {
        next();
    }
})

//全局路由后置钩子
router.afterEach((to) => {
    document.title = to.meta.title;
});

console.log("routers=====>", routers);

export default router;
