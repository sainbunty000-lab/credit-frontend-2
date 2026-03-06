const KEY="credit_app_v1";

export function loadApp(){

return JSON.parse(localStorage.getItem(KEY)) || {};

}

export function saveApp(data){

localStorage.setItem(KEY,JSON.stringify(data));

}

export function updateModule(module,data){

const app=loadApp();

app[module]=data;

saveApp(app);

}
