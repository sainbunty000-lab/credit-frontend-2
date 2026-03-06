export default function formatCurrency(val){

return new Intl.NumberFormat("en-IN",{
style:"currency",
currency:"INR",
maximumFractionDigits:0
}).format(val || 0)

}
