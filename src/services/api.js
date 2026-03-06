import axios from "axios";

const API="https://credit-backend-production-d988.up.railway.app";

export const wcUpload = async (bs,pl)=>{

const fd=new FormData();

fd.append("balance_sheet",bs);
fd.append("profit_loss",pl);

return axios.post(`${API}/wc/upload-dual`,fd);

}

export const agriCalculate = async(data)=>
axios.post(`${API}/agriculture/calculate`,data);

export const bankingAnalyze = async(file)=>{

const fd=new FormData();

fd.append("file",file);

return axios.post(`${API}/banking/full-analysis`,fd);

}
