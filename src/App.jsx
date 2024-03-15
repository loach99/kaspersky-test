import './App.css'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Table, Upload } from 'antd';
import Papa from 'papaparse';
import { useState } from 'react';
import SplitString from './components/SplitString';


const props = {
  name: 'file',
  action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
  headers: {
    authorization: 'authorization-text',
  },
};

function App() {

  const [data, setData] = useState([]);
  const [json, setJson] = useState([]);
  const [words, setWords] = useState([]);

  function mergeObjectsWithSameId(array) {

    const map = new Map();
    array.forEach(obj => {
      if (map.has(obj.idRow)) {
        const existingObj = map.get(obj.idRow);
        existingObj.word += '|' + obj.word;
      } else {
        map.set(obj.idRow, { idRow: obj.idRow, word: obj.word });
      }
    });
    const result = Array.from(map.values());
    return result;
  }

  function sortAndFillArray(arr) {
    arr.sort((a, b) => a.idRow - b.idRow);
    let stringSvc = ''
    const filledArray = [];
    let currentIdRow = 1;
    
    arr.forEach(obj => {
        while (obj.idRow > currentIdRow) {
            filledArray.push({ idRow: currentIdRow, word: '' });
            currentIdRow++;
        }
        filledArray.push(obj);
        currentIdRow++;
    });

    for (const obj of filledArray) {
      stringSvc += obj.word + '\n';
    }
    return stringSvc
}

  const parseJsonToScv = () => {

    Papa.parse(sortAndFillArray(json), {
      delimiter: ",",
      header: true,
      complete: function (results) {
        const csv = Papa.unparse(results.data);
        const decoder = new TextDecoder('utf-8');
        const blob = new Blob([csv], { type: 'text/csv;UTF-8' });
        const reader = new FileReader();
        reader.onload = function (e) {
          const utf8String = decoder.decode(e.target?.result);
          const utf8Blob = new Blob([utf8String], { type: 'text/csv;UTF-8' });
          const url = URL.createObjectURL(utf8Blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'export.csv';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }
        reader.readAsArrayBuffer(blob);
      }
    })
  }

  const handleChange = (e) => {
    Papa.parse(e.file.originFileObj, {
      header: true,
      complete: (result) => {
        setData(result.data)
        return
      }
    })
  }

  const dataSource = data.map((elem, index) => {
    if (elem.Name) {
      return {
        key: index,
        name: <SplitString
          key={index}
          setWord={setWords}
          setJson={setJson}
          words={words}
          mergeObjectsWithSameId={mergeObjectsWithSameId}
          text={elem.Name}
          index={index}
        />,
        id: index + 1,
      }
    }
  })

  return (
    <>
      <Upload {...props} onChange={handleChange}>
        <Button icon={<UploadOutlined />}>LOAD</Button>
      </Upload>
      {}
      <Table dataSource={dataSource} columns={[
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        }

      ]}
      />
      <button onClick={() => { parseJsonToScv() }}>click</button>
    </>

  )
}

export default App
