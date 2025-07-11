import { Component } from 'react';
import './App.css';
import { Wrapper } from './components/wrapper/wrapper';
import { TopControls } from './components/top-controls/top-controls';
import { Results } from './components/results/results';

class App extends Component {
  render() {
    return (
      <>
        <Wrapper>
          <h2>
            React. Task #1 Cross-check: React project setup. Class components.
            Error boundary.
          </h2>

          <TopControls />

          <Results />
        </Wrapper>
      </>
    );
  }
}

export default App;
