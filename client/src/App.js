import { useState, useEffect } from 'react';
import { Input, Space, Select, Button } from 'antd';
import { isMobile } from 'react-device-detect';

const { TextArea } = Input
const { Option } = Select;

function App() {

  const [ isLoading, setIsLoading ] = useState(false);
  const [ languagesAreLoading, setLanguagesAreLoading ] = useState(true);
  const [ input, setInput ] = useState('')
  const [ output, setOutput ] = useState('')
  const [ inputLanguage, setInputLanguage ] = useState('')
  const [ outputLanguage, setOutputLanguage ] = useState('')
  const [ languages, setLanguages ] = useState([])

  /**
   * LOAD LANGUAGES
   */
  useEffect(() => {
    setLanguagesAreLoading(true)
    fetch('./languages').then(res => res.json()).then(data => {
      setLanguages(data.result.languages.sort((a, b) => b.language_name - a.language_name))
    }).then(setLanguagesAreLoading(false))
  }, [])

  const translate = () => {
    setIsLoading(true)
    fetch('./translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lang: `${inputLanguage}-${outputLanguage}`,
        text: input
      })  
    }).then(res => res.json()).then(data => {
      const res = data.result?.translations[0]?.translation
      setOutput(res ? res : 'Error: Sorry, not all languages combination are supported!')
    }).then(() => setIsLoading(false))
  }

  return (
    <div className="container">
      <Space direction="vertical">
        <Space direction={isMobile && 'vertical'}>
          <Space direction="vertical">
            <Select open className="select" placeholder="Select a Language" onChange={(e) => setInputLanguage(e)}>
              {
                languages.map((lang) => {
                  return <Option value={lang.language}>{lang.language_name}</Option>
                })
              }
            </Select>
            <TextArea id={isMobile ? 'input-mob': 'input'} value={input} onChange={(e) => setInput(e.target.value)} rows={10} onResize={() => null}/>
          </Space>
          <Space direction="vertical">
            <Select className="select" placeholder="Select a Language" onChange={(e) => setOutputLanguage(e)}>
              {
                languages.map((lang) => {
                  return <Option value={lang.language}>{lang.language_name}</Option>
                })
              }
            </Select>
            <TextArea id={isMobile ? 'output-mob': 'output'} value={output} onChange={() => null} rows={10} />
          </Space>
        </Space>
      </Space>
      <div className="button-container">
        <Button type="primary" onClick={translate} loading={isLoading} disabled={languagesAreLoading || inputLanguage === outputLanguage || inputLanguage === '' || outputLanguage === '' || input === ''}>Translate</Button>
      </div>
    </div>
  );
}

export default App;
