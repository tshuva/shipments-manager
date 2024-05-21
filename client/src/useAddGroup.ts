import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupData } from './App';

const useAddGroup = () => {
  const queryClient = useQueryClient();

  const addGroupMutation = useMutation({
    mutationFn: async (group: GroupData) =>
      await fetch(`http://localhost:3000/group`, {
        body: JSON.stringify(group),
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.text().then((e) => {
            alert(`status ${res.status} : ${e}`);
            throw new Error(`status ${res.status} : ${e}`);
          });
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const handleAddGroup = (form: FormData, setShowAddGroupModal: (value: boolean) => void) => {
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
      alertRules: { shipment: false, temperature: { on: false, min: 0, max: 0 } },
    } as GroupData);

    addGroupMutation.mutate(newItem);
    setShowAddGroupModal(false);
  };

  return { addGroupMutation, handleAddGroup };
};

export default useAddGroup;
