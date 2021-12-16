import React, { useState, useEffect } from 'react'
import { Table, Button, Input } from 'antd';
import { ITodo, ISubTask } from '../../services';
import { SimpleModal } from '../simple-modal/simple-modal'
import todoApi from '../../services/todo-api';
import subTaskApi from '../../services/sub-task-api';
import TodoApi from '../../services/todo-api'

const COMPLETED_STATUS = "COMPLETED"
const processJobStatus = (record: any) => {
  let status = ''
  if (record?.children?.length) {
    const finish = record.children.filter((e: any) => e.status == COMPLETED_STATUS)
    if (!finish?.length) return status + `0 of ${record.children.length} completed`
    status += `${finish.length} of ${record.children.length} completed`
    return status
  }
  return status
}

const renderTextStatus = (record: any) =>
  <span>{record?.children?.length ? processJobStatus(record) : "-"}</span>



interface PropsTodoList {
  todoList: ITodo[] | undefined
  selectedRowKeysProps: number[]
  loading?: boolean
}

export const TodoList = (props: PropsTodoList) => {
  const { todoList, selectedRowKeysProps, loading } = props

  const [loadingSub, setloadingSub] = useState<boolean>(false)

  const [visible, setvisible] = useState<boolean>(false)
  const [data, setData] = useState<ITodo[]>(todoList || [])
  const [checkStrictly] = useState(false);
  const [selectedRowKeys, setselectedRowKeys] = useState<number[]>(selectedRowKeysProps || [])
  const [recordFocus, setrecordFocus] = useState<ITodo | null>(null)
  const [subtaskTitle, setsubtaskTitle] = useState<string>('')

  const openModal = (record: ITodo) => {
    setrecordFocus(record)
    setvisible(true)
  }

  const renderActionButton = (record: any) => {
    if (!record.todo_id)
      return <Button onClick={() => openModal(record)}>add task</Button>
    else return <div></div>
  }

  const columns: any = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: "status",
      render: (text: any, record: any) => renderTextStatus(record)
    },
    {
      title: 'Action',
      dataIndex: "status",
      render: (text: any, record: any) => renderActionButton(record)
    },
  ];

  const updateTodo = async (record: ITodo) => {
    setloadingSub(true)
    await todoApi.updateTodo(record.id, {
      status: record.status == "PENDING" ?
        "COMPLETED" : "PENDING"
    })
    await getTodoList()
  }

  const updateSubTask = async (record: ISubTask) => {
    setloadingSub(true)
    const todoOfThisTask = data?.find(e => e.id == record.todo_id)
    await subTaskApi.updateSubTask(record.id, {
      updateBody: {
        status: record.status == "PENDING" ?
          "COMPLETED" : "PENDING"
      },
      currentTodoStatus: todoOfThisTask?.status ?? "PENDING",
      todoId: record.todo_id,
      subtasks: todoOfThisTask?.children ?? []
    })
    await getTodoList()
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setselectedRowKeys(selectedRowKeys)
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log("On select row :: ", record, selected, selectedRows);
      if (record?.todo_id) updateSubTask(record)
      else updateTodo(record)
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log(selected, selectedRows, changeRows);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys: any) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key: any, index: any) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setselectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys: any) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key: any, index: any) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setselectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const onCancel = () => {
    setvisible(false)
  }

  const onSubmit = async () => {
    setloadingSub(true)
    const responseAddSubTask = await subTaskApi.createSubTask({
      todoId: recordFocus?.id || 0,
      title: subtaskTitle
    })
    if (responseAddSubTask.ok) {
      setData([])
      await getTodoList()
    }

    setsubtaskTitle('')
    setvisible(false)
    setrecordFocus(null)
    setloadingSub(false)
  }

  const getTodoList = async () => {
    setloadingSub(true)
    const response = await TodoApi.getTodoList()
    if (response.ok) {
      const tmpSelectedRowKey: number[] = []
      const tmpResponse = response?.data ? response?.data.map((e: ITodo, i: number) => {
        e.key = i
        if (!e.subtasks.length && e.status == COMPLETED_STATUS) tmpSelectedRowKey.push(i)
        if (e.subtasks.length) {
          e.children = e.subtasks
          e.children.map((ch: ISubTask) => {
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
      setloadingSub(false)
    }
  }

  useEffect(() => {
    if (todoList) setData(todoList)
  }, [todoList])
  useEffect(() => {
    if (selectedRowKeysProps) setselectedRowKeys(selectedRowKeysProps)
  }, [selectedRowKeysProps])

  useEffect(() => {
    const cssHeader: any = document.querySelector(".ant-table-thead")
    cssHeader.style.cssText += "display: none;"
  }, [])

  return (
    <>
      <Table
        loading={loading || loadingSub}
        rowKey={'key'}
        columns={columns}
        rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={data}
      />
      <SimpleModal
        title={"Add new sub task"}
        type={"confirm"}
        onOk={onSubmit}
        onCancel={onCancel}
        textCancel={"Cancel"}
        textOk={"Ok"}
        textEdit={"Edit"}
        width={600}
        modalString={<div>
          <Input onChange={(e) => setsubtaskTitle(e.target.value)} value={subtaskTitle} />
        </div>}
        visible={visible}
      />
    </>
  );
}

