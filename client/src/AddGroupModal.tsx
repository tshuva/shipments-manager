import useAddGroup from './useAddGroup';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const SECRET_API_KEY='Bearer  737|o8NCE1TFHqAQ15lW6dCZZlyDmDJCGJixA8JeF2NG' // should not be upload to git
const AddGroupModal = ({ setShowModal }: { setShowModal: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const [enableTemperatureAlert, setEnableTemperatureAlert] = useState(false);

  const { handleAddGroup } = useAddGroup();

  const { isPending, error, data: countries } = useQuery({
    queryKey: ["countries", []],
    queryFn: async () => await fetch(`https://restfulcountries.com/api/v1/countries`, { headers: { Authorization:SECRET_API_KEY  } }).then((res) => res.json()),
  });
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto ">
        <h2 className="text-2xl font-semibold text-white mb-4">Add New Item</h2>
        <form action={(formData) => handleAddGroup(formData, setShowModal)}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500" // Added focus styles
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500" // Added focus styles
          />
          <div className="flex">
            <div className="flex flex-col mr-4">
              <label htmlFor="criteria-from" className="text-white mb-1">Criteria From:</label>
              <select
                multiple={true}
                name="criteria-from"
                id="criteria-from"
                className="w-full p-2 mb-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500" // Added focus styles
              >
                {countries.data.map((country: any) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="criteria-to" className="text-white mb-1">Criteria To:</label>
              <select
                multiple={true}
                name="criteria-to"
                id="criteria-to"
                className="w-full p-2 mb-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500" // Added focus styles
              >
                {countries.data.map((country: any) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="shipment"
                role="switch"

                name="shipment"
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5  before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-400 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-blue-400 checked:focus:bg-blue-400 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-blue-400 dark:checked:after:bg-blue-400 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
              />
              <label className="ml-3 text-gray-200" htmlFor="shipment">Shipment status</label>
            </div>


            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="temperature"
                  name="temperature"
                  checked={enableTemperatureAlert}
                  onChange={() => setEnableTemperatureAlert((temperatureAlert) => !temperatureAlert)}
                  className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5  before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-400 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-blue-400 checked:focus:bg-blue-400 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-blue-400 dark:checked:after:bg-blue-400 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                />
                <label className="ml-3 text-gray-200" htmlFor="temperature">Temperature alert</label>
              </div>
            </div>
          </div>
          {enableTemperatureAlert && (
            <div className="flex">
              <div className="mr-2">
                <input
                  type="number"
                  placeholder="Min Temp"
                  name="minTemp"
                  className="mb-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max Temp"
                  name="maxTemp"
                  className="mb-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 mb-2  mt-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Item
          </button>
        </form>
        <button
          onClick={() => setShowModal(false)}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Close
        </button> </div>
    </div >
  )
};


export default AddGroupModal;
