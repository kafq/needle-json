import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button } from './components/Button'

import './ui.css'

declare function require(path: string): any

const App = () => {

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }

  const handleChangeButton = e => {
    let fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);

    fileReader.onload = () => {
      try {
        let obj = JSON.parse(fileReader.result as string);
        console.log(obj)
        // let clearedFromNull = clearNullValues(obj);

        // loadOperationView(groupFlattenedObj(clearedFromNull));
      } catch (error) {
        console.error(error, 'Something wrong with the file. Check the structure');
      }
    };
    e.target.value = '';
  };


  return <div>
    <img src={require('./logo.svg')} />
    <h2>Rectangle Creator</h2>

    <Button isFileType onChange={handleChangeButton} onClick={() => { }} />
    <button onClick={onCancel}>Cancel</button>
  </div>
}

ReactDOM.render(<App />, document.getElementById('react-page'))