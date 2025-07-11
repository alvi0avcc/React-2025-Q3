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
          <h2>Star Trek API. Class-components</h2>

          <TopControls />

          <Results />
        </Wrapper>
      </>
    );
  }
}

export default App;
