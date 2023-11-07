import { arrayOf, object, func } from 'prop-types'
import { Table } from 'antd'
import { useMemo } from 'react'

ExecutionDecisionDetailsList.propTypes = {
  items: arrayOf(object).isRequired,
  onSelect: func.isRequired,
}

const columns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Stop Loss',
    dataIndex: 'stopLoss',
    key: 'stopLoss',
  },
  {
    title: 'Strategy',
    dataIndex: 'strategy',
    key: 'strategy',
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
]

export default function ExecutionDecisionDetailsList({ items, onSelect }) {
  const dataSource = useMemo(() => items.map(x => ({
    key: x.id,
    id: x.id,
    symbol: x.symbol,
    action: x.executionDecision.action,
    quantity: x.executionDecision.quantity,
    price: x.executionDecision.price,
    stopLoss: x.executionDecision.stopLoss,
    strategy: x.strategyName,
    createdAt: x.createdAt,
  })), [items]);

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        onRow={(record) => ({
          onClick: () => onSelect(record.id),
        })}
      />
    </>
  )
}
