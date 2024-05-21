import { useState } from "react";
import { Group } from "./App";
import InfoModal from "./InfoModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface prop {
  // setData: React.Dispatch<React.SetStateAction<Group[]>>
  data: Group[]
}

const DraggableTable = ({ data, /*setData*/ }: prop) => {
  const queryClient = useQueryClient();

  const changePriority = useMutation({
    mutationFn: async (groups: Group[]) =>
      await fetch(`http://localhost:3000/group`, { body: JSON.stringify(groups), method: "PUT" }).then((res) => res.json())
    , onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }

  })


  const [selectedRow, setSelectedRow] = useState<Group | null>(null);

  const onDragStart = (event: React.DragEvent<HTMLTableRowElement>, dragPriority: number, dragIndex: number) => {
    event.dataTransfer.setData('dragPriority', JSON.stringify({ priority: dragPriority, index: dragIndex }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent<HTMLTableRowElement>, dropPriority: number, dropIndex: number) => {
    event.preventDefault();
    const drag = JSON.parse(event.dataTransfer.getData('dragPriority')) as {
      priority: number;
      index: number;
    }

    if (drag.priority !== dropPriority) {


      const [draggedItem] = data.splice(drag.index, 1);
      data.splice(dropIndex, 0, draggedItem);
      changePriority.mutate(data.map((item, index) => ({
        ...item,
        priority: index + 1,
      })))

      // setData(updatedData);
    }
  };

  return (
    <>
      <table className="table-auto w-full text-left text-white">
        <thead>

          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Criteria from </th>
            <th>Criteria to </th>
            <th>Alert Shipment</th>
            <th>Alert Temp </th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.groupId}
              draggable
              onDragStart={(event) => onDragStart(event, item.priority, index)}
              onDragOver={onDragOver}
              onDrop={(event) => onDrop(event, item.priority, index)}
              onClick={() => setSelectedRow(item)}
            >
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.criteria.from.join(', ')}</td>
              <td>{item.criteria.to.join(', ')}</td>
              <td>{item.alertRules.shipment.toString()}</td>
              <td>  {item.alertRules.temperature.on ?
                `Min: ${item.alertRules.temperature.min}, Max: ${item.alertRules.temperature.max}`
                :
                'false'
              }</td>

              <td>{item.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRow && <InfoModal selectedRow={selectedRow} setShowModal={setSelectedRow}></InfoModal>}
    </>

  );
}
export default DraggableTable 