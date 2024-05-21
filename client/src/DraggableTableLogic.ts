import { Group } from "./App";

export const onDragStart = (event: React.DragEvent<HTMLTableRowElement>, dragPriority: number, dragIndex: number) => {
  event.dataTransfer.setData('dragPriority', JSON.stringify({ priority: dragPriority, index: dragIndex }));
  event.dataTransfer.effectAllowed = 'move';
};

export const onDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

export const dropLogic = (event: React.DragEvent<HTMLTableRowElement>, dropPriority: number, dropIndex: number, data: Group[]) => {
  event.preventDefault();
  const drag = JSON.parse(event.dataTransfer.getData('dragPriority')) as {
    priority: number;
    index: number;
  }
  if (drag.priority !== dropPriority) {


    const [draggedItem] = data.splice(drag.index, 1);
    data.splice(dropIndex, 0, draggedItem);
    return data.map((item, index) => ({
      ...item,
      priority: index + 1,
    }))
  }
}
