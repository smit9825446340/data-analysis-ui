import TimeSeriesChart from './Components/charts/time-series';
import ClusterAnalysis from './Components/charts/cluster';
import CohortAnalysis from './Components/charts/cohort';
import RegressionAnalysis from './Components/charts/regression';

function App() {
  return (
    <div className="App">
      <TimeSeriesChart />
      <ClusterAnalysis />
      <CohortAnalysis />
      <RegressionAnalysis />
    </div>
  );
}

export default App;
