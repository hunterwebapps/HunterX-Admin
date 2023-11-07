import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { getExecutionDecisionDetails, getExecutionDecisionDetailsList } from '../api/executionDecisionDetailsService'
import ExecutionDecisionDetailsList from './ExecutionDecisionDetailsList';
import ExecutionDecisionDetailsChart from './ExecutionDecisionDetailsChart';

export default function ExecutionDecisionDetails() {
  const [selectedDetailsId, setSelectedDetailsId] = useState(null);
  const { data: detailsList = { items: [] } } = useQuery({
    queryKey: ['execution-decision-details-list'],
    queryFn: getExecutionDecisionDetailsList,
  })

  const { data: details } = useQuery({
    queryKey: ['execution-decision-details'],
    queryFn: () => getExecutionDecisionDetails(selectedDetailsId),
    enabled: !!selectedDetailsId,
  })

  const handleSelectDetails = (detailsId) => {
    setSelectedDetailsId(detailsId);
  }

  return (
    <>
      <h1>Execution Decision Details</h1>
      {!details && (
        <ExecutionDecisionDetailsList
          items={detailsList.items}
          onSelect={handleSelectDetails}
        />
      )}
      {details && (
        <ExecutionDecisionDetailsChart details={details} />
      )}
    </>
  )
}
