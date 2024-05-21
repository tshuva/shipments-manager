import { useState } from 'react'
import './App.css'
import DraggableTable from './DraggableTable';
import AddGroupModal from './AddGroupModal';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAddGroup from './useAddGroup';


type Temperature = { on: boolean, min?: number, max?: number }

export interface GroupData {
  name?: string;
  description?: string;
  criteria: { from: string[], to: string[] };
  alertRules: { shipment: boolean, temperature: Temperature };
}

export type Group = {
  priority: number;
  groupId: string;
} & GroupData


function App() {


  const [showAddGroupModal, setShowAddGroupModal] = useState(false);

  const { isPending, error, data: groups } = useQuery<Group[]>({
    queryKey: ["groups", [] as Group[]],
    queryFn: async () => await fetch(`http://localhost:3000/groups`,).then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <DraggableTable groups={groups} />
      <button onClick={() => setShowAddGroupModal(true)} className="btn mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        add new item
      </button>
      {showAddGroupModal ? <AddGroupModal setShowModal={setShowAddGroupModal} /> : null}
    </div>
  )
}

export default App
