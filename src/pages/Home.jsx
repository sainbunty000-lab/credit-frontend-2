import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{padding:"40px"}}>
      <h1>AI Credit Underwriting Platform</h1>

      <ul>
        <li><Link to="/working-capital">Working Capital</Link></li>
        <li><Link to="/agriculture">Agriculture</Link></li>
        <li><Link to="/banking">Banking</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/underwriting">Underwriting</Link></li>
        <li><Link to="/final-report">Final Report</Link></li>
      </ul>
    </div>
  );
}
