import React, { CSSProperties } from 'react'
import { Modal, Button } from 'antd'
import './modal.css'

interface SimpleModal {
    title: string
    visible: boolean
    width?: number
    onOk?: () => void
    onCancel?: () => void
    onEdit?: () => void
    textCancel?: string
    type: 'confirm' | 'request' | 'edit'
    textOk?: string
    textEdit?: string
    fetching?: boolean
    style?: CSSProperties
    modalString?: string
}

export const SimpleModal = (props: any) => {
    return (
        <div>
            <Modal
                title={props.title}
                visible={props.visible}
                width={props.width || 520}
                onOk={() => props.onOk()}
                onCancel={() => props.onCancel()}
                footer={[
                    <Button key="cancel" onClick={() => props.onCancel()} className="default">
                        {props.textCancel}
                    </Button>,

                    props.type == "confirm" && (<Button key="submit" type="primary" className="primary" onClick={() => props.onOk()}>
                        {props.textOk}
                    </Button>),
                    props.type == "request" && (<Button key="submit" type="primary" loading={props.fetching} onClick={() => props.onOk()}>
                        {props.textOk}
                    </Button>),
                    props.type == "edit" && (<Button key="edit" type="primary" onClick={() => props.onEdit()}>
                        {props.textEdit}
                    </Button>),
                ]}
                maskClosable={false}
                style={props.style}

            >
                {typeof props.modalString === 'string' ? <div dangerouslySetInnerHTML={{ __html: props.modalString }} /> : props.modalString}
            </Modal>
        </div>
    )
}

