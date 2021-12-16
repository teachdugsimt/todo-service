import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Input } from 'antd'
import { TodoList } from './components';
import 'antd/dist/antd.css';
import TodoApi from './services/todo-api'

const COMPLETED_STATUS = "COMPLETED"
const MAX_WIDTH = { width: '100%' }
const FULL_FLEX = { background: 'white', display: 'flex', flex: 1 }
const ROOT = { ...FULL_FLEX, ...MAX_WIDTH, }
const TEXT_COLOR = { color: 'black' }
const INPUT_TODO = { width: '25%', marginRight: 10 }


function App() {
  const [data, setData] = useState([])
  const [selectedRowKeys, setselectedRowKeys] = useState([])

  const [todo, settodo] = useState('')
  const [loading, setloading] = useState(false)

  const getTodoList = async () => {
    const response = await TodoApi.getTodoList()
    console.log(`🚀  ->  response`, response);
    if (response.ok) {
      const tmpSelectedRowKey = []
      const tmpResponse = response?.data ? response?.data.map((e, i) => {
        e.key = i
        if (!e.subtasks.length && e.status == COMPLETED_STATUS) tmpSelectedRowKey.push(i)
        if (e.subtasks.length) {
          e.children = e.subtasks
          e.children.map((ch) => {
            const keysSubTask = ch.id * 1000
            ch.key = keysSubTask
            if (ch.status == COMPLETED_STATUS) tmpSelectedRowKey.push(keysSubTask)
          })
        }
        if (e.subtasks.length) e.subtasks = []
        return e
      }) : []
      setData(tmpResponse)
      setselectedRowKeys(tmpSelectedRowKey)
      setloading(false)
    } else {
      setData([])
      setselectedRowKeys([])
      setloading(false)
      alert("Database has some problem")
    }
  }

  useEffect(() => {
    setloading(true)
    getTodoList()
  }, [])

  const onChangeText = (e) => {
    settodo(e?.target?.value)
  }

  const submitTodo = async () => {
    if (todo) {
      setloading(true)
      const response = await TodoApi.createTodo({ title: todo })
      settodo('')
      if (response.ok) {
        await getTodoList()
      } else {
        alert("Create todo unsuccessfull. " + JSON.stringify(response?.problem || response?.data?.message))
      }
    }

  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={ROOT}>
          <div style={FULL_FLEX}>
            <Container style={MAX_WIDTH}>
              <Row>
                <Col>
                  <h3 style={TEXT_COLOR}>Todo App</h3>
                </Col>
                <Col xs={12} lg={12}>
                  <Row>
                    <Input onChange={onChangeText} placeholder={"What to do?"} style={INPUT_TODO} value={todo} />
                    <Button onClick={submitTodo}>New List</Button>
                  </Row>
                  <Row style={MAX_WIDTH}>
                    <Col xs={10} lg={10} style={{ paddingTop: 20, margin: '0px 20px 0px 20px' }}>
                      <TodoList loading={loading} todoList={data} selectedRowKeysProps={selectedRowKeys} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
