import { useState } from 'react'
import './App.css'
import DraggableTable from './DraggableTable';
import AddGroupModal from './AddGroupModal';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


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
  const queryClient = useQueryClient();

  const addGroup = useMutation({
    mutationFn: async (group: GroupData) =>
      await fetch(`http://localhost:3000/group`, {
        body: JSON.stringify(group), method: "POST", headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json()
          } else {
            res.text().then(e => alert(`status ${res.status} : ${e}`))
          }

        })
    , onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }

  })



  // const [groups, setGroups] = useState<Group[]>(data);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);

  const { isPending, error, data: groups } = useQuery<Group[]>({
    queryKey: ["groups", [] as Group[]],
    queryFn: async () => await fetch(`http://localhost:3000/groups`).then((res) => res.json()),
  });


  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;


  const handleAdd = (form: FormData) => {
    const criteriaKeyPrefix = 'criteria-';
    const newItem = (Array.from(form.entries()) as [string, string][]).reduce((acc, [key, value]) => {

      switch (key) {
        case key.match(new RegExp(`^${criteriaKeyPrefix}`))?.input:
          const criteriaType = key.slice(criteriaKeyPrefix.length) as 'from' | 'to';
          acc.criteria[criteriaType].push(value);
          break;
        case 'name':
          if (value) acc.name = value;
          break;
        case 'description':
          if (value) acc.description = value;
          break;

        case 'shipment':
          acc.alertRules.shipment = value === 'on';
          break;
        case 'temperature':
          acc.alertRules.temperature.on = value === 'on';
          break;
        case 'minTemp':
          acc.alertRules.temperature.min = parseInt(value);
          break;
        case 'maxTemp':
          acc.alertRules.temperature.max = parseInt(value);
          break;
        default:
          if (key.startsWith(criteriaKeyPrefix)) {
            const criteriaType = key.slice(criteriaKeyPrefix.length) as 'from' | 'to';
            acc.criteria[criteriaType].push(value);
          }
          break;
      }

      return acc;
    }, {
      criteria: { from: [], to: [] },
      alertRules: { shipment: false, temperature: { on: false } },

    } as GroupData);

    addGroup.mutate(newItem) //better in BE

    // groups.concat({ groupId: Date.now().toString(), ...newItem })
    setShowAddGroupModal(false);
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">

      <DraggableTable data={groups} /**setData={setGroups} */ />
      <button onClick={() => setShowAddGroupModal(true)} className="btn mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">

        add new item</button>
      {showAddGroupModal ? <AddGroupModal submit={handleAdd} setShowModal={setShowAddGroupModal} /> : null}
    </div>

  )
}

export default App
