import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PhysiqueProvider } from './context/PhysiqueContext';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Auth from 'src/components/Auth';
import Export from './components/Export';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <PhysiqueProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="py-8 px-4">
            <ErrorBoundary>
              <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/auth" component={Auth} />
                <Route path="/export" component={Export} />
                <Route path="/" exact component={Dashboard} />
                {/* Add more routes as needed */}
              </Switch>
            </ErrorBoundary>
          </main>
        </div>
      </Router>
    </PhysiqueProvider>
  );
};

export default App;